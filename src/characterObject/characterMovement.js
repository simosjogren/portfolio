// characterMovement.js

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


export const updateMomentum = (isMoving, momentum, moveX, moveZ, decelerationRate, accelerationRate, maxForwardSpeed) => {
    if (isMoving) {
        // Calculate the current speed
        let currentSpeed = Math.sqrt(momentum.x * momentum.x + momentum.z * momentum.z);

        // Calculate the desired change in speed using logarithmic acceleration
        let deltaSpeedX = moveX * accelerationRate;
        let deltaSpeedZ = moveZ * accelerationRate;

        // Update the momentum
        momentum.x += deltaSpeedX;
        momentum.z += deltaSpeedZ;

        // Recalculate the current speed after applying acceleration
        currentSpeed = Math.sqrt(momentum.x * momentum.x + momentum.z * momentum.z);

        // If the current speed exceeds the max speed, clamp it
        if (currentSpeed > maxForwardSpeed) {
            momentum.x = (momentum.x / currentSpeed) * maxForwardSpeed;
            momentum.z = (momentum.z / currentSpeed) * maxForwardSpeed;
        }
    } else {
        // Apply deceleration when no movement keys are pressed
        momentum.x *= decelerationRate;
        momentum.z *= decelerationRate;

        // Threshold to stop completely
        if (Math.abs(momentum.x) < 0.01 && Math.abs(momentum.z) < 0.01) {
            momentum.x = 0;
            momentum.z = 0;
        }
    }
    return momentum;
}



export const applyOrbitMomentum = (coordinates, char_position, initialCenterMomentum) => {
    // Starting the momentum from zero.
    let momentum = {x:0, z:0};
    
    // Calculate direction towards circle center
    const toCenterX = coordinates.x - char_position.x;
    const toCenterZ = coordinates.z - char_position.z;

    // Normalize this direction
    const toCenterLength = Math.sqrt(toCenterX * toCenterX + toCenterZ * toCenterZ);
    const normalizedToCenterX = toCenterX / toCenterLength;
    const normalizedToCenterZ = toCenterZ / toCenterLength;

    // Apply a small initial momentum towards the circle center
    momentum.x += normalizedToCenterX * initialCenterMomentum;
    momentum.z += normalizedToCenterZ * initialCenterMomentum;

    return momentum;
}


export const countSpeed = (momentum, maxSpeed, maxFantasySpeed) => {
    // Counting the euclidean dist
    let norm = Math.sqrt(momentum.x ** 2 + momentum.z ** 2);
    norm = norm / maxSpeed;  // Normalizing
    let currentSpeed = norm * maxFantasySpeed
    return Math.round(currentSpeed);
}