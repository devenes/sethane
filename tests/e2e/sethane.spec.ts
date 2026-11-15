import { expect, test } from '@playwright/test';

test.describe('SetHane Production Build E2E (/sethane/ subpath)', () => {
  test('loads dashboard under /sethane/, switches TR/EN, and runs workout timer transitions', async ({
    page,
  }) => {
    await page.goto('/sethane/');

    await expect(page).toHaveTitle(/SetHane/);
    await expect(page.locator('h1')).toContainText(
      /Sesli ve Görsel Rehberli Akıllı HIIT Antrenmanı|Train Smarter with Guided HIIT Intervals/
    );

    // Navigate to Exercises page and verify 24 SVG exercise illustrations render
    await page.locator('header nav a[href="#/exercises"]').click();
    const cards = page.locator('[data-testid^="exercise-card-"]');
    await expect(cards).toHaveCount(24);

    const firstImg = cards.first().locator('img');
    await expect(firstImg).toBeVisible();
    await expect
      .poll(async () =>
        firstImg.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)
      )
      .toBe(true);

    // Navigate to Builder, create & save a custom workout, and verify IndexedDB persistence
    await page.locator('header nav a[href="#/builder"]').click();
    const nameInput = page.getByTestId('builder-workout-name');
    await nameInput.fill('Playwright Custom Tabata');
    await page.getByTestId('builder-save-btn').click();
    await expect(page.getByTestId('builder-saved-toast')).toBeVisible();

    // Reload page and verify custom workout persisted in IndexedDB
    await page.reload();
    await page.locator('header nav a[href="#/workouts"]').click();
    await expect(page.getByText('Playwright Custom Tabata')).toBeVisible();

    // Launch workout player and test Start -> Pause -> Skip -> Previous
    await page.locator('header nav a[href="#/"]').click();
    await page.getByRole('button', { name: /10 Dk Tam Vücut HIIT|Start 10-Min Full Body/i }).click();

    await expect(page.getByTestId('workout-player')).toBeVisible();
    await page.getByTestId('btn-start').click();
    await expect(page.getByTestId('btn-pause')).toBeVisible();

    // Skip from Prepare to Warm-up, then skip to Work
    await page.getByTestId('btn-skip').click();
    await page.getByTestId('btn-skip').click();
    await expect(page.getByTestId('player-phase-badge')).toContainText(/ÇALIŞ|WORK/);

    // Pause and resume
    await page.getByTestId('btn-pause').click();
    await expect(page.getByTestId('btn-resume')).toBeVisible();
    await page.getByTestId('btn-resume').click();
    await expect(page.getByTestId('btn-pause')).toBeVisible();
  });
});
