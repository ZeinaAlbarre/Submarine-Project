import * as THREE from 'three';
export default class Drag {
  Fd;
  constructor(variables, velocity) {
    this.variable = variables;
    this.velocity = this.updateVelocity(velocity);
    this.Fd = this.calcFd();
  }

  updateVelocity(velocity) {
    return new THREE.Vector3(velocity.x, velocity.y, velocity.z);
  }

  updateFd () {
    this.Fd = this.calcFd();
  }
  calcFd() {
    const velocity = this.velocity.length();
    if (velocity === 0) {
      return new THREE.Vector3(0, 0, 0); // No drag force if velocity is zero
    }
    const fd =
      0.5 * this.variable.Cd * this.variable.p * velocity * velocity * this.variable.A;
      console.log(`Fd: ${-1 * fd * (this.velocity.z / velocity)}`);
    return new THREE.Vector3(0, 0, (-1) * fd * (this.velocity.z / velocity));
  }
}
