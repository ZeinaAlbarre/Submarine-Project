import * as THREE from 'three';
import Drag from './Drag';
import Buoyancy from './Buoyancy';
import Lift from './Lift';
import Variables from "./Variables";
import Engine from "./Engine";
import Weight from './Weight.js';
import Retrograde from './Retrograde.js';



// Variables
const variables = new Variables(
    0, //Ve Velocity of fan
    785398, //mass
    0, //water mass
    5, //radius
    2000, //Pe power of engine
    3, //Aw Area of flipper
    0, //alpha (Horizontal angle)
    0, //beta (Vertical angle)
    10, //length
    new THREE.Vector3(),
    0,
    0
);

let coordinate = new THREE.Vector3(0, 0, 0);
let thetaH = new THREE.Vector3(0, variables.alpha, variables.alpha);
let thetaV = new THREE.Vector3(0, variables.beta, 0);
let t = 1;

const retrograde = new Retrograde(variables, coordinate, variables.prevVelocity, 1);

variables.prevVelocity = retrograde.calcVelocity();


const liftH = new Lift(
    variables, //variables
    variables.prevVelocity, //velocity
    thetaH
);

const liftV = new Lift(
    variables, //variables
    variables.prevVelocity, //velocity
    thetaV
);

const drag = new Drag(
    variables,
    variables.prevVelocity
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
            if(variables.alpha - 1 >= 0)
              variables.alpha -= 1;
              liftH.theta.y = variables.alpha; // Update thetaH.y
              liftH.theta.z = variables.alpha; // Update thetaH.z
              liftH.updateForces();
              console.log('updated alpha', variables.alpha);
              break;
          case "ArrowUp":
            if(variables.alpha + 1 <= 30)
              variables.alpha += 1;
              liftH.theta.y = variables.alpha; // Update thetaH.y
              liftH.theta.z = variables.alpha; // Update thetaH.z
              liftH.updateForces();
              console.log('updated alpha', variables.alpha);
              break;
          case "ArrowLeft":
            if(variables.beta - 1 >= 0)
              variables.beta -= 1;
              liftV.theta.y = variables.beta; // Update thetaV.y
              liftV.theta.z = variables.beta; // Update thetaV.z
              liftV.updateForces();
              console.log('updated BETA', variables.beta);
              break;
          case "ArrowRight":
            if(variables.beta + 1 <= 30)
              variables.beta += 1;
              liftV.theta.y = variables.beta; // Update thetaV.y
              liftV.theta.z = variables.beta; // Update thetaV.z
              liftV.updateForces();
              console.log('updated BETA', variables.beta);
              break;

              case "W" : case "w": // W
              variables.Ve += 10;
                  engine.updateFe();
                  console.log("updated VE", engine.variable.Ve);
                  break;
              case "S" : case "s": // W
                  if (variables.Ve - 10 >= 0) {
                      variables.Ve -= 10;
                  }
                  engine.updateFe();
                  console.log("updated VE", engine.variable.Ve);
                  break;
          case "A" : case "a": // A
              variables.wm += 1000;
              weight.updateFw();
              console.log("updated weight", weight.Fw);
              console.log("updated M", variables.wm + variables.m);
              break;
          case "D" : case "d": // A
          if(variables.wm - 1000 >= 0){
              variables.wm -= 1000;
            weight.updateFw();

            }
              console.log("updated weight", weight.Fw);
              console.log("updated M", variables.wm + variables.m);
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



let position = new THREE.Vector3(0, 0, 0);
  function simulate (submarinePosition) {


    retrograde.prevVelocity = retrograde.calcVelocity();
    variables.prevVelocity = retrograde.prevVelocity;
    //console.log(variables.prevVelocity);
    //console.log(liftH, liftV);
    // Recalculate the forces based on the updated velocity
    //drag.velocity = retrograde.prevVelocity; // Update drag with the new velocity
    /* liftH.velocity = retrograde.prevVelocity; // Update horizontal lift with the new velocity
    liftV.velocity = retrograde.prevVelocity; // Update vertical lift with the new velocity
 */
    const liftHForce = liftH.forceVector.normalize();
    const liftVForce = liftV.forceVector.normalize();
    const dragForce = drag.Fd.normalize();
    const weightForce = weight.Fw.multiplyScalar(0.000001);
    const buoyancyForce = buoyancy.Fb.multiplyScalar(0.000001);
    const engineForce = engine.Fe.normalize();

    /* liftH.updateForces();
    liftV.updateForces(); */
    drag.updateFd();
    engine.updateFe();
    weight.updateFw();
    buoyancy.updateFb();
    console.log(liftH.forceVector);
    //retrograde.updateTotalForce();
    position.setX(submarinePosition.x + (+1)*engineForce.x + weightForce.x + buoyancyForce.x + dragForce.x + liftHForce.x + liftVForce.x);
    position.setY(submarinePosition.y + (+1)*engineForce.y + weightForce.y + buoyancyForce.y + dragForce.y + liftHForce.y + liftVForce.y);
    position.setZ(submarinePosition.z + (-1)*engineForce.z + weightForce.z + buoyancyForce.z + dragForce.z + liftHForce.z + liftVForce.z);
    //position = position.addVectors(submarinePosition, engineForce);


    return position;
}

  export {simulate};