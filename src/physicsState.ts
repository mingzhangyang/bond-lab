import * as THREE from 'three';

export interface PhysicsSceneState {
  atomPositions: Record<string, THREE.Vector3>;
  atomVelocities: Record<string, THREE.Vector3>;
  lonePairs: Record<string, THREE.Vector3[]>;
  atomMeshRefs: Record<string, THREE.Mesh>;
  bondGroupRefs: Record<string, THREE.Group>;
}

const physicsSceneState: PhysicsSceneState = {
  atomPositions: {},
  atomVelocities: {},
  lonePairs: {},
  atomMeshRefs: {},
  bondGroupRefs: {},
};

export function getPhysicsSceneState(): PhysicsSceneState {
  return physicsSceneState;
}

export function resetPhysicsSceneState(): void {
  // Must mutate in-place rather than reassign: physics.ts exports direct references to these
  // objects (e.g. `export const atomPositions = physicsSceneState.atomPositions`). Replacing
  // the property would break those exported bindings.
  Object.keys(physicsSceneState.atomPositions).forEach((key) => {
    delete physicsSceneState.atomPositions[key];
  });
  Object.keys(physicsSceneState.atomVelocities).forEach((key) => {
    delete physicsSceneState.atomVelocities[key];
  });
  Object.keys(physicsSceneState.lonePairs).forEach((key) => {
    delete physicsSceneState.lonePairs[key];
  });
  Object.keys(physicsSceneState.atomMeshRefs).forEach((key) => {
    delete physicsSceneState.atomMeshRefs[key];
  });
  Object.keys(physicsSceneState.bondGroupRefs).forEach((key) => {
    delete physicsSceneState.bondGroupRefs[key];
  });
}
