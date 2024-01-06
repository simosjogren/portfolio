import * as THREE from 'three';
import { TextureLoader } from 'three';

import { helpSectionObjectCircle } from "../devTools/helpingAxes.js";
import { addPointLight } from "./tools/lightningSettings.js"

export const createEducationObject = (scene, position, IS_DEBUG_MODE=false, color=0xff0000) => {
    // Create a square geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2); // Size of the square

    // Load a duck image as texture
    const loader = new TextureLoader();
    loader.load('https://cdn.pixabay.com/photo/2012/02/19/17/35/duck-15025_1280.jpg', function(texture) {
        // Create an array of materials for all faces of the square
        const materials = [
            new THREE.MeshStandardMaterial({color: color}), // right face
            new THREE.MeshStandardMaterial({color: color}), // left face
            new THREE.MeshStandardMaterial({color: color}), // top face - will be replaced with duck image
            new THREE.MeshStandardMaterial({color: color}), // bottom face
            new THREE.MeshStandardMaterial({color: color}), // front face
            new THREE.MeshStandardMaterial({color: color})  // back face
        ];

        // Set the texture for the top face (index 2)
        materials[2].map = texture;

        // Create a square with the materials
        const square = new THREE.Mesh(geometry, materials);
        square.position.set(position.x, position.y, position.z);
        scene.add(square);

        // Other elements like the circle and light, as in your original function
        if (IS_DEBUG_MODE) {
            const circle = helpSectionObjectCircle(position, color=color);
            scene.add(circle);
        }
        addPointLight(position, scene);
    });
};