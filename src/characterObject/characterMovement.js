// characterMovement.js

import * as THREE from 'three';

export function initializeMovementController(movement) {
    
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'w':
                movement.up = true;
                break;
            case 's':
                movement.down = true;
                break;
            case 'a':
                movement.left = true;
                break;
            case 'd':
                movement.right = true;
                break;
        }
    });
    
    document.addEventListener('keyup', function(event) {
        switch (event.key) {
            case 'w':
                movement.up = false;
                break;
            case 's':
                movement.down = false;
                break;
            case 'a':
                movement.left = false;
                break;
            case 'd':
                movement.right = false;
                break;
        }
    });
}
