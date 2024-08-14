import * as THREE from 'three';

export default class Drag {
  constructor(variables, velocity) {
    this.variables = variables;
    this.velocity = this.updateVelocity(velocity);
    this.updateFd(); // Initialize drag force
  }

  updateVelocity(velocity) {
    return new THREE.Vector3(velocity.x, velocity.y, velocity.z);
  }

  updateFd() {
    this.Fd = this.calcFd();
  }

  calcFd() {
    console.log('heeeeere');
    console.log(this.velocity);
    const velocityLength = this.velocity.length();
    if (velocityLength === 0) {
      return new THREE.Vector3(0, 0, 0); // No drag force if velocity is zero
    }

    const fd = 0.5 * this.variables.Cd * this.variables.p * velocityLength * velocityLength * this.variables.A;
    console.log(`Fd: ${fd}`);
    return new THREE.Vector3(0, 0, (-1) * fd); // Applying drag force in the opposite direction of movement
  }
}
