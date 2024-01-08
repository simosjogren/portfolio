// collisionFunctions.js

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

// Call the function with index 1 to activate the second iframe
showIframe(1);

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