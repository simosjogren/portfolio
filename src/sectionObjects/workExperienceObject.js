import * as THREE from 'three';

import { helpSectionObjectCircle } from "../devTools/helpingAxes.js";
import { addPointLight } from "./tools/sectionObjectPointLight.js"

// Function to create a square with grid-circle
export const createWorkExperienceObject = (scene, position, IS_DEBUG_MODE=false, color=0xffff00) => {
    // Create a square geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2); // Size of the square
    const material = new THREE.MeshStandardMaterial({ color: color });
    const square = new THREE.Mesh(geometry, material);

    // Position the square
    square.position.set(position.x, position.y, position.z);

    // Add the square to the scene
    scene.add(square);

    // We want a circle object to the rectangle to represent the activation radius.
    if (IS_DEBUG_MODE) {
        circle = helpSectionObjectCircle(position, color=color);
        scene.add(circle);
    }

    // Add point light directly above the square
    addPointLight(position, scene);
};