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
 

  calculate_add()
  {
    const v1 = new vector(0, 0, 0);
    v1.add(this.liftH,this.liftV);
    return v1;
  }
  
  // ac = l*fl / i delta
  caculate_Angulare_Acc(){
    console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
    console.log(this.anac);
    
    const anac_v1 = new vector(0, 0, 0);
    const anac_v2 = new vector(0, 0, 0);
      return anac_v2.divideBy(anac_v1.multiplyBy(this.calculate_add(),this.variables.l) , this.variables.IDelta);
  }

 
//w = w(t-1) + (ac * t)
velocity_Angular_VelocityRadius() {
  console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
  console.log(this.Velocity_ang);
    const velocity_angular = new vector(0, 0, 0);
    const accelration = new vector(1, 1, 1);
   velocity_angular.add( accelration.multiplyBy(this.anac, this.t), this.prevVelocity_ang  );
    this.variables.Velocity_ang = velocity_angular;
    return velocity_angular;
  }
 //0 = 0(t-1) + (wt *t)
 calculate_prespective_angle(){
  console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer');
  console.log(this.variables.angle);
  const angular1= new vector(0, 0, 0);
  const  angular2= new vector(0, 0, 0);
  angular1.add( angular2.multiplyBy(this.velocity_Angular_VelocityRadius(), this.t), this.pre_angle);
  this.variables.angle = angular1;
  return angular1;
 }



}