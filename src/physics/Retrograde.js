import Buoyancy from "./Buoyancy.js";
import Drag from "./Drag.js";
import Engine from "./Engine.js";
import Weight from "./Weight.js";
import Lift from "./Lift.js";
import * as THREE from 'three';
export default class Retrograde {
  buoyancy;
  drag;
  engine;
  weight;
  liftH;
  liftV;
  prevCoordinates;
  prevVelocity;
  t;
  m;
  RetrogradeForce;
  constructor(
    variables,
    prevCoordinates,
    prevVelocity,
    t
  ) {
    this.variables = variables;
    this.buoyancy = new Buoyancy(variables);
    this.drag = new Drag(variables, variables.prevVelocity);
    this.engine = new Engine(variables);
    this.weight = new Weight(variables);
    this.liftH = new Lift(variables, prevVelocity, new THREE.Vector3(0, variables.alpha, variables.alpha));
    this.liftV = new Lift(variables, prevVelocity, new THREE.Vector3(0, variables.beta, 0));
    this.prevCoordinates = prevCoordinates;
    this.prevVelocity = prevVelocity;
    this.t = t;
    this.m = variables.m;
    this.RetrogradeForce = this.calcCoordinates();
  }
  
  totalForce() {
    //console.log(this.drag.calcFd());
    /* const liftHForce = liftH.forceVector.normalize();
    const liftVForce = liftV.forceVector.normalize();
    const dragForce = drag.Fd.normalize();
    const weightForce = weight.Fw.multiplyScalar(0.000001);
    const buoyancyForce = buoyancy.Fb.multiplyScalar(0.000001);
    const engineForce = engine.Fe.normalize();
     */

    console.log(this.buoyancy.Fb);
    console.log(this.drag.Fd);
    console.log(this.engine.Fe);
    console.log(this.weight.Fw);
    console.log(this.liftH.forceVector);
    console.log(this.liftV.forceVector);
    
    const totalForce = new THREE.Vector3();
    return totalForce
        .add(this.buoyancy.Fb)
        .add(this.drag.Fd)
        .add(this.engine.Fe)
        .add(this.weight.Fw)
        .add(this.liftH.forceVector)
        .add(this.liftV.forceVector);
}

calcAcceleration() {
    const acceleration = new THREE.Vector3();
    return acceleration.divideScalar(this.m).copy(this.totalForce());
}

calcVelocity() {
    const velocity = new THREE.Vector3();
    const acceleration = new THREE.Vector3();
    return velocity
        .addScaledVector(acceleration.copy(this.calcAcceleration()), this.t)
        .add(this.prevVelocity);
}

calcCoordinates() {
    const coordinate = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    return coordinate
        .addScaledVector(velocity.copy(this.calcVelocity()), this.t)
        .add(this.prevCoordinates);
}
}