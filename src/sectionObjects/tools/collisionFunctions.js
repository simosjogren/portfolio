// collisionFunctions.js

export function checkForEntry(characterPosition, targetPosition, objectName, radius) {
    // Calculate the distance between the character and the target position
    const distance = Math.sqrt(
        Math.pow(characterPosition.x - targetPosition.x, 2) +
        Math.pow(characterPosition.z - targetPosition.z, 2)
    );
    // Check if the character is within the radius of the target position
    if (distance < radius) {
        return true;
    }
    return false;
}