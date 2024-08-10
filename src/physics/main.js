import * as THREE from 'three';
import Drag from './Drag';
import Buoyancy from './Buoyancy';
import Lift from './Lift';
import Variables from "./Variables";
import Engine from "./Engine";
import Weight from './Weight.js';



// Variables
const variables = new Variables(
    20, //Ve Velocity of fan
    3000, //mass
    4, //radius
    500, //Pe power of engine
    6, //Aw Area of flipper
    0, //alpha (Horizontal angle)
    0, //beta (Vertical angle)
    1000 //length
);

let velocity = new THREE.Vector3(0, 0, 1);
let coordinate = new THREE.Vector3(0, 0, 0);
let thetaH = new THREE.Vector3(0, variables.alpha, variables.alpha);
let thetaV = new THREE.Vector3(0, variables.beta, 0);
let t = 1;



const liftH = new Lift(
    variables, //variables
    velocity, //velocity
    thetaH
);

const liftV = new Lift(
    variables, //variables
    velocity, //velocity
    thetaV
);

const drag = new Drag(
    variables,
    velocity
);


const weight = new Weight(variables);


const buoyancy = new Buoyancy(variables);


const engine = new Engine(variables);

window.addEventListener(
  "keydown",
  (event) => {
      if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
      }

      switch (event.key) {
          case "ArrowDown":
              variables.alpha -= 10;
              liftH.theta.y = variables.alpha; // Update thetaH.y
              liftH.theta.z = variables.alpha; // Update thetaH.z
              liftH.updateForces();
              console.log('updated alpha', variables.alpha);
              break;
          case "ArrowUp":
              variables.alpha += 10;
              liftH.theta.y = variables.alpha; // Update thetaH.y
              liftH.theta.z = variables.alpha; // Update thetaH.z
              liftH.updateForces();
              console.log('updated alpha', variables.alpha);
              break;
          case "ArrowLeft":
              variables.beta -= 10;
              liftV.theta.y = variables.beta; // Update thetaV.y
              liftV.theta.z = variables.beta; // Update thetaV.z
              liftV.updateForces();
              console.log('updated BETA', variables.beta);
              break;
          case "ArrowRight":
              variables.beta += 10;
              liftV.theta.y = variables.beta; // Update thetaV.y
              liftV.theta.z = variables.beta; // Update thetaV.z
              liftV.updateForces();
              console.log('updated BETA', variables.beta);
              break;

          case "W" || "w": // W
              variables.Ve += 0.1;
              engine.updateFe();
              console.log("updated VE", engine.variable.Ve);
              break;
          case "S" || "s": // W
              variables.Ve -= 0.1;
              engine.updateFe();
              console.log("updated VE", engine.variable.Ve);
              break;
          case "A" || "a": // A
              variables.m += 1000;
              weight.updateFw();
              console.log("updated M", variables.m);
              break;
          case "D" || "d": // A
              variables.m -= 1000;
              weight.updateFw();
              console.log("updated M", variables.m);
              break;
          case "Enter":
              // Do something for "enter" or "return" key press.
              break;
          case " ":
              // Do something for "space" key press.
              break;
          case "Escape":
              // Do something for "esc" key press.
              break;
          default:
              return; // Quit when this doesn't handle the key event.
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
  },
  true
);



  function simulate (submarinePosition) {

    //console.log(liftH, liftV);
    
    let position = new THREE.Vector3(0, 0, 0);
    const liftHForce = liftH.forceVector.multiplyScalar(0.000001);
    const liftVForce = liftV.forceVector.multiplyScalar(0.000001);
    const dragForce = drag.Fd;
    const weightForce = weight.Fw.multiplyScalar(0.000001);
    const buoyancyForce = buoyancy.Fb.multiplyScalar(0.000001);
    const engineForce = engine.Fe.multiplyScalar(0.001);

    //console.log(weightForce);

    //console.log(liftHForce);

//console.log(engineForce);
    //position = position.addTo(submarinePosition,  engineForce);
    //position = 
    //position = position.add();
    console.log(weightForce);
    //position = position.add(buoyancyForce);
    //position = position.add(liftHForce);

    /* position = position.addTo(liftVForce);
    position = position.addTo(dragForce); */

    position.setX(submarinePosition.x + engineForce.x + weightForce.x);
    position.setY(submarinePosition.y + engineForce.y + weightForce.y);
    position.setZ(submarinePosition.z + engineForce.z + weightForce.z);
    //position = position.addVectors(submarinePosition, engineForce);
    //console.log(liftH);

    return position;
}

  export {simulate, liftH, liftV};