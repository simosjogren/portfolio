// lightningsettings.js

import * as THREE from 'three';

export const addPointLights = (scene) => {
    // Lightsource 1
    const pointLight1 = new THREE.PointLight(0xffffff, 100000, 100000);
    pointLight1.position.set(-200, 50, -200); // Position the light

    // Lightsource 2
    const pointLight2 = new THREE.PointLight(0xffffff, 100000, 100000);
    pointLight2.position.set(200, 50, 200); // Position the light

    // Insert them to scene
    scene.add(pointLight1);
    scene.add(pointLight2);

    return scene;
}