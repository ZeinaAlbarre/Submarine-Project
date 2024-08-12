import Buoyancy from "./Buoyancy.js";
import Drag from "./Drag.js";
import Engine from "./Engine.js";
import Weight from "./Weight.js";
import Lift from "./Lift.js";
import vector from "./vector.js";
import Variables from "./Variables.js";
export default class Calculate_RotationalMotion{
  lift;
  anac;
  prevVelocity;
  t;
  Velocity_ang;
  prevVelocity_ang;
  pre_angle;
  constructor(
    variables,
    prevVelocity,
    theta,
    t,
    prevVelocity_ang,
    pre_angle
  ) 
  {
    this.variables = new variables;
    this.buoyancy = new Buoyancy(variables);
    this.lift = new Lift(variables, prevVelocity, theta);
    this.anac = this.caculate_Angulare_Acc();
    this.prevVelocity=prevVelocity;
    this.t= t;
    this.Velocity_ang = this.velocity_Angular_VelocityRadius();
    this.prevVelocity_ang = this.variables.Velocity_ang;
    this.pre_angle = this.variables.angle;
  }


  caculate_Angulare_Acc(){
    const anac_v1 = new vector(0, 0, 0);
    const anac_v2 = new vector(0, 0, 0);
      return anac_v2.divideBy(anac_v1.multiplyBy(this.variables.l,this.lift.forceVector) , this.variables.IDelta);
  }

 
//w = w(t-1) + (ac * t)
velocity_Angular_VelocityRadius() {
    const velocity_angular = new vector(0, 0, 0);
    const accelration = new vector(0, 0, 0);
    velocity_angular.addTo( accelration.multiplyBy(this.caculate_Angulare_Acc(), this.t), this.prevVelocity_ang  );
    this.variables.Velocity_ang = velocity_angular;
    return velocity_angular;
  }
 //0 = 0(t-1) + (wt *t)
 calculate_prespective_angle(){

  const angular1= new vector(0, 0, 0);
  const  angular2= new vector(0, 0, 0);
  angular1.addTo( angular2.multiplyBy(this.velocity_Angular_VelocityRadius(), this.t), this.pre_angle);
  this.variables.angle = angular1;
  return angular1;
  
 }



}