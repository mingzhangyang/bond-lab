import * as THREE from 'three';
import { ELEMENTS, type ElementType } from './chemistry.ts';

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

export interface DragDataLike {
  getData: (format: string) => string;
  setData?: (format: string, data: string) => void;
  types?: Iterable<string> | ArrayLike<string>;
}

export const ELEMENT_DRAG_MIME_TYPE = 'application/x-bondlab-element';

const DROP_POINTER = new THREE.Vector2();
const DROP_PLANE_NORMAL = new THREE.Vector3();
const DROP_PLANE = new THREE.Plane();
const DROP_TARGET = new THREE.Vector3();
const DROP_ORIGIN = new THREE.Vector3();

export function setElementDragData(dataTransfer: DragDataLike | null, element: ElementType): void {
  if (!dataTransfer?.setData) return;
  dataTransfer.setData(ELEMENT_DRAG_MIME_TYPE, element);
  dataTransfer.setData('text/plain', element);
}

function hasDragFormat(dataTransfer: DragDataLike, format: string): boolean {
  if (!dataTransfer.types) {
    return Boolean(dataTransfer.getData(format));
  }

  return Array.from(dataTransfer.types).includes(format);
}

export function hasElementDragData(dataTransfer: DragDataLike | null): boolean {
  if (!dataTransfer) return false;

  return (
    hasDragFormat(dataTransfer, ELEMENT_DRAG_MIME_TYPE)
    || hasDragFormat(dataTransfer, 'text/plain')
    || getElementFromDragData(dataTransfer) !== null
  );
}

export function getElementFromDragData(dataTransfer: DragDataLike | null): ElementType | null {
  if (!dataTransfer) return null;

  const rawValue = dataTransfer.getData(ELEMENT_DRAG_MIME_TYPE) || dataTransfer.getData('text/plain');
  if (rawValue in ELEMENTS) {
    return rawValue as ElementType;
  }

  return null;
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

export function projectPointerToScenePlane(
  pointer: PointerLike,
  rect: RectLike,
  camera: THREE.Camera,
  raycaster: THREE.Raycaster,
  planePoint: THREE.Vector3 = DROP_ORIGIN,
): THREE.Vector3 | null {
  const ndc = toNormalizedDeviceCoordinates(pointer, rect);

  DROP_POINTER.set(ndc.x, ndc.y);
  raycaster.setFromCamera(DROP_POINTER, camera);

  camera.getWorldDirection(DROP_PLANE_NORMAL);
  DROP_PLANE.set(DROP_PLANE_NORMAL, -DROP_PLANE_NORMAL.dot(planePoint));

  const intersection = raycaster.ray.intersectPlane(DROP_PLANE, DROP_TARGET);
  return intersection ? intersection.clone() : null;
}
