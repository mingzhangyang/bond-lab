interface PointerSessionOptions {
  pointerId: number;
  onMove: (event: PointerEvent) => void;
  onFinish: (completed: boolean) => void;
  // Called once when another finger joins a touch gesture. The caller may
  // invalidate tap eligibility without ending a Build drag, or cancel a
  // pending destructive Delete session.
  onAdditionalTouch?: (cancel: () => void) => void;
  // External ownership can change without a pointerup (e.g. a second finger).
  // The session also owns the cancellation subscription's cleanup.
  subscribeToCancel?: (cancel: () => void) => () => void;
}

// Register synchronously during pointerdown: an effect can run after pointerup.
// The returned cancellation also owns listener cleanup on component unmount.
export function startPointerSession(target: EventTarget, options: PointerSessionOptions): () => void {
  let active = true;
  let unsubscribe = () => {};
  let sawAdditionalTouch = false;
  const notifyAdditionalTouch = () => {
    if (!active || sawAdditionalTouch) return;
    sawAdditionalTouch = true;
    options.onAdditionalTouch?.(cancel);
  };
  const additionalTouchDown = (event: Event) => {
    const pointer = event as PointerEvent;
    if (pointer.pointerType === 'touch' && pointer.pointerId !== options.pointerId) notifyAdditionalTouch();
  };
  const multiTouchStart = (event: Event) => {
    // Safari can omit the extra pointerdown yet still expose both contacts.
    // Call back once even if touchstart and pointerdown both arrive.
    if ((event as TouchEvent).touches.length > 1) notifyAdditionalTouch();
  };
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
    if (options.onAdditionalTouch) {
      target.removeEventListener('pointerdown', additionalTouchDown, true);
      target.removeEventListener('touchstart', multiTouchStart, true);
    }
    unsubscribe();
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
  if (options.onAdditionalTouch) {
    // Capture the second touch even if the 3D object stops propagation.
    target.addEventListener('pointerdown', additionalTouchDown, true);
    target.addEventListener('touchstart', multiTouchStart, { capture: true, passive: true });
  }
  const stopWatching = options.subscribeToCancel?.(cancel);
  if (stopWatching) {
    // A subscription may synchronously cancel if ownership was already lost.
    if (active) unsubscribe = stopWatching;
    else stopWatching();
  }
  return cancel;
}
