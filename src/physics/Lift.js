import Buoyancy from "./Buoyancy.js";
import Drag from "./Drag.js";
import * as THREE from 'three';

export default class Lift {
    theta;
    velocity;
    forceVector;
    constructor(variables, velocity , theta) {
        this.variables = variables;
        this.drag = new Drag(variables , velocity);
        this.buoyancy = new Buoyancy(variables);
        
        this.velocity = this.updateVelocity(velocity); 
        // console.log(this.velocity);
        
        // Initial theta value
        this.theta = this.updateTheta(theta);
        
        this.updateForces();

        this.forceVector = this.calcForceVector();
    }

    updateTheta(theta) {
        return new THREE.Vector3(theta.x, theta.y, theta.z);
      }

    updateVelocity(velocity) {
        return new THREE.Vector3(velocity.x, velocity.y, velocity.z);
      }

    updateForces() {
        this.Fl = this.calcFl();
        this.Flx = this.calcFlx();
        this.Fly = this.calcFly();
        this.Flz = this.calcFlz();
    }
    calcFl() {
        const { p, Aw , Cl} = this.variables;
        const velocity = this.velocity.length();
        // console.log({ p, velocity, Aw, Cl });
        return (1 / 2) * p * (velocity * velocity) * Aw * Cl;
    }

    calcFlx() {
        
        
        // console.log(`thetax: ${this.thetax}, thetay: ${this.thetay}, thetaz: ${this.thetaz}`);

        const Fl = this.Fl;
        const thetax = this.theta.x * (Math.PI / 180);
        const thetay = this.theta.y * (Math.PI / 180);
        const thetaz = this.theta.z * (Math.PI / 180);
        
        // console.log(Fl);
        return ((-1) * Math.cos(thetay) * Math.sin(thetaz) + Math.sin(thetay) * Math.sin(thetax) * Math.sin(thetaz)) * Fl;
    }

    calcFly() {
        const Fl = this.Fl;
        const thetax = this.theta.x * (Math.PI / 180);
        const thetaz = this.theta.z * (Math.PI / 180);
        return Math.cos(thetaz) * Math.cos(thetax) * Fl;
    }

    calcFlz() {
        const Fl = this.Fl;
        const thetax = this.theta.x * (Math.PI / 180);
        const thetay = this.theta.y * (Math.PI / 180);
        const thetaz = this.theta.z * (Math.PI / 180);
        return (Math.sin(thetay) * Math.sin(thetaz) + Math.cos(thetay) * Math.sin(thetax) * Math.cos(thetaz)) * Fl;
    }

    calcForceVector() {
        
        this.Flx = this.calcFlx();
        this.Fly = this.calcFly();
        this.Flz = this.calcFlz();
        console.log(`Flx:  ${this.Flx},Fly:  ${this.Fly},Flz:  ${this.Flz}`);
        return new THREE.Vector3(this.Flx, this.Fly, this.Flz);
    }
}
