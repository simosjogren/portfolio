
import * as THREE from 'three';

// Add point light directly above the given object
export const addPointLight = (position, scene) => {
    const light = new THREE.PointLight(0xffffff, 100, 100);
    light.position.set(position.x, position.y + 10, position.z); // Adjust y position to be above the square
    scene.add(light);
}