// main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createSimpleCharacter } from './characterObject/makeCharacter.js'
import { helpAxes } from './devTools/helpingAxes.js';
import { initializeMovementController } from './characterObject/characterMovement.js'

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

const cameraOffset = {
    x: 0,
    y: 5,  // Height above the object
    z: 10  // Distance behind the object
};

const speed = 0.1;  // Adjust the character's speed
const followSpeed = 0.05; // Adjust the speed for following the character

// Basic scene setup
let scene, camera, renderer, character, controls;

const init = () => {
    // Creating a scene
    scene = new THREE.Scene();

    // Setting up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Setting up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Orbit control
    // controls = new OrbitControls(camera, renderer.domElement);

    // Make character
    character = createSimpleCharacter();
    scene.add(character);

    // Initialize the character's movement
    initializeMovementController(movement);

    // Lets add the helping axes for development.
    helpAxes(scene);

    // Insert light source
    const pointLight = new THREE.PointLight(0xffffff, 100, 100);
    pointLight.position.set(10, 10, 10); // Position the light
    scene.add(pointLight);
};

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);

    let moveX = 0;
    let moveZ = 0;

    // Determine direction
    if (movement.up) moveZ = -1;
    if (movement.down) moveZ = 1;
    if (movement.left) moveX = -1;
    if (movement.right) moveX = 1;

    // Normalize the movement vector
    // (otherwise it moves to diagonally too fast)
    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
        moveX /= length;
        moveZ /= length;
    }

    // Update character position
    character.position.x += moveX * speed;
    character.position.z += moveZ * speed;

    // Desired camera position
    const desiredPosition = new THREE.Vector3(
        character.position.x + cameraOffset.x,
        character.position.y + cameraOffset.y,
        character.position.z + cameraOffset.z
    );

    // Smoothly interpolate the camera's position towards the desired position
    camera.position.lerp(desiredPosition, followSpeed);

    // Make the camera look at the character
    camera.lookAt(character.position);

    // Render the scene
    renderer.render(scene, camera);

    // DEBUG: Update controls for orbits
    // controls.update();
};

// Handling window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

init();
animate();