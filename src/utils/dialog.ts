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

    const handleClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (isDialogContent) return;
      dialog.close();
    };

    dialog.addEventListener('click', handleClick);
    return () => dialog.removeEventListener('click', handleClick);
  }, [dialogRef]);
}
