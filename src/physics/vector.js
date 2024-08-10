// Vector.js

export default class Vector {
  constructor(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  static create(x, y, z) {
    return new Vector(x, y, z);
  }

  // Getter and setter methods for x, y, and z components
  getX() {
    return this._x;
  }

  setX(value) {
    this._x = value;
  }

  getY() {
    return this._y;
  }

  setY(value) {
    this._y = value;
  }

  getZ() {
    return this._z;
  }

  setZ(value) {
    this._z = value;
  }

  // Other methods (add, multiply, normalize, etc.) can be added here
  setAngleXY(angle) {
    var length = this.getLength();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  setAngle(angleXY, angleXZ, angelZY) {
    var length = this.getLength();
    this._x = Math.cos(angleXZ) * length; // alpha
    this._y = Math.cos(angleXY) * length; // Beta
    this._z = Math.cos(angelZY) * length; // gamma
  }

  inits(length, angleXY, angleXZ) {
    this._x = Math.cos(angleXY) * Number(Math.cos(angleXZ).toFixed(7)) * length;
    this._y = Math.sin(angleXY) * length;
    this._z = Math.cos(angleXY) * Math.sin(angleXZ) * length;
  }
  cut(angleXY, angleXZ) {
    this._x += Math.cos(angleXY) * Number(Math.cos(angleXZ).toFixed(7));
    this._y += Math.sin(angleXY);
    this._z += Math.cos(angleXY) * Math.sin(angleXZ);
  }

  getAngleXY() {
    return Math.atan(this._y / this._x) || 0;
  }

  getAngleXZ() {
    return Math.atan2(this._x, this._z) || 0;
  }

  getAngleZY() {
    return Math.atan(this._y / this._z) || 0;
  }

  setLength(length) {
    var angleXY = Number(this.getAngleXY().toFixed(1));
    var angleXZ = Number(this.getAngleXZ().toFixed(1));
    let l1 = Number(Math.cos(angleXY).toFixed(1));
    let l2 = Number(Math.cos(angleXZ).toFixed(1));

    this._x = l1 * l2 * length;
    this._y = Number(Math.sin(angleXY).toFixed(2)) * length;
    this._z =
      Number(Math.cos(angleXY).toFixed(2)) *
      Number(Math.sin(angleXZ).toFixed(2)) *
      length;
  }

  getLength() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
  }

  sumToXZ(v) {
    this._x -= v;
    this._z -= v;
  }

  multiply(val) {
    return Vector.create(this._x * val, this._y * val, this._z * val);
  }

  divide(vec) {
    return Vector.create(
      this._x / vec.getX(),
      this._y / vec.getY(),
      this._z / vec.getZ()
    );
  }

  //EDITED
  add(...vectors) {
    const result = new Vector(0, 0, 0);
    for (const vector of vectors) {
      result._x += vector._x;
      result._y += vector._y;
      result._z += vector._z;
    }
    return result;
  }

  //EDITED
  addTo(vec, vec2) {
    vec._x += vec2._x;
    vec._y += vec2._y;
    vec._z += vec2._z;
    return vec;
  }

  //EDITED
  multiplyBy(vec, val) {
    vec._x *= val;
    vec._y *= val;
    vec._z *= val;
    return vec;
  }

  //EDITED
  divideBy(vec, val) {
    if (val !== 0) {
      vec._x /= val;
      vec._y /= val;
      vec._z /= val;
    } else {
      console.warn("Division by zero avoided.");
    }
    return vec;
  }

  //EDITED
  magnitude() {
    return Math.sqrt(this._x ** 2 + this._y ** 2 + this._z ** 2);
  }

  squere() {
    return this.getLength() * this.getLength();
  }

  normalize() {
    return Vector.create(
      this._x / this.getLength() || 0,
      this._y / this.getLength() || 0,
      this._z / this.getLength() || 0
    );
  }
  getAxesFrom(vec) {
    this._x = (vec._x / vec._x) | 0;
    this._y = (vec._y / vec._y) | 0;
    this._z = (vec._z / vec._z) | 0;
  }

  cross(vec) {
    return Vector.create(
      this._z * vec.getY() - this._y * vec.getZ(),
      this._z * vec.getX() - this._x * vec.getZ(),
      this._y * vec.getX() - this._x * vec.getY()
    );
  }

  clone() {
    return Vector.create(this._x, this._y, this._z);
  }
}
