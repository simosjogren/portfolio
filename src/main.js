// main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import { createSimpleCharacter } from './characterObject/makeCharacter.js'
import { createRocket, createSmoke } from './characterObject/makeRocket.js'
import { helpAxes } from './devTools/helpingAxes.js';
import { drawVector } from './devTools/vectorHelper.js';
import { initializeMovementController, updateMomentum, updateRotation, countSpeed, applyOrbitMomentum } from './characterObject/characterMovement.js'

import { createEducationObject } from './sectionObjects/educationObject.js'
import { createPersonalityObject } from './sectionObjects/personalityObject.js'
import { createGithubExperienceObject } from './sectionObjects/githubExperienceObject.js'
import { createWorkExperienceObject } from './sectionObjects/workExperienceObject.js'
import { initControlPanel, toggleControlPanel } from './platformSettings/mobileSettings.js';
import { checkForEntry, getCharacterEnteringDirection, getCircleTangent } from './sectionObjects/tools/collisionFunctions.js'
import { loadSkyboxTexture } from './platformSettings/textureLoaders.js';
import { addPointLights } from './platformSettings/lightningSettings.js';

// Event listener for the toggle button
document.getElementById('toggleControls').addEventListener('click', toggleControlPanel);
document.getElementById('ctrlBtnArea').style.display = 'none';  // Lets hide it by default.

const IS_DEBUG_MODE = true; // When true, we animate certain helping grids and axes.
const beginningRotation = 0;
let currentRotation = beginningRotation; // Current rotation of the rocket in radians
let rotationOffset = -Math.PI / 2; // Offset for the initial rocket orientation
let rotationSpeedFront = 0.035;  // TODO: make the major speed.
let rotationSpeedBack = 0.0125; // TODO: check if needed anymore
let forwardSpeed = 0.45; // Maximum speed when moving forward
const followSpeed = 0.075; // Speed for following the character with camera
const tangentMovementSpeed = 0.05; // Character movement speed along the tangent
let isMoving = false;   // Practically tells if the up-key is pressed and rocket is speeding.
let defaultDecelerationRate = 0.99; // How quickly the object slows down naturally
let slowerDecelerationRate = 0.96;  // How quickly the object slows down forcedly.
const accelerationRate = 0.025; // Acceleration speed.
let momentum = {x: 0, z: 0}; // Physical momentum
const initialCenterMomentum = 0.03; // Momentum used when character enters to the circle area of sectionObject.
let normFactor = 1; // Default value. Normalized scalar between 0 and 1 which adjusts the speed of character rotation.
const maxFantasySpeed = 10; // For showing purposes, scales the "speed" of the rocket according to this.
let currentSpeed = 0;   // Default value.
const maxBoundary = 150;    // Tells how long you can go before respawning to the center.

let isCircleRotating = false; // State to track if character is rotating around the circle
let insideObject = '';  // Tells that what is the circle that we are currently in.

// Initialization and constants
let targetRotation = 0;
const rotationInterpolationFactor = 0.04; // Adjust for smoother or faster rotation


const cameraOffset = {
    x: 0,
    y: 5,  // Height above the object
    z: 10  // Distance behind the object
};

// This offset is used when we are rotating the circle.
const circleRotationOffset = {
    x: 0,
    y: 10,
    z: 25
}

// Basic scene setup
let scene, camera, renderer, character, controls;

const positions = {
    "education": { x: 40, y: 5, z: 0 },  // East
    "githubExperience": { x: 0, y: 5, z: 40 },  // North
    "workExperience": { x: -40, y: 5, z: 0 }, // West
    "personality": { x: 0, y: 5, z: -40 }  // South
};

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

    // Create portfolio elements.
    createEducationObject(scene, positions["education"], IS_DEBUG_MODE);
    createGithubExperienceObject(scene, positions["githubExperience"], IS_DEBUG_MODE);
    createWorkExperienceObject(scene, positions["workExperience"], IS_DEBUG_MODE);
    createPersonalityObject(scene, positions["personality"], IS_DEBUG_MODE);

    // Add realistic-looking lightning
    scene = addPointLights(scene);

    // Set the scene background to the loaded texture
    scene.background = loadSkyboxTexture();

    // If its debug mode, lets draw the help axises
    if (IS_DEBUG_MODE) helpAxes(scene, maxBoundary*2);
};

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Initialize the control panel when the page loads
window.onload = initControlPanel(movement);

// Update the speedmeter in the window.
setInterval(() => {
    document.getElementById('currentSpeed').textContent = currentSpeed;
}, 10);


let circleRotationDirection = 'clockwise';

const animate = () => {
    requestAnimationFrame(animate);

    // console.log(character.position);

    // Investigation if the character is inside the borders.
    if (Math.abs(character.position.x) > maxBoundary || 
        Math.abs(character.position.z) > maxBoundary) {
        character.position.x = 0;
        character.position.z = 0;
        momentum = {x:0, z:0}
        currentRotation = 0;
        movement.up = false;
        isMoving = false;
    }

    let moveX = 0;
    let moveZ = 0;
    let decelerationRate = defaultDecelerationRate; // 'Automatic' stopping speed

    // Determine direction and speed based on key presses
    if (movement.up) {
        isMoving = true;
        moveZ = Math.sin(currentRotation + rotationOffset) * forwardSpeed;
        moveX = -Math.cos(currentRotation + rotationOffset) * forwardSpeed;
    } else if (movement.down) {
        decelerationRate = slowerDecelerationRate; // Faster deceleration if S-key is pressed.
    } else {
        isMoving = false;
    }

    // Count the current momentum for acceleration and deceleration.
    momentum = updateMomentum(isMoving, momentum, moveX, moveZ, decelerationRate, accelerationRate, forwardSpeed);

    // Perform the orbit motion if character is inside any circle
    for (let key in positions) {
        if (positions.hasOwnProperty(key)) {
            let coordinates = positions[key];   // Center of a circle
            let isInsideAnyCircle = checkForEntry(character.position, coordinates, key, 10);
            if (isInsideAnyCircle) {
                currentCircleCenter = { x: coordinates.x, y: coordinates.y, z: coordinates.z };
                // Beginning settings before the character is rotating along the circle
                if (!isCircleRotating) {
                    insideObject = key;
                    isCircleRotating = true;

                    // Disable all current moving.
                    movement.up = false;
                    isMoving = false;

                    // Gets the angle that the character enters the orbit and turns the character to that direction.
                    circleRotationDirection = getCharacterEnteringDirection(character, coordinates);

                    // Applying the initial momentum to move the character clearly inside the orbit.
                    momentum = applyOrbitMomentum(coordinates, character.position, initialCenterMomentum);
                }

                // Calculate and normalize the tangent vector only when at the border
                let circleTangent = getCircleTangent(coordinates, character.position, circleRotationDirection);
                circleTangent.normalize();

                // Settings when character is already rotating.
                if (isCircleRotating) {
                    targetRotation = Math.atan2(circleTangent.x, circleTangent.z) + Math.PI;
                    let rotationDelta = targetRotation - currentRotation;
                    
                    // Ensure shortest rotation direction
                    if (rotationDelta > Math.PI) rotationDelta -= 2 * Math.PI;
                    if (rotationDelta < -Math.PI) rotationDelta += 2 * Math.PI;
    
                    // Rotate character by a fraction of the remaining angle to target
                    currentRotation += rotationDelta * rotationInterpolationFactor;
                }

                // Move the character along the tangent direction
                character.position.x += circleTangent.x * tangentMovementSpeed;
                character.position.z += circleTangent.z * tangentMovementSpeed;

                // Lets bring the current iframe element to the screen
                document.getElementById(key).classList.add('active');
            } else {
                // Not collision, lets keep the iframe still hided.
                document.getElementById(key).classList.remove('active');
                if (insideObject === key) {
                    isCircleRotating = false;
                }
            }
        }
    }
    
    currentSpeed = countSpeed(momentum, forwardSpeed, maxFantasySpeed);

    // Update character position using momentum
    character.position.x += momentum.x;
    character.position.z += momentum.z;

    // Update rotation based on current movement
    normFactor = Math.sqrt(momentum.x * momentum.x + momentum.z * momentum.z) * 2; // Max norm is 0.5 logically, so multiply by two.
    currentRotation = updateRotation(movement, currentRotation, rotationSpeedFront * normFactor, rotationSpeedBack * normFactor);

    // Apply the updated rotation to the rocket including the offset
    character.rotation.y = currentRotation + rotationOffset;

    let relativeCameraOffset;

    // Calculate the desired position of the camera
    if (isCircleRotating) {
        relativeCameraOffset = new THREE.Vector3(circleRotationOffset.x, circleRotationOffset.y, circleRotationOffset.z);
    } else {
        relativeCameraOffset = new THREE.Vector3(cameraOffset.x, cameraOffset.y, cameraOffset.z);
    }
    const cameraOffsetRotated = relativeCameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), currentRotation);
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

init();
animate();