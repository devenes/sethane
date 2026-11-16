import { expect, test } from '@playwright/test';

test.describe('SetHane Production Build E2E (/sethane/ subpath)', () => {
  test('loads dashboard under /sethane/, switches TR/EN, and runs workout timer transitions', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/sethane/');

    await expect(page).toHaveTitle(/SetHane/);
    await expect(page.locator('h1')).toContainText(/Antrenman Seç|Ready to Train/);

    // Navigate to Exercises page and verify 40 animated GIF exercise demonstrations + Pause/Play toggle
    await page.locator('header nav a[href="#/exercises"]').click();
    const cards = page.locator('[data-testid^="exercise-card-"]');
    await expect(cards).toHaveCount(40);

    const firstImg = cards.first().locator('img');
    await expect(firstImg).toBeVisible();
    await expect
      .poll(async () =>
        firstImg.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)
      )
      .toBe(true);

    // Verify WCAG 2.2.2 Pause / Play Animations toggle switches between animated GIF and static PNG poster
    const motionBtn = page.getByTestId('toggle-exercise-animations');
    await expect(motionBtn).toBeVisible();
    await motionBtn.click();
    await expect(firstImg).toHaveAttribute('src', /-poster\.png$/);
    await motionBtn.click();
    await expect(firstImg).toHaveAttribute('src', /\.gif$/);

    // Navigate to Builder, verify animated GIFs, drag-and-drop reorder, and IndexedDB persistence
    await page.locator('header nav a[href="#/builder"]').click();
    const firstBuilderImg = page.getByTestId('builder-item-0').locator('img');
    await expect(firstBuilderImg).toHaveAttribute('src', /dumbbell-thruster\.gif$/);

    // Drag item 0 below item 1 using mouse pointer and verify order updates
    const handle0 = page.getByTestId('builder-drag-handle-0');
    const handle1 = page.getByTestId('builder-drag-handle-1');
    const box0 = await handle0.boundingBox();
    const box1 = await handle1.boundingBox();
    expect(box0).not.toBeNull();
    expect(box1).not.toBeNull();

    await page.mouse.move(box0!.x + 24, box0!.y + box0!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box0!.x + 24, box0!.y + box0!.height / 2 + 12, { steps: 3 });
    await page.mouse.move(box1!.x + 24, box1!.y + box1!.height - 4, { steps: 10 });
    await page.mouse.up();

    await expect(page.getByTestId('builder-item-0').locator('img')).toHaveAttribute(
      'src',
      /mountain-climbers\.gif$/
    );
    await expect(page.getByTestId('builder-item-1').locator('img')).toHaveAttribute(
      'src',
      /dumbbell-thruster\.gif$/
    );

    const nameInput = page.getByTestId('builder-workout-name');
    await nameInput.fill('Playwright Custom Tabata');
    await page.getByTestId('builder-save-btn').click();
    await expect(page.getByTestId('builder-saved-toast')).toBeVisible();

    // Reload page and verify custom workout persisted in IndexedDB
    await page.reload();
    await page.locator('header nav a[href="#/workouts"]').click();
    await expect(page.getByText('Playwright Custom Tabata')).toBeVisible();

    // Verify decluttered home cards (only Start button) & clicking anywhere on a program card opens #/player with full move list + Isınmasız & Düzenle
    await page.locator('header nav a[href="#/"]').click();
    const dumbbellCard = page.getByTestId('workout-card-dumbbell-strength-15');
    await expect(dumbbellCard.locator('button')).toHaveCount(1);
    await dumbbellCard.scrollIntoViewIfNeeded();
    const mediaBox = await dumbbellCard.locator('.media').boundingBox();
    expect(mediaBox).not.toBeNull();
    await page.mouse.click(
      mediaBox!.x + mediaBox!.width / 2,
      mediaBox!.y + mediaBox!.height / 2
    );

    await expect(page).toHaveURL(/#\/player$/);
    await expect(page.getByTestId('workout-player')).toBeVisible();
    await expect(page.getByTestId('btn-start')).toBeVisible();
    await expect(page.getByTestId('btn-start-no-warmup')).toBeVisible();
    await expect(page.getByTestId('btn-player-edit')).toBeVisible();
    await expect(page.locator('[data-testid^="player-exercise-item-"]')).toHaveCount(6);

    // Launch signature workout player and test Start -> Pause -> Skip -> Previous
    await page.locator('header nav a[href="#/"]').click();
    await page.getByRole('button', { name: /10 Dk Tam Vücut HIIT|Start 10-Min Full Body/i }).click();

    await expect(page.getByTestId('workout-player')).toBeVisible();
    await page.getByTestId('btn-start').click();
    await expect(page.getByTestId('btn-pause')).toBeVisible();

    // Skip from Prepare to Warm-up, then skip to Work
    await page.getByTestId('btn-skip').click();
    await page.getByTestId('btn-skip').click();
    await expect(page.getByTestId('player-phase-badge')).toContainText(/ÇALIŞ|WORK/);
    await expect(page.getByTestId('workout-player')).toHaveAttribute('data-phase', 'work');
    await expect(page.locator('body')).toHaveAttribute('data-player-phase', 'work');

    // Skip to Rest and verify full blue background, then Previous back to Work
    await page.getByTestId('btn-skip').click();
    await expect(page.getByTestId('player-phase-badge')).toContainText(/DİNLEN|REST/);
    await expect(page.getByTestId('workout-player')).toHaveAttribute('data-phase', 'rest');
    await expect(page.locator('body')).toHaveAttribute('data-player-phase', 'rest');
    await page.getByTestId('btn-previous').click();
    await expect(page.getByTestId('workout-player')).toHaveAttribute('data-phase', 'work');

    // Pause and resume
    await page.getByTestId('btn-pause').click();
    await expect(page.getByTestId('btn-resume')).toBeVisible();
    await page.getByTestId('btn-resume').click();
    await expect(page.getByTestId('btn-pause')).toBeVisible();
  });

  test('opens 7-day Weekly Program Mode on current day, switches days, customizes moves, and persists across reload', async ({
    page,
  }) => {
    await page.goto('/sethane/#/weekly');
    await expect(page.getByTestId('weekly-program-page')).toBeVisible();

    const dayOrder = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ] as const;
    const expectedToday = await page.evaluate((map) => map[new Date().getDay()], dayOrder);

    await expect(page.getByTestId(`weekly-day-tab-${expectedToday}`)).toHaveAttribute(
      'aria-selected',
      'true'
    );

    // Switch to Tuesday and customize moves (remove one, add Dead Bug)
    await page.getByTestId('weekly-day-tab-tuesday').click();
    await expect(page.getByTestId('weekly-day-tab-tuesday')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.locator('[data-testid^="weekly-exercise-row-"]')).toHaveCount(7);

    await page.getByTestId('weekly-remove-exercise-0').click();
    await expect(page.locator('[data-testid^="weekly-exercise-row-"]')).toHaveCount(6);

    await page.getByTestId('weekly-open-picker-btn').click();
    await page.getByTestId('weekly-picker-add-dead-bug').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid^="weekly-exercise-row-"]')).toHaveCount(7);

    // Reload and verify Tuesday customization persisted in IndexedDB
    await page.reload();
    await page.getByTestId('weekly-day-tab-tuesday').click();
    await expect(page.getByTestId('weekly-reset-day-btn')).toBeVisible();
  });
});
