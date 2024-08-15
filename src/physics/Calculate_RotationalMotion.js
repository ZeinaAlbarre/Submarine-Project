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
  Velocity_ang;
  prevVelocity_ang;
  pre_angle;

  constructor(
    variables,
    prevVelocity,
    prevVelocity_ang,
    pre_angle,
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
    this.Velocity_ang = this.velocity_Angular_VelocityRadius();
    this.prevVelocity_ang = prevVelocity_ang;
    this.pre_angle = pre_angle;

  }
 

  calculate_add() {
    const v1 = new THREE.Vector3(0, 0, 0);
    v1.addVectors(this.liftH.forceVector, this.liftV.forceVector);
    return v1;
}

  
  // ac = l*fl / i delta
  caculate_Angulare_Acc() {
      console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
      console.log(this.anac);      
    const anac_v1 = new THREE.Vector3(0, 0, 0);
    const anac_v2 = new THREE.Vector3(0, 0, 0);
    return anac_v2.copy(anac_v1.copy(this.calculate_add().multiplyScalar(this.variables.l)).divideScalar(this.variables.IDelta));
}


 
//w = w(t-1) + (ac * t)
velocity_Angular_VelocityRadius() {
  console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
  console.log(this.Velocity_ang);
    const accelration = new THREE.Vector3(1, 1, 1);
  const velocity_angular = new THREE.Vector3(0, 0, 0);
  velocity_angular.add(this.caculate_Angulare_Acc().multiplyScalar(this.t)).add(new THREE.Vector3(this.prevVelocity_ang, this.prevVelocity_ang, this.prevVelocity_ang)); // Assuming uniform angular velocity in all directions
  this.variables.Velocity_ang = velocity_angular;
  return velocity_angular;
}

 //0 = 0(t-1) + (wt *t)
 calculate_prespective_angle() {
    console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
    console.log(this.variables.angle);
    const  angular2= new THREE.Vector3(0, 0, 0);
  const angular1 = new THREE.Vector3(0, 0, 0);
  angular1.add(this.velocity_Angular_VelocityRadius().multiplyScalar(this.t)).add(this.pre_angle); // Assuming pre_angle is a vector
  this.variables.angle = angular1;
  return angular1;
}

}