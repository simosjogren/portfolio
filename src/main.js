// main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import { createSimpleCharacter } from './characterObject/makeCharacter.js'
import { createRocket } from './characterObject/makeRocket.js'
import { helpAxes } from './devTools/helpingAxes.js';
import { initializeMovementController, updateMomentum, updateRotation } from './characterObject/characterMovement.js'

import { createEducationObject } from './sectionObjects/educationObject.js'
import { createPersonalityObject } from './sectionObjects/personalityObject.js'
import { createGithubExperienceObject } from './sectionObjects/githubExperienceObject.js'
import { createWorkExperienceObject } from './sectionObjects/workExperienceObject.js'
import { initControlPanel, toggleControlPanel } from './platformSettings/mobileSettings.js';

// Event listener for the toggle button
document.getElementById('toggleControls').addEventListener('click', toggleControlPanel);
document.getElementById('ctrlBtnArea').style.display = 'none';  // Lets hide it by default.

const IS_DEBUG_MODE = true;

const cameraOffset = {
    x: 0,
    y: 5,  // Height above the object
    z: 10  // Distance behind the object
};

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
    character = createRocket();
    scene.add(character);

    // Initialize the character's movement
    initializeMovementController(movement);

    const positions = {
        "education": { x: 40, y: 0, z: 0 },  // East
        "githubExperience": { x: 0, y: 0, z: 40 },  // North
        "workExperience": { x: -40, y: 0, z: 0 }, // West
        "personality": { x: 0, y: 0, z: -40 }  // South
    };

    // Create portfolio elements.
    createEducationObject(scene, positions["education"], IS_DEBUG_MODE);
    createGithubExperienceObject(scene, positions["githubExperience"], IS_DEBUG_MODE);
    createWorkExperienceObject(scene, positions["workExperience"], IS_DEBUG_MODE);
    createPersonalityObject(scene, positions["personality"], IS_DEBUG_MODE);

    // Insert light source
    const pointLight = new THREE.PointLight(0xffffff, 100, 100);
    pointLight.position.set(10, 10, 10); // Position the light
    scene.add(pointLight);

    // If its debug mode, lets draw the help axises
    if (IS_DEBUG_MODE) helpAxes(scene);
};

const movement = {
    up: false,
    left: false,
    right: false
};

// Initialize the control panel when the page loads
window.onload = initControlPanel(movement);

const beginningRotation = 0;
let currentRotation = beginningRotation; // Current rotation of the rocket in radians
let rotationSpeedFront = 0.05;
let rotationSpeedBack = 0.025;
let rotationOffset = -Math.PI / 2; // Offset for the initial rocket orientation
let forwardSpeed = 0.5; // Speed when moving forward
let backwardSpeed = 0.25; // Speed when moving backward
const followSpeed = 0.05; // Adjust the speed for following the character
let isMoving = false;
let decelerationRate = 0.99; // Adjust this value to control how quickly the object slows down
let momentum = {x: 0, z: 0}; // For deaccelerating etc
let normFactor = 1; // Default


const animate = () => {
    requestAnimationFrame(animate);

    let moveX = 0;
    let moveZ = 0;

    // Determine direction and speed based on key presses
    if (movement.up) {
        isMoving = true;
        moveZ = Math.sin(currentRotation + rotationOffset) * forwardSpeed;
        moveX = -Math.cos(currentRotation + rotationOffset) * forwardSpeed;
    } else {
        isMoving = false;
    }

    // Count the momentum for decelration.
    momentum = updateMomentum(isMoving, momentum, moveX, moveZ, decelerationRate);

    // Update character position using momentum
    character.position.x += momentum.x;
    character.position.z += momentum.z;

    // Update rotation based on current movement
    normFactor = Math.sqrt(momentum.x * momentum.x + momentum.z * momentum.z) * 2;  // Max norm is 0.5 logically, so multiply by two.
    currentRotation = updateRotation(movement, currentRotation, rotationSpeedFront*normFactor, rotationSpeedBack*normFactor);
    
    // Apply the updated rotation to the rocket including the offset
    character.rotation.y = currentRotation + rotationOffset;

    // Calculate the desired position of the camera
    const relativeCameraOffset = new THREE.Vector3(cameraOffset.x, cameraOffset.y, cameraOffset.z);
    const cameraOffsetRotated = relativeCameraOffset.applyAxisAngle(new THREE.Vector3(0,1,0), currentRotation);
    const desiredPosition = new THREE.Vector3(
        character.position.x + cameraOffsetRotated.x,
        character.position.y + cameraOffsetRotated.y,
        character.position.z + cameraOffsetRotated.z
    );

    // Smoothly interpolate the camera's position towards the desired position
    camera.position.lerp(desiredPosition, followSpeed);

    // Make the camera look at the rocket
    camera.lookAt(character.position);

    // Render the scene
    renderer.render(scene, camera);
};

// Handling window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

init();
animate();