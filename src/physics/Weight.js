import * as THREE from 'three';
export default class Weight{
    Fw;
    constructor(variables) {
        this.variable = variables;
        this.Fw = this.calcFw();
    }

    updateFw(){
        this.Fw = this.calcFw();
    }

    calcFw(){ console.log(`Fw: ${(-1)*(this.variable.g * this.variable.m)}`);
    
    
    console.log(this.variable);
    
        return new THREE.Vector3(
            0 ,
            (-1)*(this.variable.g * this.variable.m),
            0
        );
    }
};
