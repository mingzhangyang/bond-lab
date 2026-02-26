export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PointerLike {
  clientX: number;
  clientY: number;
}

export function toNormalizedDeviceCoordinates(
  pointer: PointerLike,
  rect: RectLike,
): { x: number; y: number } {
  return {
    x: ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((pointer.clientY - rect.top) / rect.height) * 2 + 1,
  };
}
