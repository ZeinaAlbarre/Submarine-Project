import * as THREE from 'three';
import Drag from './Drag';
import Buoyancy from './Buoyancy';
import Lift from './Lift';
import Variables from "./Variables";
import Engine from "./Engine";
import Weight from './Weight.js';
import Retrograde from './Retrograde.js';
import Calculate_RotationalMotion from './Calculate_RotationalMotion.js';
import Chart from 'chartjs';
import * as dat from 'dat.gui';


let position = new THREE.Vector3(0, 0, 0);
let data = [];
let chart = new Chart();

// Variables
const variables = new Variables(
    0, //Ve Velocity of fan
    785398, //mass
    0, //water mass
    5, //radius
    2000, //Pe power of engine
    3, //Aw Area of flipper
    30, //alpha (Horizontal angle)
    10, //beta (Vertical angle)
    10, //length
    new THREE.Vector3(),
    0,
    0
);

let coordinate = new THREE.Vector3(0, 0, 0);
let thetaH = new THREE.Vector3(0, variables.alpha, variables.alpha);
let thetaV = new THREE.Vector3(0, variables.beta, 0);
let t = 0;

const retrograde = new Retrograde(variables, coordinate, variables.prevVelocity, 1);
const calculate_RotationalMotion = new Calculate_RotationalMotion
    (
        variables,
        variables.prevVelocity,
        variables.Velocity_ang,
        variables.pre_angle,
        1
    );

variables.prevVelocity = retrograde.calcVelocity();
variables.Velocity_ang = calculate_RotationalMotion.velocity_Angular_VelocityRadius();

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
                if (variables.alpha - 1 >= 0)
                    variables.alpha -= 1;
                liftH.theta.y = variables.alpha; // Update thetaH.y
                liftH.theta.z = variables.alpha; // Update thetaH.z
                liftH.updateForces();
                console.log('updated alpha', variables.alpha);
                break;
            case "ArrowUp":
                if (variables.alpha + 1 <= 30)
                    variables.alpha += 1;
                liftH.theta.y = variables.alpha; // Update thetaH.y
                liftH.theta.z = variables.alpha; // Update thetaH.z
                liftH.updateForces();
                console.log('updated alpha', variables.alpha);
                break;
            case "ArrowLeft":
                if (variables.beta - 1 >= 0)
                    variables.beta -= 1;
                liftV.theta.y = variables.beta; // Update thetaV.y
                liftV.updateForces();
                console.log('updated BETA', variables.beta);
                break;
            case "ArrowRight":
                if (variables.beta + 1 <= 30)
                    variables.beta += 1;
                liftV.theta.y = variables.beta; // Update thetaV.y
                liftV.updateForces();
                console.log('updated BETA', variables.beta);
                break;

            case "W": case "w": // W
                variables.Ve += 10;
                engine.updateFe();
                console.log("updated VE", engine.variable.Ve);
                break;
            case "S": case "s": // W
                if (variables.Ve - 10 >= 0) {
                    variables.Ve -= 10;
                }
                engine.updateFe();
                console.log("updated VE", engine.variable.Ve);
                break;
            case "A": case "a": // A
                variables.wm += 1000;
                weight.updateFw();
                buoyancy.updateFb();
                console.log("updated weight", weight.Fw);
                console.log("updated M", variables.wm + variables.m);
                break;
            case "D": case "d": // A
                if (variables.wm - 1000 >= 0) {
                    variables.wm -= 1000;
                    weight.updateFw();
                    buoyancy.updateFb();

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


function simulate(submarinePosition) {


    calculate_RotationalMotion.Velocity_ang = calculate_RotationalMotion.velocity_Angular_VelocityRadius();
    variables.Velocity_ang = calculate_RotationalMotion.Velocity_ang;

    retrograde.prevVelocity = retrograde.calcVelocity();
    variables.prevVelocity = retrograde.prevVelocity;
    //console.log(variables.prevVelocity);
    //console.log(liftH, liftV);
    // Recalculate the forces based on the updated velocity
    //drag.velocity = retrograde.prevVelocity; // Update drag with the new velocity
    /* liftH.velocity = retrograde.prevVelocity; // Update horizontal lift with the new velocity
    liftV.velocity = retrograde.prevVelocity; // Update vertical lift with the new velocity
 */
    liftV.updateForces();
    liftH.updateForces();
    weight.updateFw();
    drag.updateFd();
    engine.updateFe();
    buoyancy.updateFb();
    const liftHForce = liftH.forceVector.multiplyScalar(0.000001);
    const liftVForce = liftV.forceVector.multiplyScalar(0.000001);
    const dragForce = drag.Fd.normalize();
    const weightForce = weight.Fw.multiplyScalar(0.000001);
    const buoyancyForce = buoyancy.Fb.multiplyScalar(0.000001);
    const engineForce = engine.Fe.normalize();

    /* liftH.updateForces();
    liftV.updateForces(); */
    console.log(liftH.forceVector);
    //retrograde.updateTotalForce();
    position.setX(submarinePosition.x + (+1) * engineForce.x + weightForce.x + buoyancyForce.x + dragForce.x + liftHForce.x + liftVForce.x);
    position.setY(submarinePosition.y + (+1) * engineForce.y + weightForce.y + buoyancyForce.y + dragForce.y + liftHForce.y + liftVForce.y);
    position.setZ(submarinePosition.z + (-1) * engineForce.z + weightForce.z + buoyancyForce.z + dragForce.z + liftHForce.z + liftVForce.z);
    //position = position.addVectors(submarinePosition, engineForce);

    //position.addVectors(submarinePosition, engineForce.negate(), weightForce, buoyancyForce, dragForce, liftHForce, liftVForce)


    return position;
}


/* function chartSimulate() {

    
    data.push({ x: t, y: retrograde.calcVelocity().length() }); 
    
    updateChart(t++, retrograde.calcVelocity().length());
} */
console.log(data);
// Debug UI
const gui = new dat.GUI();

gui.add(variables, 'm', 0, 1000000, 100000).name('Submarine Mass (kg)').onChange((value) => {
    variables.m = value;
}).listen();

gui.add(variables, 'wm', 0, 100000, 1000).name('Water mass').onChange((value) => {
    variables.wm = value;
    weight.variable.wm = variables.wm;
    weight.updateFw();
    buoyancy.updateFb();

}).listen();


gui.add(variables, 'V', 0, 2000, 100).name('Submarine Volume').onChange((value) => {
    variables.V = value;
}).listen();

gui.add(variables, 'alpha', 0, 30, 1).name('Horizontal angle').onChange((value) => {
    variables.alpha = value
    liftH.theta.y = variables.alpha; // Update thetaH.y
    liftH.theta.z = variables.alpha; // Update thetaH.z
    liftH.updateForces();
}).listen();

gui.add(variables, 'beta', 0, 30, 1).name('Vertical angle').onChange((value) => {
    variables.beta = value;
    liftV.theta.y = variables.beta; // Update thetaV.y
    liftV.updateForces();
}).listen();

gui.add(variables, 'g', -10, 10, 0.5).name('Gravity').onChange((value) => {
    variables.g = value;
    weight.updateFw();
}).listen();

gui.add(variables, 'p', 0, 2000, 100).name('Water Density').onChange((value) => {
    variables.p = value;
}).listen();

gui.add(variables, 'Cl', 0, 1, 0.01).name('Lift Coefficent').onChange((value) => {
    variables.Cl = value;
}).listen();

gui.add(variables, 'Cd', 0, 1, 0.001).name('Drag Coefficent').onChange((value) => {
    variables.Cd = value;
}).listen();

/* 
function updateChart(time, velocity) {
    chart.data.datasets[0].data.push({ x: time, y: velocity });
    chart.update(); // Update the chart
}

console.log(data);

(async () => {
    chart = new Chart(document.getElementById('velocityChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Velocity (m/s)',
                data: [], // Initially empty dataset
            }]
        },
    });
})();
 */

export { simulate };