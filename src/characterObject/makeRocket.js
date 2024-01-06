import * as THREE from 'three';

// Define the colors object
let Colors = {
  white: 0xffffff,
  black: 0x000000,
  red1: 0xd25138,
  red2: 0xc2533b,
  red3: 0xbf5139,
  grey: 0xd9d1b9,
  darkGrey: 0x4d4b54,
  windowBlue: 0xaabbe3,
  windowDarkBlue: 0x4a6e8a,
  thrusterOrange: 0xfea036
};

class Rocket {
  constructor() {
    this.mesh = new THREE.Object3D();

    // custom shapes
    let geoFinShape = new THREE.Shape();
    let x = 0,
      y = 0;

    geoFinShape.moveTo(x, y);
    geoFinShape.lineTo(x, y + 50);
    geoFinShape.lineTo(x + 35, y + 10);
    geoFinShape.lineTo(x + 35, y - 10);
    geoFinShape.lineTo(x, y);

    let finExtrudeSettings = {
      amount: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    };

    // geometry
    let geoCone = new THREE.ConeGeometry(50, 70, 8);
    let geoUpper = new THREE.CylinderGeometry(50, 75, 80, 8);
    let geoMiddle = new THREE.CylinderGeometry(75, 85, 80, 8);
    let geoColumn = new THREE.CylinderGeometry(85, 85, 200, 8);
    let geoFin = new THREE.ExtrudeGeometry(geoFinShape, finExtrudeSettings);
    let geoThruster = new THREE.CylinderGeometry(55, 55, 40, 8);
    let geoConnector = new THREE.CylinderGeometry(55, 35, 10, 8);

    // Window geometry and material
    let geoWindowFrameOuter = new THREE.CylinderGeometry(55, 55, 40, 8);
    let geoWindowFrameInner = new THREE.CylinderGeometry(50, 50, 40, 8); // slightly smaller for the illusion of thickness

    // materials
    let matRoof1 = new THREE.MeshPhongMaterial({ color: Colors.red1, flatShading: true });
    let matRoof2 = new THREE.MeshPhongMaterial({ color: Colors.red2, flatShading: true });
    let matRoof3 = new THREE.MeshPhongMaterial({ color: Colors.red3, flatShading: true });
    let matBody = new THREE.MeshPhongMaterial({ color: Colors.grey, flatShading: true });
    let matWindowFrame = new THREE.MeshPhongMaterial({ color: Colors.darkGrey, side: THREE.DoubleSide, flatShading: true });
    let matWindow = new THREE.MeshPhongMaterial({ color: Colors.windowDarkBlue, transparent: true, opacity: 0.5 });

    // Rocket parts
    let m = new THREE.Mesh(geoCone, matRoof1);
    m.position.y = 70;
    m.castShadow = true;
    m.receiveShadow = true;

    let m2 = new THREE.Mesh(geoUpper, matRoof2);
    m2.castShadow = true;
    m2.receiveShadow = true;

    let m3 = new THREE.Mesh(geoMiddle, matRoof3);
    m3.position.y = -70;
    m3.castShadow = true;
    m3.receiveShadow = true;

    this.roof = new THREE.Object3D();
    this.roof.add(m, m2, m3);

    let mColumn = new THREE.Mesh(geoColumn, matBody);
    mColumn.position.y = -210;
    mColumn.castShadow = true;
    mColumn.receiveShadow = true;

    let mFinLeft = new THREE.Mesh(geoFin, matRoof3);
    mFinLeft.position.y = -310;
    mFinLeft.position.z = -85;
    mFinLeft.rotation.y = 1.58;
    mFinLeft.castShadow = true;
    mFinLeft.receiveShadow = true;

    let mFinRight = new THREE.Mesh(geoFin, matRoof3);
    mFinRight.position.y = -310;
    mFinRight.position.z = 85;
    mFinRight.rotation.y = -1.58;
    mFinRight.castShadow = true;
    mFinRight.receiveShadow = true;

    this.body = new THREE.Object3D();
    this.body.add(mColumn, mFinLeft, mFinRight);

    // Window
    let mWindowFrameOuter = new THREE.Mesh(geoWindowFrameOuter, matWindowFrame);
    let mWindowFrameInner = new THREE.Mesh(geoWindowFrameInner, matWindow);
    mWindowFrameInner.position.y = -200;
    mWindowFrameOuter.position.y = -200;
    this.window = new THREE.Object3D();
    this.window.add(mWindowFrameOuter, mWindowFrameInner);

    let mThruster = new THREE.Mesh(geoThruster, matWindowFrame);
    mThruster.position.y = -305;
    mThruster.castShadow = true;
    mThruster.receiveShadow = true;

    let mConnector = new THREE.Mesh(geoConnector, matRoof1);
    mConnector.position.y = -330;
    mConnector.castShadow = true;
    mConnector.receiveShadow = true;

    let mBurner = new THREE.Mesh(geoThruster, matWindowFrame);
    mBurner.position.y = -340;
    mBurner.scale.set(0.7, 0.55, 0.7);
    mBurner.castShadow = true;
    mBurner.receiveShadow = true;

    this.base = new THREE.Object3D();
    this.base.add(mThruster, mConnector, mBurner);

    this.mesh.add(this.roof);
    this.mesh.add(this.body);
    this.mesh.add(this.window);
    this.mesh.add(this.base);
  }
}

export const createRocket = () => {
    let rocket = new Rocket();
    // Adjust following values to scale the rocket
    rocket.mesh.scale.set(0.01, 0.01, 0.01);
    rocket.mesh.position.y = 2.5;
    rocket.mesh.rotation.z = 90 * Math.PI / 180;  // Rotate 90 degrees in z-direction
    rocket.mesh.rotation.y = -90 * Math.PI / 180;
    return rocket.mesh;
};
