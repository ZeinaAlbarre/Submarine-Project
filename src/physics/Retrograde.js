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
  lift;
  prevCoordinates;
  prevVelocity;
  t;
  m;
  RetrogradeForce;
  constructor(
    variables,
    prevCoordinates,
    prevVelocity,
    theta,
    t
  ) {
    this.variables = variables;
    this.buoyancy = new Buoyancy(variables);
    this.drag = new Drag(variables, prevVelocity);
    this.engine = new Engine(variables);
    this.weight = new Weight(variables);
    this.lift = new Lift(variables, prevVelocity, theta);
    this.prevCoordinates = prevCoordinates;
    this.prevVelocity = prevVelocity;
    this.t = t;
    this.m = variables.m;
    this.RetrogradeForce = this.calcCoordinates();
  }
  totalForce() {
    const totalForce = new THREE.Vector3();
    return totalForce
        .add(this.buoyancy.Fb)
        .add(this.drag.Fd)
        .add(this.engine.Fe)
        .add(this.weight.Fw)
        .add(this.lift.forceVector);
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