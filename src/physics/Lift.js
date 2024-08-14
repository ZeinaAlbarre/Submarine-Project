import Buoyancy from "./Buoyancy.js";
import Drag from "./Drag.js";
import * as THREE from 'three';

export default class Lift {
    constructor(variables, velocity, theta) {
        this.variables = variables;
        this.velocity = this.updateVelocity(velocity); 
        this.theta = this.updateTheta(theta); // Set the initial theta value
        this.updateForces(); // Initialize forces
    }

    updateTheta(theta) {
        return new THREE.Vector3(theta.x, theta.y, theta.z);
    }

    updateVelocity(velocity) {
        return new THREE.Vector3(velocity.x, velocity.y, velocity.z);
    }

    updateForces() {
        this.Fl = this.calcFl(); // Calculate lift force magnitude
        this.forceVector = this.calcForceVector(); // Update force vector based on the latest parameters
    }

    calcFl() {
        const { p, Aw, Cl } = this.variables;
        const velocity = this.velocity.length();
        return (1 / 2) * p * (velocity * velocity) * Aw * Cl;
    }

    calcFlx() {
        const Fl = this.Fl;
        const thetax = this.theta.x * (Math.PI / 180);
        const thetay = this.theta.y * (Math.PI / 180);
        const thetaz = this.theta.z * (Math.PI / 180);
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
        return new THREE.Vector3(this.calcFlx(), this.calcFly(), this.calcFlz());
    }
}
