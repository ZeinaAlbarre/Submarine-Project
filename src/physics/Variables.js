import * as THREE from 'three';
export default class Variables{
    constructor(Ve , m , wm, r, Pe, Aw , alpha , beta, l, prevVelocity, Velocity_ang ,angle){
        this.Ve = Ve;
        this.m = m;
        this.wm = wm;
        this.r = r;
        this.Pe = Pe;
        this.Aw = Aw ;
        this.alpha = alpha; //Horizontal
        this.beta = beta; //Vertical
        this.l = l;
        this.prevVelocity = prevVelocity;
        this.initialize();
        this.Velocity_ang = Velocity_ang;
        this.angle = angle; 
    };
    g = 9.8; //gravitation acceleration
    p = 1000; //water density
    Cd = 0.04; //Drag Coefficent
    Cl = 0.3; //Lift Coefficent
    A; //Area for drag force
    V; //volume
    IDelta; //momentum

    initialize(){
      this.A = this.calcArea();
      this.V = this.calcVolume();
      this.IDelta = this.calcIDelta();
    };

    calcArea(){
        return Math.PI * this.r * this.r;
    };

    calcVolume(){
        return this.calcArea() * this.l;
    };

    calcIDelta(){
        return this.r * this.r * this.m;
    }

};
