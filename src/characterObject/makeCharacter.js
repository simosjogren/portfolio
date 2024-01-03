// Updated import to use CDN for three.js
import * as THREE from 'three';

export function createSimpleCharacter() {
    const characterGroup = new THREE.Group(); // A group to hold all parts of the character

    // Material for the character
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    // Head (a sphere)
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0, 2, 0); // Adjust position as needed
    characterGroup.add(head);

    // Body (a cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 1, 0); // Adjust position as needed
    characterGroup.add(body);

    // Arms (cylinders)
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.8, 1.5, 0); // Adjust position as needed
    characterGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.8, 1.5, 0); // Adjust position as needed
    characterGroup.add(rightArm);

    // Legs (cylinders)
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.3, 0, 0); // Adjust position as needed
    characterGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.3, 0, 0); // Adjust position as needed
    characterGroup.add(rightLeg);

    characterGroup.position.y += 1;  // Lets raise it to the ground level.

    console.log(characterGroup)

    return characterGroup;
};