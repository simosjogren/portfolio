// collisionFunctions.js

import * as THREE from 'three';

// Function to show an iframe by index
function showIframe(index) {
    // Get all iframes with the class 'modelIframe'
    var iframes = document.querySelectorAll('.modelIframe');

    // Check if the index is within the range of the iframes length
    if(index >= 0 && index < iframes.length) {
        // Add 'active' class to the specified iframe
        iframes[index].classList.add('active');
    }
}

export function checkForEntry(characterPosition, targetPosition, objectName, radius) {
    // Calculate the distance between the character and the target position
    const distance = Math.sqrt(
        Math.pow(characterPosition.x - targetPosition.x, 2) +
        Math.pow(characterPosition.z - targetPosition.z, 2)
    );

    // Check if the character is within the radius of the target position
    if (distance < radius) {
        return [true, 0];  // Within radius, no adjustment needed
    } else {
        // Calculate the adjustment factor if outside the radius
        const adjustmentFactor = distance - radius;
        return [false, adjustmentFactor];
    }
}

export function getCircleTangent(circleCenter, edgePoint, rotationDirection='clockwise') {
    // Calculate the radius vector components
    let radiusVectorX = edgePoint.x - circleCenter.x;
    let radiusVectorZ = edgePoint.z - circleCenter.z;

    let tangentVectorX;
    let tangentVectorZ;

    if (rotationDirection === 'clockwise') {
        // Calculate the tangent vector components by rotating the radius vector 90 degrees counter-clockwise
        tangentVectorX = radiusVectorZ; // -z becomes x
        tangentVectorZ = -radiusVectorX;  // x becomes z
    } else if (rotationDirection === 'counter-clockwise') {
        tangentVectorX = -radiusVectorZ;
        tangentVectorZ = radiusVectorX;
    }

    // Create a new Three.js Vector3 object for the tangent vector
    return new THREE.Vector3(tangentVectorX, 0, tangentVectorZ);
}