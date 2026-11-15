import { useEffect, type RefObject } from 'react';

/**
 * Syncs open state with native modal <dialog>.showModal() and provides the
 * mandatory light-dismiss backdrop click fallback for browsers (such as Safari)
 * where HTMLDialogElement.prototype.closedBy is not yet supported.
 */
export function useLightDismissDialog(
  dialogRef: RefObject<HTMLDialogElement | null>,
  open: boolean
): void {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [dialogRef, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (event: PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    const handlePointerDown = (event: PointerEvent) => {
      pressedOutside = event.target === dialog && isOutside(event);
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (pressedOutside && event.target === dialog && isOutside(event)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dialogRef]);
}
