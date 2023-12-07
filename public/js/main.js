// GLTF TESTER!
// https://gltf-viewer.donmccurdy.com/

const BODYPART_SCALE = 3.0;
const WORLD_HALF = 200;
const VIDEO_WIDTH = 640;
const SeaLevel = 6;
let joints = [];

let params = {
  // (add)
};

let model01, model04, model07;
let model02, model05;
let model03, model06;

let model1;

let mirrorM;
let fishM;
let fSkeleton;

let light;

let seaTexture;
let seaPlane;

let moonSprite;
const moonTexture = new THREE.TextureLoader().load('assets/moon.jpg');
moonTexture.colorSpace = THREE.SRGBColorSpace;

let creature = new THREE.Group();
let t = 0;

let bodyParts = [];
// let bodyPartGLTFpaths = [
//   'assets/bodyPart01-head.gltf',
//   'assets/bodyPart01-5.gltf',
//   'assets/bodyPart02.gltf',
//   'assets/bodyPart03.gltf',
//   'assets/bodyPart04_Tail.gltf'
// ];
let bodyPartGLTFpaths = [
  'assets/bodyPart01-head.gltf',
  'assets/bodyPart01-5.gltf',
  'assets/bodyPart02.gltf',
  'assets/bodyPart03V2.gltf',
  'assets/bodyPart03-5.gltf',
  'assets/bodyPart04_Tail.gltf'
];

let target;

//let bodyPart01;
//let bodyPart02;

function setupThree() {

  // WebXR
  setupWebXR();

  loadCreatureBodyParts();
  //loadAndSetupCreature();

  camera.position.z = 300;
  camera.position.y = 50;
  camera.lookAt(0, 0, 0);

  // Add the group to the scene
  let box = getBox();
  box.scale.set(100, 100, 100);
  box.material.wireframe = true;
  //creature.add(box);

  scene.add(creature);

  // add plane
  const Groundgeometry = new THREE.PlaneGeometry(50, 50, 42, 42);
  Groundgeometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(Groundgeometry, material);
  //scene.add(plane);

  //for the seaplane
  seaTexture = new THREE.TextureLoader().load('assets/sea01.jpg');
  seaTexture.colorSpace = THREE.SRGBColorSpace;
  seaTexture.offset.set(0, 0);
  seaTexture.repeat.set(1, 1);
  seaTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  seaPlane = getPlane();
  scene.add(seaPlane);
  seaPlane.position.set(0, -SeaLevel, 0);//set the position for the sea plane

  // add the mirror
  // let mirrorMaterial = getPlaneMirror().material;
  let reflectorPlane1 = getPlaneMirror();
  //scene.add(reflectorPlane1);
  reflectorPlane1.position.set(0, 0 - SeaLevel, 10);

  //the mirror far away
  let reflectorPlane2 = getPlaneMirror();
  scene.add(reflectorPlane2);
  reflectorPlane2.rotation.set(0, 6.3, 0);//the 6.3 is the PI*2 
  reflectorPlane2.scale.set(1.5, 1.5, 1.5);
  reflectorPlane2.position.set(-3, 10 - SeaLevel, -222);

  let reflectorPlane3 = getPlaneMirror();
  scene.add(reflectorPlane3);
  reflectorPlane3.rotation.set(0, 9.5, 0);
  reflectorPlane3.scale.set(0.2, 0.2, 0.2);
  reflectorPlane3.position.set(0, 0, 9);

  let skyScale = 70;
  let reflectorPlane4 = getPlaneMirror();
  scene.add(reflectorPlane4);
  reflectorPlane4.rotation.set(1.6, 0, 0);
  reflectorPlane4.scale.set(skyScale, skyScale, skyScale);
  reflectorPlane4.position.set(0, 200, 9);

  let reflectorPlane5 = getPlaneMirror();
  //scene.add(reflectorPlane5);
  reflectorPlane5.rotation.set(-1.6, 0, 0);
  reflectorPlane5.scale.set(skyScale, skyScale, skyScale);
  reflectorPlane5.position.set(0, -100, 0);


  loadGLTF("assets/SHJ-mountain1.glb", function (model1) {
    model1.position.set(-10, 1 - SeaLevel, 0); // Set position for the first model.
    // Store the model reference for future use if needed
    model01 = model1;
    model01.scale.x = 2.5;
    model01.scale.y = 3.3;
    model01.scale.z = 2.0;
  });

  loadGLTF("assets/SHJ-mountain1.glb", function (model4) {
    model4.position.set(20, 2 - SeaLevel, -20); // Set position for the first model.
    // Store the model reference for future use if needed
    model04 = model4;
    model04.scale.x = 4;
    model04.scale.y = 5;
    model04.scale.z = 5;
    model04.rotation.y = Math.PI * 1.3;
  });

  loadGLTF("assets/SHJ-mountain1.glb", function (model7) {
    model7.position.set(-12, -2 - SeaLevel, -20); // Set position for the first model.
    // Store the model reference for future use if needed
    model07 = model7;
    model07.scale.x = 6;
    model07.scale.y = 5 * 1.4;
    model07.scale.z = 5 * 1.2;
    model07.rotation.y = Math.PI * 2.;
  });
  //
  loadGLTF("assets/SHJ-mountain2.glb", function (model2) {
    model2.position.set(6, 0 - SeaLevel, -6); // Set position for the second model
    model02 = model2;
    model02.scale.x = 2.5 * 0.6;
    model02.scale.y = 3.3 * 0.8;
    model02.scale.z = 2.0 * 0.6;
    model02.rotation.y = - Math.PI / 6;
  });
  loadGLTF("assets/SHJ-mountain2.glb", function (model5) {
    model5.position.set(38, -1 - SeaLevel, 10); // Set position for the second model
    model05 = model5;
    model05.scale.x = 2.5;
    model05.scale.y = 3.3;
    model05.scale.z = 2.0;
    model05.rotation.y = - Math.PI / 2.5;
  });

  loadGLTF("assets/SHJ-mountain3.glb", function (model3) {
    model3.position.set(0, -1 - SeaLevel, 25); // Set position for the second model
    model03 = model3;
    model03.scale.x = 2.5 * 1.2;
    model03.scale.y = 3.3 * 1.4;
    model03.scale.z = 2.0 * 1.2;
    model03.rotation.y = -Math.PI / 3;
  });



  // load the avatar
  const fishLoader = new GLTFLoader();
  fishLoader.load('assets/YYFish3.gltf', (gltf) => {
    fishM = gltf.scene;
    let fishS = gltf.nodes;

    fSkeleton = new THREE.SkeletonHelper(fishM);
    //scene.add(fishM);
    //scene.add(fSkeleton);

    // console.log("fish", fishS);

    fishM.traverse(child => {
      // if ((child as Mesh).isMesh) {
      //   child.castShadow = true;
      //   child.receiveShadow = true;
      // }
      // console.log(child);
      if (child.name === 'Bone006') {
        joints.push(new Joint(child, pose.left_elbow));
        // console.log("Bone006_is_found");
      }
      // if ((child as Bone).isBone && child.name === 'Bone001') { 
      //   this.wrist = child;
      // }

      // joints.push(new Joint(child));
    });

    fishM.scale.set(3, 3, 3); // Example scale
    // fishM.position.set(0, 10, 0); // Example position
    // for (let i = 0; i < joints.length; i++) {

    // joints.push(new Joint(chd, pose.left_elbow));
    // joints.push(new Joint(chd, pose.right_elbow));

    // }
  });
  let BlockSphere = getBigSphere();
  BlockSphere.position.set(0, -10, 0);
  BlockSphere.scale.set(600, 600, 600);
  scene.add(BlockSphere);


  light = getLightGroup();
  light.position.set(0, 50, 0);
  scene.add(light);

  //this cube check the light 
  const geo = new THREE.BoxGeometry(30, 30, 30);
  const mat = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(100, 20, 0);
  //scene.add(cube);

  //add the moon
  const moon = getMoon();
  moon.position.set(0, 0, 0); // Same position as light1
  //light1.add(moon);

  target = getBox();
  scene.add(target);
  target.scale.set(0.1, 0.1, 0.1);
}




function updateThree() {

  updateSpringMeshes();
  updateSwimMotion();

  //updateFlyingRoute();
  t++;

  //rotate the creature group
  //creature.rotation.y = sin(frame * 0.001) * PI;


  for (let i = 0; i < joints.length; i++) {
    //joints[i].update(pose.left_elbow);
  }

  let posArray = seaPlane.geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.025 + frame * 0.009;
    //let yOffset = (y + WORLD_HALF) * 0.008 + frame * 0.02;
    let zOffset = (y + WORLD_HALF) * 0.025 + frame * 0.009;
    let amp = 4;
    let noiseValue = (noise(xOffset, zOffset) * amp) ** 1.5;

    posArray[i + 2] = noiseValue; // update the z value
  }
  seaPlane.geometry.attributes.position.needsUpdate = true;

  if (model01 !== undefined) {
    // model.rotation.x += 0.01;
    // model01.scale.z = 2.0;
  }
}

function getMoon() {
  const geometry = new THREE.SphereGeometry(8, 24, 24); // adjust size as needed
  const material = new THREE.MeshStandardMaterial({ map: moonTexture });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getSprite() {
  const map = new THREE.TextureLoader().load('assets/sprite.png');
  map.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    color: 0xffffff,
    map: map,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(material);
  return sprite;
}


function getLight() {
  const light = new THREE.PointLight(0xFFFFFF, 1, 2000, 0.003);
  scene.add(light);
  return light;
}

function getLightGroup() {
  const group = new THREE.Group();

  // light
  const light = new THREE.PointLight(0xFFFFFF, 1, 10000, 0.005);
  group.add(light);

  // sphere
  const sphere = getSphere();
  sphere.scale.set(8, 8, 8);
  group.add(sphere);

  // sprite
  const sprite = getSprite();
  sprite.scale.set(40, 40, 1);
  group.add(sprite);

  return group;
}

function getSphere() {
  let geometry = new THREE.SphereGeometry(1, 24, 24);
  let material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  let mesh = new THREE.Mesh(geometry, material);
  // no adding to the scene
  return mesh;
}

function getBigSphere() {
  let geometry = new THREE.SphereGeometry(1, 24, 24);
  let material = new THREE.MeshBasicMaterial({
    color: "#050505"
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  let geometry = new THREE.PlaneGeometry(WORLD_HALF * 10, WORLD_HALF * 10, 100, 100);
  let material = new THREE.MeshPhongMaterial({
    // wireframe: true,
    side: THREE.DoubleSide,
    map: seaTexture,
    transparent: true,
    opacity: 0.6,
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, -2.5, 0);

  return mesh;
}

function loadGLTF(filepath, callback) {
  // load .glft file
  const loader = new GLTFLoader();

  loader.load(
    filepath,
    function (gltfData) {
      const model = gltfData.scene.children[0];
      // console.log(model);

      scene.add(model);
      callback(model);
    },
    function (xhr) {
      // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (err) {
      // console.error('An error happened');
    }
  );
}
/*
function loadBodyGLTF(filepath, callback) {
  // load .glft file
  const loader = new GLTFLoader();

  loader.load(
    filepath,
    function (gltfData) {
      const model = gltfData.scene.children[0];  // the first child of the loaded scene
      console.log(model);
      callback(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (err) {
      console.error('An error happened');
    }
  );
}
*/

function loadBodyGLTF(filepath, callback) {
  const loader = new GLTFLoader();

  loader.load(filepath, (gltfData) => {
    const model = gltfData.scene.children[0];
    model.position.set(0, 30, 0);
    model.scale.set(BODYPART_SCALE, BODYPART_SCALE, BODYPART_SCALE);
    callback(model);
  }, undefined, (error) => {
    console.error('An error happened', error);
  });
}

function loadAndSetupCreature() {
  loadBodyGLTF('assets/bodyPart01-head.gltf', (model1) => {
    bodyParts.push(model1);
    creature.add(model1);
    // Setup connection and spring for model1

    loadBodyGLTF('assets/bodyPart01-5.gltf', (model1_5) => {
      bodyParts.push(model1_5);
      creature.add(model1_5);
      // Setup connection and spring for model2

      loadBodyGLTF('assets/bodyPart02.gltf', (model2) => {
        bodyParts.push(model2);
        creature.add(model2);
        // Setup connection and spring for model3

        loadBodyGLTF('assets/bodyPart03.gltf', (model3) => {
          bodyParts.push(model3);
          creature.add(model3);
          // Setup connection and spring for model4

          loadBodyGLTF('assets/bodyPart4_Tail.gltf', (model4) => {
            bodyParts.push(model4);
            creature.add(model4);
            // Setup connection and spring for model5

            // After all models are loaded and setup:
            setupSpringMeshes();
          });
        });
      });
      //setupSpringMeshes();
    });
  });
}

//this is the mirror material
function getPlaneMirror() {
  let geometry = new THREE.CircleGeometry(15, 50, 50);
  let reflector = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: "#a199de",
    side: THREE.DoubleSide
  });
  return reflector;
}

function updateBoneRotationFromKeypoints(pose, avatar) {
  const leftShoulder = pose.left_shoulder;
  const leftElbow = pose.left_elbow;
  const upperArmBone = avatar.getObjectByName('Bone.006');

  if (leftShoulder.score > 0.1 && leftElbow.score > 0.1 && upperArmBone) {
    // Calculate the direction vector
    const direction = new THREE.Vector3(
      leftElbow.x - leftShoulder.x,
      leftElbow.y - leftShoulder.y,
      leftElbow.z - leftShoulder.z
    );
    direction.normalize();

    // Assuming the bone's default direction is along some axis, calculate the rotation
    // For example, if the bone's default direction is along the Y axis:
    const xAxis = new THREE.Vector3(1, 0, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(xAxis, direction);

    // Apply the rotation to the bone
    upperArmBone.quaternion.multiplyQuaternions(quaternion, upperArmBone.quaternion);
  }
}

class AvatarAnimator {
  constructor() {
    this.keypointToBoneMap = {
      'left_shoulder': 'LeftShoulderBoneName',
      'right_shoulder': 'RightShoulderBoneName',
      // ... other mappings
    };
    // ... other initializations
  }

}

class Joint {
  constructor(chd, result) {
    this.mesh = chd;
    this.result = result;
    // scene.add(this.mesh); // this won't work!!

    // this.mesh.scale.x = 50;
    // this.mesh.scale.y = 30;
    // this.mesh.scale.z = 30;
    // this.mesh.translate(0.5, 0, 0);

    // this.start = start;
    // this.end = end;
  }
  update(data) {
    const confidenceThreshold = 0.1
    this.result = data;
    //this.mesh.rotation.x = data.x;

    //console.log(this.mesh.rotation);

    // if (this.result.score < confidenceThreshold || this.end.score < confidenceThreshold) {
    //   this.mesh.visible = false;
    //   return;
    // } else {
    //   this.mesh.visible = true;
    // }

    let startVector = new THREE.Vector3();
    startVector.x = map(this.result.x, 0, VIDEO_WIDTH, -1.0, 1.0) * params.poseScale;
    startVector.y = map(this.result.y, 0, VIDEO_WIDTH, 1.0, -1.0) * params.poseScale; // flipped!
    startVector.z = this.result.z * params.poseScale * -0.5; // flipped.


    this.mesh.rotation.copy(startVector);//update the position
    this.mesh.rotation.x = startVector.x;
    this.mesh.rotation.y = startVector.y;
    //this.mesh.scale.x = distance;
  }
}

class Spring {
  constructor(a, b, len, model) {
    this.a = a;
    this.b = b;
    this.len = len;
    this.k = 0.012; // ***

    this.mesh = model;

    //this.mesh = getBox();
    //this.mesh.geometry.translate(0, 0, -0.5);
    //scene.add(this.mesh);
  }
  update() {
    let force = p5.Vector.sub(this.b.pos, this.a.pos);
    let distance = force.mag();

    let stretch = distance - this.len;
    let mag = -1 * this.k * stretch; // Hooke's Law

    //console.log(mag);
    force.normalize(); // direction
    force.mult(mag);
    this.b.applyForce(force);

    force.mult(-1);
    this.a.applyForce(force);

    this.updateMesh();
  }
  updateMesh() {
    // rotate the bar to the cube's position (get the direction from the bar to the cube)
    let position = new THREE.Vector3(this.a.pos.x, this.a.pos.y, this.a.pos.z);
    let targetPosition = new THREE.Vector3(this.b.pos.x, this.b.pos.y, this.b.pos.z);

    let direction = new THREE.Vector3().subVectors(targetPosition, position);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
    this.mesh.rotation.setFromQuaternion(quaternion);

    //set the position for the mesh this line!!
    this.mesh.position.copy(position);
    this.mesh.scale.x = 14;
    this.mesh.scale.y = 14;
    this.mesh.scale.z = 18 * direction.length();//change the length of the spring
  }
}

class Connection {
  constructor(x, y, z, size, modelP) {
    this.pos = createVector(x, y, z);
    this.vel = createVector();
    this.acc = createVector();
    //
    this.size = size;
    this.mass = this.rad / 10;
    //
    // this.damping = 0.90; // -0.03%
    this.damping = 0.93; // -0.03%


    this.mesh = getBox();//can be uodated to my mesh later
    // scene.add(this.mesh);//this is for the test of spring(not need)
  }

  update() {
    //this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
  drag() {
    // this won't work in 3D
    let mouseVec = createVector(mouseX, mouseY);
    let distance = this.pos.dist(mouseVec);
    if (distance < this.rad + 50 && mouseIsPressed) {
      this.pos.x = mouseX;
      this.pos.y = mouseY;
    }
  }
  applyForce(f) {
    if (this.mass <= 0) {
      // console.log("Wrong mass!");
      return;
    }
    let force = p5.Vector.div(f, this.mass);
    //console.log(force.mag());
    this.acc.add(force); // force accumulation
  }
  adjustVelocity(amount) {
    //Coefficient of Restitution
    this.vel.mult(1 + amount);
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); // ***
    //
    this.vel.mult(this.damping);
  }
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshNormalMaterial();
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}


let springs = [];
let connections = [];

function loadCreatureBodyParts() {
  let count = 0;
  for (let i = 0; i < bodyPartGLTFpaths.length; i++) {
    let filepath = bodyPartGLTFpaths[i];
    loadBodyGLTF(filepath, function (model) {

      creature.add(model);
      // model.position.set(0, 10, 0);
      model.scale.set(BODYPART_SCALE, BODYPART_SCALE, BODYPART_SCALE);
      //model.rotation.set(0, 180, 0);

      //bodyParts.push(model);
      bodyParts[i] = model;

      // spring
      count++;
      console.log("bodyPart", i, "loaded", count);

      if (count === bodyPartGLTFpaths.length) {
        console.log("All body parts loaded");
        setupSpringMeshes();
      }
    });
  }
}
//1st verison to setup the spring mesh with for loop

function setupSpringMeshes() {
  console.log("Ready!!");
  // let springLengths = [
  //   BODYPART_SCALE * 1,
  //   BODYPART_SCALE * 0.7 * 1,
  //   BODYPART_SCALE * 0.9 * 2.5,
  //   BODYPART_SCALE * 1.21 * 5,
  //   BODYPART_SCALE * 2.8 * 2];
  let springLengths = [
    BODYPART_SCALE * 1,
    BODYPART_SCALE * 0.7 * 1,
    BODYPART_SCALE * 0.9 * 2,
    BODYPART_SCALE * 1.21 * 2,
    BODYPART_SCALE * 1.21 * 3,
    BODYPART_SCALE * 2.8 * 1];
  // create connections
  for (let i = 0; i < bodyParts.length + 1; i++) {
    //connections.push(new Connection(0, 80 + 20 * i, 0, 5));
    connections.push(new Connection(20 * i, 8, 0, 5));
  }
  // create springs with connections and body parts
  for (let i = 0; i < connections.length - 1; i++) {
    let a = connections[i];
    let b = connections[i + 1];
    let len = springLengths[i]; // Use the specific length for each spring
    let s = new Spring(a, b, len, bodyParts[i]);
    springs.push(s);
  }
}

function updateSpringMeshes() {
  if (connections.length == 0 || springs.length == 0) return;

  // Parameters for the circular path
  let circleRadius = 90; // Radius of the circle
  let circleSpeed = 0.01 * 0.5; // Speed of the movement along the circle

  // Calculate the new position for the first connection
  if (controllerPressed) {
    let amount = 0.05;
    connections[0].pos.x = lerp(connections[0].pos.x, target.position.x, amount);
    connections[0].pos.y = lerp(connections[0].pos.y, target.position.y, amount);
    connections[0].pos.z = lerp(connections[0].pos.z, target.position.z, amount);
  } else {
    let targetPos = createVector();
    targetPos.x = Math.sin(frame * circleSpeed) * circleRadius;
    targetPos.z = Math.cos(frame * circleSpeed) * circleRadius;
    targetPos.y = Math.sin(frame * circleSpeed * 0.5) * circleRadius * 0.5;

    let amount = 0.15;
    connections[0].pos.x = lerp(connections[0].pos.x, targetPos.x, amount);
    connections[0].pos.y = lerp(connections[0].pos.y, targetPos.y, amount);
    connections[0].pos.z = lerp(connections[0].pos.z, targetPos.z, amount);
  }



  // Update springs and connections
  for (let i = 0; i < springs.length; i++) {
    springs[i].update();
  }

  for (let i = 0; i < connections.length; i++) {
    connections[i].move();
    connections[i].update();
  }
}

let swimOffset = 0;

function updateSwimMotion() {
  swimOffset += 0.015; // Adjust this value for speed
  // a wave-like motion to each part
  for (let i = 0; i < connections.length; i++) {
    let phase = swimOffset + i * 0.3; // Adjust the 0.5 for phase difference between parts
    connections[i].pos.z += 0; //Math.sin(phase) * 0.2; // Vertical movement
    connections[i].pos.x += Math.cos(phase * 0.5) * 0.4; // Horizontal movement
    connections[i].update();
    //connections[i].model.rotation.z = Math.sin(phase) * 0.2; // Adjust rotation
  }
}


let noiseOffset = 0;
let angleX = 0;
let angleY = 0;
let angleZ = 0;

function updateFlyingRoute() {
  noiseOffset += 0.001; // Speed of change

  let noiseX = noise(noiseOffset);
  let noiseY = noise(noiseOffset + 10000); // Offset to get independent value
  let noiseZ = noise(noiseOffset + 20000);

  // Map noise to larger range for movement
  let x = map(sin(frame * 0.01), -1, 1, 3, 8);
  //let x = map(noiseX, 0, 1, 0, 50);
  //let y = map(noiseY, 0, 1, 0, 50);
  let y = map(cos(frame * 0.01), -1, 1, 3, 8);
  let z = map(noiseZ, 0, 1, -2, 2);

  // Update creature position
  creature.position.set(x, y, z); // Assuming 'creature' is a Group or similar object

  angleX += 0.01;
  angleY += 0.01;
  angleZ += 0.01;

  creature.rotation.x = map(noise(angleX), 0, 1, -Math.PI, Math.PI);
  creature.rotation.y = map(noise(angleY), 0, 1, -Math.PI, Math.PI);
  creature.rotation.z = map(noise(angleZ), 0, 1, -Math.PI, Math.PI);
}

