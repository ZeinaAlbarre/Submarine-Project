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
    30000, //mass
    0, //water mass
    4, //radius
    500, //Pe power of engine
    6, //Aw Area of flipper
    0, //alpha (Horizontal angle)
    0, //beta (Vertical angle)
    1000, //length
    new THREE.Vector3()
);

let coordinate = new THREE.Vector3(0, 0, 0);
let thetaH = new THREE.Vector3(0, variables.alpha, variables.alpha);
let thetaV = new THREE.Vector3(0, variables.beta, 0);
let t = 1;

const retrograde = new Retrograde(variables, coordinate, variables.prevVelocity, variables.alpha, 1);

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
              variables.Ve += 10;
                  engine.updateFe();
                  console.log("updated VE", engine.variable.Ve);
                  break;
              case "S" || "s": // W
                  if (variables.Ve - 10 >= 0) {
                      variables.Ve -= 10;
                  }
                  engine.updateFe();
                  console.log("updated VE", engine.variable.Ve);
                  break;
          case "A" || "a": // A
              variables.wm += 1000;
              weight.updateFw();
              console.log("updated weight", weight.Fw);
              console.log("updated M", variables.wm);
              break;
          case "D" || "d": // A
          if(variables.wm - 1000 >= 0){
              variables.wm -= 1000;
            weight.updateFw();

            }
              console.log("updated weight", weight.Fw);
              console.log("updated M", variables.wm);
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
    const liftHForce = liftH.forceVector.normalize();
    const liftVForce = liftV.forceVector.normalize();
    const dragForce = drag.Fd.normalize();
    const weightForce = weight.Fw.multiplyScalar(0.000001);
    const buoyancyForce = buoyancy.Fb.multiplyScalar(0.000001);
    const engineForce = engine.Fe.normalize();
    console.log(weight.Fw);
    console.log(buoyancy.Fb);

    //console.log(liftHForce);

//console.log(engineForce);
    //position = position.addTo(submarinePosition,  engineForce);
    //position = 
    //position = position.add();
    console.log(liftH.forceVector);
    console.log(liftV.forceVector);
    //position = position.add(buoyancyForce);
    //position = position.add(liftHForce);

    /* position = position.addTo(liftVForce);
    position = position.addTo(dragForce); */

    //engine.updateFe();
    weight.updateFw();
    position.setX(submarinePosition.x + (+1)*engineForce.x + weightForce.x + buoyancyForce.x + dragForce.x + liftHForce.x + liftVForce.x);
    position.setY(submarinePosition.y + (+1)*engineForce.y + weightForce.y + buoyancyForce.y + dragForce.y + liftHForce.y + liftVForce.y);
    position.setZ(submarinePosition.z + (-1)*engineForce.z + weightForce.z + buoyancyForce.z + dragForce.z + liftHForce.z + liftVForce.z);
    //position = position.addVectors(submarinePosition, engineForce);


    return position;
}

  export {simulate};