// characterMovement.js

import * as THREE from 'three';

export function initializeMovementController(movement) {
    
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                movement.up = true;
                break;
            case 's':
            case 'ArrowDown':
                movement.down = true;
                break;
            case 'a':
            case 'ArrowLeft':
                movement.left = true;
                break;
            case 'd':
            case 'ArrowRight':
                movement.right = true;
                break;
        }
    });
    
    document.addEventListener('keyup', function(event) {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                movement.up = false;
                break;
            case 's':
            case 'ArrowDown':
                movement.down = false;
                break;
            case 'a':
            case 'ArrowLeft':
                movement.left = false;
                break;
            case 'd':
            case 'ArrowRight':
                movement.right = false;
                break;
        }
    });
}


export const updateRotation = (movement, currentRotation, rotationSpeedFront = 0.05, rotationSpeedBack = 0.025) => {
    if (movement.left) {
        currentRotation += (movement.up ? rotationSpeedFront : rotationSpeedBack);
    } else if (movement.right) {
        currentRotation -= (movement.up ? rotationSpeedFront : rotationSpeedBack);
    }
    currentRotation = (currentRotation + 2 * Math.PI) % (2 * Math.PI);
    return currentRotation;
};


export const updateMomentum = (isMoving, momentum, moveX, moveZ, decelerationRate) => {
    if (isMoving) {
        // Update momentum while moving
        momentum.x = moveX;
        momentum.z = moveZ;
    } else {
        // Apply deceleration when no movement keys are pressed
        momentum.x *= decelerationRate;
        momentum.z *= decelerationRate;
        // Threshold to stop completely, to avoid endless tiny movements
        if (Math.abs(momentum.x) < 0.01 && Math.abs(momentum.z) < 0.01) {
            momentum.x = 0;
            momentum.z = 0;
        }
    }
    return momentum;
}