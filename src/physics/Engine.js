import * as THREE from 'three';
export default class Engine {
  Fe;
  constructor(variables) {
    this.variable = variables;
    this.Fe = this.calcFe();
  }

  updateFe() {
    this.Fe = this.calcFe();
  }
  calcFe() { console.log(`Fe: ${this.variable.Pe * this.variable.Ve}`);
    return new THREE.Vector3(
      0 ,
      0 ,
      this.variable.Pe * this.variable.Ve ,
    );
  }
}
