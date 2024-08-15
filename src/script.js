import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as YUKA from 'yuka';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import * as main from './physics/main';


let camera, scene, renderer;
let controls, water, sun, clock;
const mixers = [];
let mixer,mixer1,mixer2,mixer4,mixer5,mixer6,mixer7,mixer8;
let submarine; 
let submarinePosition = new THREE.Vector3(100, -50, 8500);
let submarineLoaded = false;
const entityManager1 = new YUKA.EntityManager();
const entityManager = new YUKA.EntityManager();
const entityManager3 = new YUKA.EntityManager();
const entityManager4 = new YUKA.EntityManager();
const entityManager5 = new YUKA.EntityManager();
const entityManager6 = new YUKA.EntityManager();
const entityManager7 = new YUKA.EntityManager();
let isUnder=false;


init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(0, 100, 900);
  sun = new THREE.Vector3();

  // Water
  const waterGeometry = new THREE.PlaneGeometry(100000, 100000);
  const texture = new THREE.TextureLoader().load("textures/sea1/waternormals.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: texture,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 0.5);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const moveDirection = new THREE.Vector3();

  // Skybox
  const sky = new Sky();
  sky.scale.setScalar(100000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    sky.material.uniforms['sunPosition'].value.copy(sun);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    scene.environment = pmremGenerator.fromScene(sky).texture;
  }

  updateSun();
/*
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 8900);
  //controls.target.set( -1000 , -1000 , -1000);

  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();*/

  controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  
controls.dampingFactor = 0.9; 
controls.maxPolarAngle = Math.PI / 2.3;
controls.update();


  const waterUniforms = water.material.uniforms;

  window.addEventListener('resize', onWindowResize);

  // Debug UI
 const gui = new dat.GUI();
  gui.add(parameters, 'elevation', -90, 180).onChange(updateSun);
  gui.add(parameters, 'azimuth', -180, 180).onChange(updateSun);
  
  gui.add(waterUniforms.distortionScale, "value", 0, 8, 0.1).name("distortionScale");
  gui.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");

  const loader = new GLTFLoader();

  

loader.load('model/submarine.glb', function (glb) {
  submarine = glb.scene;
  scene.add(submarine);
  submarine.position.copy(submarinePosition);
  submarine.scale.set(1, 1, 1);
  mixer7=new THREE.AnimationMixer(submarine);
  const clips=glb.animations;
    clips.forEach(function(clip){
      const action=mixer7.clipAction(clip);
      action.play();
    });

  submarine.add(camera);
  camera.position.set(-9, 90, 300); 
/* 
  const submarineFolder = gui.addFolder('Submarine Position');
  submarineFolder.add(submarine.position, 'x', -1000, 1000).name('Move X');
  submarineFolder.add(submarine.position, 'y', -1000, 1000).name('Move Y');
  submarineFolder.add(submarine.position, 'z', -1000, 10000).name('Move Z');

  // Submarine rotation controls
  submarineFolder.add(submarine.rotation, 'x', 0, Math.PI * 2).name('Rotate X');
  submarineFolder.add(submarine.rotation, 'y', 0, Math.PI * 2).name('Rotate Y');
  submarineFolder.add(submarine.rotation, 'z', 0, Math.PI * 2).name('Rotate Z');
  submarineFolder.open(); */
  submarineLoaded = true;
});


  const mtlLoader = new MTLLoader();
 mtlLoader.load('model/island3.mtl', function (materials) {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('model/island3.obj', function (obj) {
      scene.add(obj);
      obj.position.set(-10000, -50, -50);
      obj.scale.set(10, 10, 10);
    });
  });

  mtlLoader.load('model/island3.mtl', function (materials) {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('model/island3.obj', function (obj) {
      scene.add(obj);
      obj.position.set(5900, -50, -50);
      obj.scale.set(10, 10, 10);
    });
  });

  mtlLoader.load('model/island3.mtl', function (materials) {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('model/island3.obj', function (obj) {
      scene.add(obj);
      obj.position.set(-15000, -50, -50);
      obj.scale.set(10, 10, 10);
    });
  });

  loader.load('model/birds.glb', function (glb) {
    const model = glb.scene;
    scene.add(model);
    model.position.set(0, 1500, 0);
    model.scale.set(500, 500, 500);

    if (glb.animations && glb.animations.length) {
      const mixer = new THREE.AnimationMixer(model);
      glb.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      mixers.push(mixer);
    }
  });

  
  function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
    
  }

    loader.load('model/nimo/clown_fish.glb', function(glb){
      const model = glb.scene;
      const clips = glb.animations;
      const fishes = new THREE.AnimationObjectGroup();
      mixer = new THREE.AnimationMixer(fishes);
      const clip = THREE.AnimationClip.findByName(clips, 'Fish_001_animate_preview');
      const action = mixer.clipAction(clip);
      action.play();
    
      const alifnmentBehabior = new YUKA.AlignmentBehavior();
      alifnmentBehabior.weight = 2;
    
      const cohesionBehavior = new YUKA.CohesionBehavior();
      cohesionBehavior.weight = 2;
      const createFishPath = (startPosition) => {
        const targetPosition = new YUKA.Vector3(vehicle.position.x+200, vehicle.position.y, vehicle.position.z ); 
        const path = new YUKA.Path();
        path.add(startPosition);        
        path.add(targetPosition);       
        path.add(startPosition);        
        path.loop = true;             
        return path;
      };
    
      for (let i = 0; i < 30; i++) {
        const fishClone = SkeletonUtils.clone(model);
        fishClone.matrixAutoUpdate = false;
        scene.add(fishClone);
        fishes.add(fishClone);
    
        const vehicle = new YUKA.Vehicle();
        vehicle.setRenderComponent(fishClone, sync);
        vehicle.scale.set(0.4, 0.4, 0.4);
    
        const startPosition = new YUKA.Vector3(
          -150 + Math.random() * 400 - 200,
          -5200, 
          2.5 + Math.random() * 400 - 200

        );
    
        const fishPath = createFishPath(startPosition);
    
        const followPathBehavior = new YUKA.FollowPathBehavior(fishPath, 2); 
        vehicle.steering.add(followPathBehavior);
    
    
        const wanderBehavior = new YUKA.WanderBehavior();
        vehicle.steering.add(wanderBehavior);
        wanderBehavior.weight = 0.1;
    
        vehicle.updateNeighborhood = true;
        vehicle.neighborhoodRadius = 10;
    
        vehicle.steering.add(alifnmentBehabior);
        // vehicle.steering.add(cohesionBehavior);
        // vehicle.steering.add(separationBehavior);
    
        entityManager.add(vehicle);
    
        vehicle.position.copy(startPosition);
        vehicle.rotation.fromEuler(0, 2 * Math.PI * Math.random(), 0);
      }
    });
  
  loader.load('model/shark/swimming_shark__animated.glb',function(glb){
    const model=glb.scene;
    scene.add(model);
    model.position.set(0,-6000,0);
    model.scale.set(50,50,50)
    mixer1=new THREE.AnimationMixer(model);
    const clips=glb.animations;
    clips.forEach(function(clip){
      const action=mixer1.clipAction(clip);
      action.play();
    });
  
  });

  
  const vehicleGeometry = new THREE.ConeBufferGeometry(0.1, 0.5, 8);
  vehicleGeometry.rotateX(Math.PI * 0.5);
  const vehicleMaterial = new THREE.MeshNormalMaterial();
  const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
  vehicleMesh.matrixAutoUpdate = false;

  const vehicle1 = new YUKA.Vehicle();

  vehicle1.setRenderComponent(vehicleMesh, sync);

  const path = new YUKA.Path();
  path.add( new YUKA.Vector3(-500, -5200, 500));
  path.add( new YUKA.Vector3(-1000, -5200, 0));
  path.add( new YUKA.Vector3(-500, -5200, -500));
  path.add( new YUKA.Vector3(0, -5200, 0));
  path.add( new YUKA.Vector3(500, -5200, -500));
  path.add( new YUKA.Vector3(1000, -5200, 1000));
  path.add( new YUKA.Vector3(1000, -5200, 1000));
  path.add( new YUKA.Vector3(0, -5200, 500));

  path.loop = true;

  vehicle1.position.copy(path.current());

  vehicle1.maxSpeed = 15;

  const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
  vehicle1.steering.add(followPathBehavior);

  const onPathBehavior = new YUKA.OnPathBehavior(path);
  onPathBehavior.radius = 2;
  vehicle1.steering.add(onPathBehavior);

  entityManager1.add(vehicle1);

  
  loader.load('model/shark/great_white_shark (1).glb',function(glb){
    const model=glb.scene;
    scene.add(model);
    mixer2=new THREE.AnimationMixer(model);
    const clips=glb.animations;
    clips.forEach(function(clip){
      const action=mixer2.clipAction(clip);
      action.play();
    });
    model.matrixAutoUpdate=false;
    vehicle1.scale=new YUKA.Vector3(200,200,200);
   // vehicle1.position=new YUKA.Vector3(10,10.2);
    vehicle1.setRenderComponent(model,sync);
  
  });

  
loader.load('model/fish/largemouth_bass.glb', function(glb) {
  const model = glb.scene;
      const fishes = new THREE.AnimationObjectGroup();
      mixer8 = new THREE.AnimationMixer(fishes);
      const clips=glb.animations;

    clips.forEach(function(clip){
      const action=mixer8.clipAction(clip);
      action.play();
    });
    
      const alifnmentBehabior = new YUKA.AlignmentBehavior();
      alifnmentBehabior.weight = 2;
    
      const cohesionBehavior = new YUKA.CohesionBehavior();
      cohesionBehavior.weight = 2;
      const createFishPath = (startPosition) => {
        const targetPosition = new YUKA.Vector3(vehicle.position.x  , vehicle.position.y, vehicle.position.z + 200); 
        const path = new YUKA.Path();
        path.add(startPosition);        
        path.add(targetPosition);       
        path.add(startPosition);        
        path.loop = true;             
        return path;
      };
    
      for (let i = 0; i < 30; i++) {
        const fishClone = SkeletonUtils.clone(model);
        fishClone.matrixAutoUpdate = false;
        scene.add(fishClone);
        fishes.add(fishClone);
    
        const vehicle = new YUKA.Vehicle();
        vehicle.setRenderComponent(fishClone, sync);
        vehicle.scale.set(40, 40, 40);
    
        const startPosition = new YUKA.Vector3(
          700 + Math.random() * 500 - 250,
          -6000, 
          2.5 + Math.random() * 500 - 250

        );
    
        const fishPath = createFishPath(startPosition);
    
        const followPathBehavior = new YUKA.FollowPathBehavior(fishPath, 2); 
        vehicle.steering.add(followPathBehavior);
    
    
        const wanderBehavior = new YUKA.WanderBehavior();
        vehicle.steering.add(wanderBehavior);
        wanderBehavior.weight = 0.1;
    
        vehicle.updateNeighborhood = true;
        vehicle.neighborhoodRadius = 10;
    
        vehicle.steering.add(alifnmentBehabior);
        // vehicle.steering.add(cohesionBehavior);
        // vehicle.steering.add(separationBehavior);
    
        entityManager7.add(vehicle);
    
        vehicle.position.copy(startPosition);
        vehicle.rotation.fromEuler(0, 2 * Math.PI * Math.random(), 0);
      }
});
  

  
  loader.load('model/fish/guppy_fish.glb',function(glb){

    const model = glb.scene;
      const fishes = new THREE.AnimationObjectGroup();
      mixer4 = new THREE.AnimationMixer(fishes);
      const clips=glb.animations;

    clips.forEach(function(clip){
      const action=mixer4.clipAction(clip);
      action.play();
    });
    
      const alifnmentBehabior = new YUKA.AlignmentBehavior();
      alifnmentBehabior.weight = 2;
    
      const cohesionBehavior = new YUKA.CohesionBehavior();
      cohesionBehavior.weight = 2;
      const createFishPath = (startPosition) => {
        const targetPosition = new YUKA.Vector3(vehicle.position.x - 400, vehicle.position.y, vehicle.position.z ); 
        const path = new YUKA.Path();
        path.add(startPosition);        
        path.add(targetPosition);       
        path.add(startPosition);        
        path.loop = true;             
        return path;
      };
    
      for (let i = 0; i < 30; i++) {
        const fishClone = SkeletonUtils.clone(model);
        fishClone.matrixAutoUpdate = false;
        scene.add(fishClone);
        fishes.add(fishClone);
    
        const vehicle = new YUKA.Vehicle();
        vehicle.setRenderComponent(fishClone, sync);
        vehicle.scale.set(7, 7, 7);
    
        const startPosition = new YUKA.Vector3(
          -1000 + Math.random() * 600 - 300,
          -6000, 
          2.5 + Math.random() * 600 - 300

        );
    
        const fishPath = createFishPath(startPosition);
    
        const followPathBehavior = new YUKA.FollowPathBehavior(fishPath, 2); 
        vehicle.steering.add(followPathBehavior);
    
    
        const wanderBehavior = new YUKA.WanderBehavior();
        vehicle.steering.add(wanderBehavior);
        wanderBehavior.weight = 0.1;
    
        vehicle.updateNeighborhood = true;
        vehicle.neighborhoodRadius = 10;
    
        vehicle.steering.add(alifnmentBehabior);
        // vehicle.steering.add(cohesionBehavior);
        // vehicle.steering.add(separationBehavior);
    
        entityManager3.add(vehicle);
    
        vehicle.position.copy(startPosition);
        vehicle.rotation.fromEuler(0, 2 * Math.PI * Math.random(), 0);
      }
  });
 
  function update(delta) {
    entityManager3.update(delta);
  
    entityManager3.entities.forEach(vehicle => {
      const position = vehicle.position;
      position.z += delta * 20; 
      if (position.z > 50) {
        position.z = -50; 
      }
    });
  
    mixer4.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }
  
  const vehicleGeometry2 = new THREE.ConeBufferGeometry(0.1, 0.5, 8);
  vehicleGeometry2.rotateX(Math.PI * 0.5);
  const vehicleMaterial2 = new THREE.MeshNormalMaterial();
  const vehicleMesh2 = new THREE.Mesh(vehicleGeometry2, vehicleMaterial2);
  vehicleMesh2.matrixAutoUpdate = false;

  const vehicle2 = new YUKA.Vehicle();

  vehicle2.setRenderComponent(vehicleMesh2, sync);

  const path2 = new YUKA.Path();
  path2.add(new YUKA.Vector3(1500, -4500, 1000));
  path2.add(new YUKA.Vector3(-1500, -4500, 1000));
  path2.loop = true; 


  vehicle2.position.copy(path2.current());

  vehicle2.maxSpeed = 30;

  const followPathBehavior2 = new YUKA.FollowPathBehavior(path2, 0.5);
  vehicle2.steering.add(followPathBehavior2);

  const onPathBehavior2 = new YUKA.OnPathBehavior(path2);
  onPathBehavior2.radius = 2;
  vehicle2.steering.add(onPathBehavior2);

  entityManager5.add(vehicle2);
/*
loader.load('model/fish/dolphinn.glb',function(glb){
  const model=glb.scene;
  scene.add(model);
  mixer6=new THREE.AnimationMixer(model);
  const clips=glb.animations;

  clips.forEach(function(clip) {
    const action = mixer6.clipAction(clip);
    action.play();
  });

  model.matrixAutoUpdate=false;
  vehicle2.scale=new YUKA.Vector3(20,20,20);
 // vehicle1.position=new YUKA.Vector3(10,10.2);
  vehicle2.setRenderComponent(model,sync);

});*/
/*
const vehicleGeometry3 = new THREE.ConeBufferGeometry(0.1, 0.5, 8);
vehicleGeometry3.rotateX(Math.PI * 0.5);
const vehicleMaterial3 = new THREE.MeshNormalMaterial();
const vehicleMesh3 = new THREE.Mesh(vehicleGeometry3, vehicleMaterial3);
vehicleMesh3.matrixAutoUpdate = false;

const vehicle3 = new YUKA.Vehicle();

vehicle3.setRenderComponent(vehicleMesh3, sync);

const path3 = new YUKA.Path();
path3.add(new YUKA.Vector3(1400, -5800, 1300));
path3.add(new YUKA.Vector3(-1400, -5800, 1300));
path3.loop = true; 


vehicle3.position.copy(path3.current());

vehicle3.maxSpeed = 7;

const followPathBehavior3 = new YUKA.FollowPathBehavior(path3, 0.5);
vehicleGeometry3.steering.add(followPathBehavior3);

const onPathBehavior3 = new YUKA.OnPathBehavior(path3);
onPathBehavior3.radius = 2;
vehicle3.steering.add(onPathBehavior3);

entityManager6.add(vehicle3);

loader.load('model/fish/dolphinn.glb',function(glb){
   const model=glb.scene;
    scene.add(model);
    mixer7=new THREE.AnimationMixer(model);
    const clips=glb.animations;

    clips.forEach(function(clip) {
      const action = mixer7.clipAction(clip);
      action.play();
    });
    model.matrixAutoUpdate=false;
    vehicle3.scale=new YUKA.Vector3(100,100,100);
   // vehicle1.position=new YUKA.Vector3(10,10.2);
    vehicle3.setRenderComponent(model,sync);

});
  
  
*/
  const vehicleGeometry1 = new THREE.ConeBufferGeometry(0.1, 0.5, 8);
  vehicleGeometry1.rotateX(Math.PI * 0.5);
  const vehicleMaterial1 = new THREE.MeshNormalMaterial();
  const vehicleMesh1 = new THREE.Mesh(vehicleGeometry1, vehicleMaterial1);
  vehicleMesh1.matrixAutoUpdate = false;

  const vehicle = new YUKA.Vehicle();

  vehicle.setRenderComponent(vehicleMesh1, sync);

  const path1 = new YUKA.Path();
  path1.add(new YUKA.Vector3(1500, -5800, -1300));
  path1.add(new YUKA.Vector3(-1500, -5800, -1300));
  path1.loop = true; 


  vehicle.position.copy(path1.current());

  vehicle.maxSpeed = 7;

  const followPathBehavior1 = new YUKA.FollowPathBehavior(path1, 0.5);
  vehicle.steering.add(followPathBehavior1);

  const onPathBehavior1 = new YUKA.OnPathBehavior(path1);
  onPathBehavior1.radius = 2;
  vehicle.steering.add(onPathBehavior1);

  entityManager4.add(vehicle);


loader.load('model/fish/turtle.glb', function(glb) {
  const model=glb.scene;
    scene.add(model);
    mixer5=new THREE.AnimationMixer(model);
    const clips=glb.animations;

    clips.forEach(function(clip) {
      const action = mixer5.clipAction(clip);
      action.play();
    });
    model.matrixAutoUpdate=false;
    vehicle.scale=new YUKA.Vector3(100,100,100);
   // vehicle1.position=new YUKA.Vector3(10,10.2);
    vehicle.setRenderComponent(model,sync);

});


  
  requestAnimationFrame(update);
  
  
  const geometry = new THREE.SphereGeometry( 0.2, 32, 16 ); 
  const material = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('textures/hh.jpg'),side:THREE.DoubleSide});
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(0,-5200,0);
  mesh.scale.set(10000,10000,10000);
  scene.add( mesh );


  

  clock = new THREE.Clock();
}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let rotateLeft = false, rotateRight = false, rotateUp = false, rotateDown = false;
function onKeyDown(event) {
  switch (event.keyCode) {
    /* case 87: // W
      moveForward = true;
      break;
    case 65: // A
      moveLeft = true;
      break;
    case 83: // S
      moveBackward = true;
      break;
    case 68: // D
      moveRight = true;
      break; */
    case 76: // L (Move to sphere)
      moveToSphere();
      break;
  /*  case 72: // H (Move back above water)
      moveAboveWater();
      break;*/
      case 81: // Q
      rotateLeft = true;
      break;
    case 69: // E
      rotateRight = true;
      break;
    case 82: // R
      rotateUp = true;
      break;
    case 70: // F
      rotateDown = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    /* case 87: // W
      moveForward = false;
      break;
    case 65: // A
      moveLeft = false;
      break;
    case 83: // S
      moveBackward = false;
      break;
    case 68: // D
      moveRight = false;
      break; */
      case 81: // Q
      rotateLeft = false;
      break;
    case 69: // E
      rotateRight = false;
      break;
    case 82: // R
      rotateUp = false;
      break;
    case 70: // F
      rotateDown = false;
      break;
  }
}0
function moveToSphere() {
  isUnder=true;
  submarinePosition = new THREE.Vector3(0, -5500, -1100);
  submarine.position.copy(submarinePosition);
  //submarine.position.set(0, -5200, 1100);
  camera.position.set(-5, 100, 350); 
  controls.target.set(0, -5200, 0); 
  controls.update();
}


function moveAboveWater() {
  camera.position.set(0, 100, 900);
  controls.target.set(0, 100, 0);
  controls.update();
  if (submarine) {
    submarine.position.set(100, -150, 8500);
  }
}

function draw() {
  const delta = clock.getDelta();

  if (mixer){
    mixer.update(delta);
  }
  if (mixer1){
    mixer1.update(delta);
  }
  if (mixer2){
    mixer2.update(delta);
  }
  if (mixer4){
    mixer4.update(delta);
  }
  if (mixer5){
    mixer5.update(delta);
  }
  if (mixer6){
    mixer6.update(delta);
  }
  if (mixer7){
    mixer7.update(delta);
  }
  if (mixer8){
    mixer8.update(delta);
  }


  if (moveForward) submarine.translateZ(-20 * delta);
  if (moveBackward) submarine.translateZ(20 * delta);
  if (moveLeft) submarine.translateX(-20 * delta);
  if (moveRight) submarine.translateX(20 * delta);
  if (rotateLeft) submarine.rotation.y += 0.0008;
  if (rotateRight) submarine.rotation.y -= 0.0008;
  if (rotateUp&&isUnder==true) submarine.rotation.x += 0.0008;
  if (rotateDown&&isUnder==true) submarine.rotation.x -= 0.0008;
  
  mixers.forEach((mixer) => mixer.update(delta));

  entityManager.update(delta);
  entityManager1.update(delta);
  entityManager3.update(delta);
  entityManager4.update(delta);
  entityManager5.update(delta);
  //entityManager6.update(delta);
  entityManager7.update(delta);


  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function animate() {
  
  if (submarineLoaded) {
    //console.log(`Updated Submarine Position: x=${submarine.position.x}, y=${submarine.position.y}, z=${submarine.position.z}`);
    submarinePosition = main.simulate(submarinePosition);

    //main.chartSimulate();
    //console.log("submarine position", submarinePosition);

    //newPosition = newPosition.multiplyScalar(0.0000000001);
    //console.log("new pos", newPosition);

    // Update the submarine's position
    submarine.position.copy(submarinePosition);

    // Debug - Log Updated Position
    //console.log(`Updated Submarine Position: x=${submarine.position.x}, y=${submarine.position.y}, z=${submarine.position.z}`);
  }

  requestAnimationFrame(animate);

  render();
  controls.update();
}

function render() {
  water.material.uniforms['time'].value += 1.0 / 60.0;
  renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize);
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

draw();
