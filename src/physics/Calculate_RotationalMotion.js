import Buoyancy from "./Buoyancy.js";
import Drag from "./Drag.js";
import * as THREE from 'three';
import Engine from "./Engine.js";
import Weight from "./Weight.js";
import Lift from "./Lift.js";
import vector from "./vector.js";
import Variables from "./Variables.js";
export default class Calculate_RotationalMotion{
  lift;
  liftH;
  liftV;
  anac;
  prevVelocity;
  t;
  preVelocity_ang;
  preangle;

  constructor(
    variables,
    prevVelocity,
    preVelocity_ang,
    preangle,
    t
  ) 
  {
    this.variables = variables;
    this.buoyancy = new Buoyancy(variables);
    this.liftH = new Lift(variables, prevVelocity, new THREE.Vector3(0, variables.alpha, variables.alpha));
    this.liftV = new Lift(variables, prevVelocity, new THREE.Vector3(0, variables.beta, 0));
    this.engine = new Engine(variables);
    this.weight = new Weight(variables);
    this.anac = this.caculate_Angulare_Acc();
    this.prevVelocity=prevVelocity;
    this.t= t;
    //this.preVelocity_ang= this.velocity_Angular_VelocityRadius();
    this.preVelocity_ang = preVelocity_ang;
    this.preangle = preangle;
   
  }
 

  
  calculate_add() {   
    const v1 = new THREE.Vector3();
    return v1
        .add(this.liftH.forceVector)
        .add(this.liftV.forceVector);

}

  
  // ac = l*fl / i delta
  caculate_Angulare_Acc() {
    console.log('Calculating Angular Acceleration:');
    
    const forceSum = this.calculate_add();
    console.log('Force Sum:', forceSum);

    // Ensure l and IDelta are not zero
    if (this.variables.l === 0 || this.variables.IDelta === 0) {
        console.error('Error: l or IDelta is zero, cannot calculate angular acceleration.');
        return new THREE.Vector3(0, 0, 0);
    }

    const angularAcc = new THREE.Vector3(0, 0, 0);
    angularAcc.copy(forceSum.multiplyScalar(this.variables.l).divideScalar(this.variables.IDelta));
    
    console.log('Calculated Angular Acceleration:', angularAcc);
    return angularAcc;
}


 
//w = w(t-1) + (ac * t)
velocity_Angular_VelocityRadius() {
  //console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
 // console.log(this.Velocity_ang);
    const velocity_angular = new THREE.Vector3(0, 0, 0);
    const accelration = new THREE.Vector3(1, 1, 1);
    velocity_angular.add( accelration.copy((this.caculate_Angulare_Acc()).multiplyScalar(this.t))).addScalar(this.preVelocity_ang);
    this.variables.preVelocity_ang = velocity_angular;
    return velocity_angular;
  }
 //0 = 0(t-1) + (wt *t)
 calculate_prespective_angle() {
    console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
    console.log(this.variables.angle);
    const  angular2= new THREE.Vector3(0, 0, 0);
  const angular1 = new THREE.Vector3(0, 0, 0);
  angular1.add(this.velocity_Angular_VelocityRadius().multiplyScalar(this.t)).add(this.preangle); // Assuming pre_angle is a vector
  this.variables.angle = angular1;
  return angular1;
 }

}