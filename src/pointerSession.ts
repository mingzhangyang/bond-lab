interface PointerSessionOptions {
  pointerId: number;
  onMove: (event: PointerEvent) => void;
  onFinish: (completed: boolean) => void;
}

// Register synchronously during pointerdown: an effect can run after pointerup.
// The returned cancellation also owns listener cleanup on component unmount.
export function startPointerSession(target: EventTarget, options: PointerSessionOptions): () => void {
  let active = true;
  const move = (event: Event) => {
    if ((event as PointerEvent).pointerId === options.pointerId) options.onMove(event as PointerEvent);
  };
  const finish = (completed: boolean) => {
    if (!active) return;
    active = false;
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerup', up);
    target.removeEventListener('pointercancel', cancelPointer);
    target.removeEventListener('blur', cancel);
    options.onFinish(completed);
  };
  const up = (event: Event) => {
    if ((event as PointerEvent).pointerId === options.pointerId) finish(true);
  };
  const cancelPointer = (event: Event) => {
    if ((event as PointerEvent).pointerId === options.pointerId) finish(false);
  };
  const cancel = () => finish(false);
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', cancelPointer);
  target.addEventListener('blur', cancel);
  return cancel;
}
