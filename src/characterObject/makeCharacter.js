import * as THREE from 'three';

export function createSimpleCharacter() {
    const spaceshipGroup = new THREE.Group(); // A group to hold all parts of the spaceship

    // Materials for the spaceship
    const shipMaterial = new THREE.MeshPhongMaterial({ color: 0x5555ff, shininess: 150 });
    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xff3300 });

    // Main Body (a cylinder for a more elongated fuselage)
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32); // Making it longer
    const body = new THREE.Mesh(bodyGeometry, shipMaterial);
    body.rotation.x = Math.PI / 2; // Rotate the cylinder to face forward
    spaceshipGroup.add(body);

    // Cockpit (a semi-transparent sphere at the front)
    const cockpitGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const cockpitMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 0, -1.5); // Move it to the front of the body
    spaceshipGroup.add(cockpit);

    // Wings (more detailed wing design, positioned to the sides)
    const wingGeometry = new THREE.BoxGeometry(0.1, 0.5, 2); // Make wings longer and thinner
    const leftWing = new THREE.Mesh(wingGeometry, shipMaterial);
    leftWing.position.set(-1, 0, 0); // Adjust position to the side
    leftWing.rotation.y = Math.PI / 2; // Rotate to extend sideways
    spaceshipGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, shipMaterial);
    rightWing.position.set(1, 0, 0); // Adjust position to the side
    rightWing.rotation.y = Math.PI / 2; // Rotate to extend sideways
    spaceshipGroup.add(rightWing);

    // Thruster Flames (animated particles, positioned at the back)
    const flameGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Smaller spheres for a particle effect
    const flames = new THREE.Group();
    for (let i = 0; i < 10; i++) { // Multiple particles for a richer effect
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set((Math.random() - 0.5) * 0.5, 0, 1.5 + Math.random() * 0.5); // Position flames at the back
        flames.add(flame);
    }
    spaceshipGroup.add(flames);

    spaceshipGroup.userData = { flames }; // Store flames for animation access

    spaceshipGroup.position.y = 5; // Adjust as needed to raise above ground

    return spaceshipGroup;
};
