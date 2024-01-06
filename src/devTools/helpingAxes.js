// helpingAxes.js

import * as THREE from 'three';

export function helpAxes(scene, axesLength=5, gridSize=100, gridDivisions=10) {
    const axesHelper = new THREE.AxesHelper(axesLength);
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
    scene.add(axesHelper);
    scene.add(gridHelper);
    return true
}

export function helpSectionObjectCircle(position, color=0xffffff, circleRadius=10, segments=64) {
    const circleGeometry = new THREE.CircleGeometry(circleRadius, segments);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(position.x, position.y - 1, position.z); // Slightly below the square
    circle.rotation.x = -Math.PI / 2; // Rotate to lay flat
    return circle;
}