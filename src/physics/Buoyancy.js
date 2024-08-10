import * as THREE from 'three';
export default class Buoyancy {
  Fb;
  constructor(variables) {
    this.variable = variables;
    this.Fb = this.calcFb();
  }

  calcFb() { console.log(`Fb: ${this.variable.g * this.variable.p * this.variable.V}`);
    return new THREE.Vector3(
      0,
      this.variable.g * this.variable.p * this.variable.V,
      0
    );
  }
}
