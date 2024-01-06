// main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import { createSimpleCharacter } from './characterObject/makeCharacter.js'
import { createRocket } from './characterObject/makeRocket.js'
import { helpAxes } from './devTools/helpingAxes.js';
import { initializeMovementController } from './characterObject/characterMovement.js'

import { createEducationObject } from './sectionObjects/educationObject.js'
import { createPersonalityObject } from './sectionObjects/personalityObject.js'
import { createGithubExperienceObject } from './sectionObjects/githubExperienceObject.js'
import { createWorkExperienceObject } from './sectionObjects/workExperienceObject.js'

const IS_DEBUG_MODE = true;

const beginningRotation = -Math.PI/2;
let currentRotation = beginningRotation; // Current rotation of the rocket in radians
let targetRotation = beginningRotation; // Target rotation based on key presses
let rotationSpeed = 0.05; // How quickly the rocket rotates towards the target angle

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

const speed = 0.4;  // Adjust the character's speed
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

const updateTargetRotation = () => {
    if (movement.left && movement.up) {
        targetRotation = beginningRotation + (Math.PI / 4);  // 45 degrees to the left from the beginning
    } else if (movement.right && movement.up) {
        targetRotation = beginningRotation - (Math.PI / 4);  // 45 degrees to the right from the beginning
    } else if (movement.left && movement.down) {
        targetRotation = beginningRotation + (3 * Math.PI / 4);  // 135 degrees to the left from the beginning
    } else if (movement.right && movement.down) {
        targetRotation = beginningRotation - (3 * Math.PI / 4);  // 135 degrees to the right from the beginning
    } else if (movement.left) {
        targetRotation = beginningRotation + (Math.PI / 2);  // 90 degrees to the left from the beginning
    } else if (movement.right) {
        targetRotation = beginningRotation - (Math.PI / 2);  // 90 degrees to the right from the beginning
    } else if (movement.up) {
        targetRotation = beginningRotation;  // No rotation from the beginning (upwards)
    } else if (movement.down) {
        targetRotation = (beginningRotation + Math.PI) % (2 * Math.PI);  // 180 degrees from the beginning (downwards)
    }

    // Normalize the target rotation to ensure the shortest path
    let rotationDiff = targetRotation - character.rotation.y;
    if (rotationDiff > Math.PI) {
        targetRotation -= 2 * Math.PI;
    } else if (rotationDiff < -Math.PI) {
        targetRotation += 2 * Math.PI;
    }
};


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
    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
        moveX /= length;
        moveZ /= length;
    }

    // Update rocket position
    character.position.x += moveX * speed;
    character.position.z += moveZ * speed;

    // Update target rotation based on current movement
    updateTargetRotation();

    // Check if any movement keys are pressed
    const isMoving = movement.left || movement.right || movement.up || movement.down;

    // Gradually rotate the rocket towards the target rotation only if there's movement
    if (isMoving) {
        if (character.rotation.y < targetRotation) {
            character.rotation.y = Math.min(character.rotation.y + rotationSpeed, targetRotation);
            currentRotation = character.rotation.y;  // Update the currentRotation
        } else if (character.rotation.y > targetRotation) {
            character.rotation.y = Math.max(character.rotation.y - rotationSpeed, targetRotation);
            currentRotation = character.rotation.y;  // Update the currentRotation
        }
    }

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
};

// Handling window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

init();
animate();