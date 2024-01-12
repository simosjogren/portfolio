// textureLoaders.js

import * as THREE from 'three';

export const loadSkyboxTexture = () => {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('./textures/'); // Set this to the path of your downloaded skybox texture
    // Load the skybox textures
    const textureCube = loader.load([
        'bkg1_right.png', // Right side
        'bkg1_left.png',  // Left side
        'bkg1_top.png',   // Top side
        'bkg1_bot.png',// Bottom side
        'bkg1_front.png', // Front side
        'bkg1_back.png'   // Back side
    ]);
    return textureCube;
}