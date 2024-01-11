import * as THREE from 'three';

let lastArrow;

export const drawVector = (scene, position, rotation, rotationOffset, arrowSize=10) => {

    // Ensure rotationOffset is defined, otherwise default to zero
    rotationOffset = rotationOffset || 0;

    // Adjusted rotation with offset
    let adjustedRotation = rotation + rotationOffset;

    // Calculate direction based on rotation around y-axis
    let direction = new THREE.Vector3(-Math.sin(adjustedRotation), 0, -Math.cos(adjustedRotation));

    // Velocity vector
    let velocity = direction.multiplyScalar(arrowSize);

    // Create an arrow helper to visualize the vector
    let arrow = new THREE.ArrowHelper(velocity.clone().normalize(), position, arrowSize, 0xff0000);

    // Remove the last arrow from the scene
    if (lastArrow) {
        scene.remove(lastArrow);
    }

    // Add the new arrow to the scene
    scene.add(arrow);

    // Update the lastArrow reference
    lastArrow = arrow;

    return arrow;
}
