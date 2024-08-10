import Variables from "./Variables.js";
import Weight from "./Weight.js";
import Drag from "./Drag.js";
import Buoyancy from "./Buoyancy.js";
import Engine from "./Engine.js";
import vector from "./vector.js";
import Retrograde from "./Retrograde.js";
import Lift from "./Lift.js";
const variable = new Variables(
2,
3,
4,
5,
6,
7,
8,
9,
1
);

let velocity = new vector(0, 0, 1);
let coordinate = new vector(0, 0, 0);
let theta = new vector(1, 1, 1);
let t = 1;

const retrograde = new Retrograde(variable, coordinate, velocity, theta , t);
console.log(retrograde.RetrogradeForce);

// const lift = new Lift(variable , velocity , 1 , 1 , 1 ,1);
// console.log(lift.calcForceVector());

// const buoyancy = new Buoyancy(variable);
// const weight = new Weight(variable);
// const engine = new Engine(variable);
// console.log(weight.Fw);
// console.log(buoyancy.B);
// console.log(engine.Fe);

// let velocity = vector.create(1,1,1); 
// const drag = new Drag(variable,velocity);
// console.log(drag.Fd);