import * as THREE from 'three';

export const floorBaseMaterial = new THREE.MeshBasicMaterial({
  color: 0x00beff,
  transparent: true,
  opacity: 0.1,
  depthWrite: false
});

export const floorLineMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFF8DC,
  transparent: true,
  opacity: 0.1,
  wireframe: true,
});