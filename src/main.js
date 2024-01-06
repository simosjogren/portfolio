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

const beginningRotation = 0;
let currentRotation = beginningRotation; // Current rotation of the rocket in radians
let rotationOffset = -Math.PI / 2; // Offset for the initial rocket orientation
let rotationSpeedFront = 0.05; // How quickly the rocket rotates towards the target angle
let rotationSpeedBack = 0.025;
let forwardSpeed = 0.5; // Speed when moving forward
let backwardSpeed = 0.25; // Speed when moving backward

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

const updateRotation = () => {
    if (movement.up) {
        if (movement.left) {
            currentRotation += rotationSpeedFront; // Rotate to the left when moving forward
        } else if (movement.right) {
            currentRotation -= rotationSpeedFront; // Rotate to the right when moving forward
        }
    }
    if (movement.down) {
        if (movement.left) {
            currentRotation -= rotationSpeedBack; // Rotate to the left when moving forward
        } else if (movement.right) {
            currentRotation += rotationSpeedBack; // Rotate to the right when moving forward
        }
    }
    // Normalize the rotation between 0 and 2*PI
    currentRotation = (currentRotation + 2 * Math.PI) % (2 * Math.PI);
};

const animate = () => {
    requestAnimationFrame(animate);

    let moveX = 0;
    let moveZ = 0;

    // Determine direction and speed based on key presses
    if (movement.up) {
        moveZ = Math.sin(currentRotation + rotationOffset) * forwardSpeed;
        moveX = -Math.cos(currentRotation + rotationOffset) * forwardSpeed;
    } else if (movement.down) {
        moveZ = -Math.sin(currentRotation + rotationOffset) * backwardSpeed;
        moveX = Math.cos(currentRotation + rotationOffset) * backwardSpeed;
    }

    // Update rotation based on current movement
    updateRotation();

    // Update rocket position and rotation
    character.position.x += moveX;
    character.position.z += moveZ;
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