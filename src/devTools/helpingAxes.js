// helpingAxes.js

import * as THREE from 'three';

export function helpAxes(scene, axesLength=5, gridSize=50, gridDivisions=10) {
    const axesHelper = new THREE.AxesHelper(axesLength);
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
    scene.add(axesHelper);
    scene.add(gridHelper);
    return true
}