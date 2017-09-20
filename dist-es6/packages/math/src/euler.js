var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import MathArray from './math-array';
import { checkNumber, clamp } from './common';
import Matrix4 from './matrix4';
import Quaternion from './quaternion';
import Vector3 from './vector3';

// Internal constants
var ERR_UNKNOWN_ORDER = 'Unknown Euler angle order';
var ALMOST_ONE = 0.99999;

function validateOrder(value) {
  return value >= 0 && value < 6;
}

function checkOrder(value) {
  if (value < 0 && value >= 6) {
    throw new Error(ERR_UNKNOWN_ORDER);
  }
  return value;
}

var Euler = function (_MathArray) {
  _inherits(Euler, _MathArray);

  _createClass(Euler, [{
    key: 'ELEMENTS',
    get: function get() {
      return 4;
    }
    /* eslint-enable no-multi-spaces, brace-style, no-return-assign */

    /*
     * Number|Number[], Number, Number, Number
     */

  }], [{
    key: 'rotationOrder',
    value: function rotationOrder(order) {
      return Euler.RotationOrders[order];
    }
  }, {
    key: 'ZYX',


    // Constants
    /* eslint-disable no-multi-spaces, brace-style, no-return-assign */
    get: function get() {
      return 0;
    }
  }, {
    key: 'YXZ',
    get: function get() {
      return 1;
    }
  }, {
    key: 'XZY',
    get: function get() {
      return 2;
    }
  }, {
    key: 'ZXY',
    get: function get() {
      return 3;
    }
  }, {
    key: 'YZX',
    get: function get() {
      return 4;
    }
  }, {
    key: 'XYZ',
    get: function get() {
      return 5;
    }
  }, {
    key: 'RollPitchYaw',
    get: function get() {
      return 0;
    }
  }, {
    key: 'DefaultOrder',
    get: function get() {
      return Euler.ZYX;
    }
  }, {
    key: 'RotationOrders',
    get: function get() {
      return ['ZYX', 'YXZ', 'XZY', 'ZXY', 'YZX', 'XYZ'];
    }
  }]);

  function Euler() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Euler.DefaultOrder;

    _classCallCheck(this, Euler);

    var _this = _possibleConstructorReturn(this, (Euler.__proto__ || Object.getPrototypeOf(Euler)).call(this));

    if (arguments.length > 0 && Array.isArray(arguments[0])) {
      _this.fromVector3.apply(_this, arguments);
    } else {
      _this.set(x, y, z, order);
    }
    return _this;
  }

  // If copied array does contain fourth element, preserves currently set order


  _createClass(Euler, [{
    key: 'copy',
    value: function copy(array) {
      for (var i = 0; i < 3; ++i) {
        this[i] = array[i];
      }
      this[3] = Number.isFinite(array[3]) || this.order;
      this.check();
      return this;
    }

    // Sets the three angles, and optionally sets the rotation order
    // If order is not specified, preserves currently set order

  }, {
    key: 'set',
    value: function set() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var order = arguments[3];

      this[0] = x;
      this[1] = y;
      this[2] = z;
      this[3] = Number.isFinite(order) ? order : this[3];
      this.check();
      return this;
    }
  }, {
    key: 'validate',
    value: function validate() {
      return validateOrder(this[3]) && Number.isFinite(this[0]) && Number.isFinite(this[1]) && Number.isFinite(this[2]);
    }

    // Does not copy the orientation element

  }, {
    key: 'toArray',
    value: function toArray() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      array[offset] = this[0];
      array[offset + 1] = this[1];
      array[offset + 2] = this[2];
      return array;
    }

    // Copies the orientation element

  }, {
    key: 'toArray4',
    value: function toArray4() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      array[offset] = this[0];
      array[offset + 1] = this[1];
      array[offset + 2] = this[2];
      array[offset + 3] = this[3];
      return array;
    }
  }, {
    key: 'toVector3',
    value: function toVector3(optionalResult) {
      if (optionalResult) {
        return optionalResult.set(this[0], this[1], this[2]);
      }
      return new Vector3(this[0], this[1], this[2]);
    }

    /* eslint-disable no-multi-spaces, brace-style, no-return-assign */
    // x, y, z angle notation (note: only corresponds to axis in XYZ orientation)

  }, {
    key: 'fromVector3',

    /* eslint-disable no-multi-spaces, brace-style, no-return-assign */

    // Constructors
    value: function fromVector3(v, order) {
      return this.set(v[0], v[1], v[2], Number.isFinite(order) ? order : this[3]);
    }

    // TODO - with and without 4th element

  }, {
    key: 'fromArray',
    value: function fromArray(array) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      this[0] = array[0 + offset];
      this[1] = array[1 + offset];
      this[2] = array[2 + offset];
      if (array[3] !== undefined) {
        this[3] = array[3];
      }
      this.check();
      return this;
    }

    // Common ZYX rotation order

  }, {
    key: 'fromRollPitchYaw',
    value: function fromRollPitchYaw(roll, pitch, yaw) {
      return this.set(roll, pitch, yaw, Euler.ZYX);
    }
  }, {
    key: 'fromQuaternion',
    value: function fromQuaternion(q, order) {
      this._fromRotationMatrix(Matrix4.fromQuaternion(q), order);
      this.check();
      return this;
    }
  }, {
    key: 'fromRotationMatrix',
    value: function fromRotationMatrix(m) {
      var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Euler.DefaultOrder;

      this._fromRotationMatrix(m, order);
      this.check();
      return this;
    }

    // ACCESSORS

    // @return {Matrix4} a rotation matrix corresponding to rotations
    //   per the specified euler angles

  }, {
    key: 'getRotationMatrix',
    value: function getRotationMatrix() {
      var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Matrix4();

      this._getRotationMatrix(m);
      return m;
    }
  }, {
    key: 'getQuaternion',
    value: function getQuaternion() {
      var q = new Quaternion();
      switch (this[4]) {
        case Euler.XYZ:
          return q.rotateX(this[0]).rotateY(this[1]).rotateZ(this[2]);
        case Euler.YXZ:
          return q.rotateY(this[0]).rotateX(this[1]).rotateZ(this[2]);
        case Euler.ZXY:
          return q.rotateZ(this[0]).rotateX(this[1]).rotateY(this[2]);
        case Euler.ZYX:
          return q.rotateZ(this[0]).rotateY(this[1]).rotateX(this[2]);
        case Euler.YZX:
          return q.rotateY(this[0]).rotateZ(this[1]).rotateX(this[2]);
        case Euler.XZY:
          return q.rotateX(this[0]).rotateZ(this[1]).rotateY(this[2]);
        default:
          throw new Error(ERR_UNKNOWN_ORDER);
      }
    }

    // INTERNAL METHODS

    // Concersion from Euler to rotation matrix and from matrix to Euler
    // Adapted from three.js under MIT license

    // // WARNING: this discards revolution information -bhouston
    // reorder(newOrder) {
    //   const q = new Quaternion().setFromEuler(this);
    //   return this.setFromQuaternion(q, newOrder);

    /* eslint-disable complexity, max-statements, one-var */

  }, {
    key: '_fromRotationMatrix',
    value: function _fromRotationMatrix(m) {
      var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Euler.DefaultOrder;

      // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

      var te = m.elements;
      var m11 = te[0],
          m12 = te[4],
          m13 = te[8];
      var m21 = te[1],
          m22 = te[5],
          m23 = te[9];
      var m31 = te[2],
          m32 = te[6],
          m33 = te[10];

      order = order || this[3];

      switch (order) {
        case Euler.XYZ:
          this[1] = Math.asin(clamp(m13, -1, 1));

          if (Math.abs(m13) < ALMOST_ONE) {
            this[0] = Math.atan2(-m23, m33);
            this[2] = Math.atan2(-m12, m11);
          } else {
            this[0] = Math.atan2(m32, m22);
            this[2] = 0;
          }
          break;

        case Euler.YXZ:
          this[0] = Math.asin(-clamp(m23, -1, 1));

          if (Math.abs(m23) < ALMOST_ONE) {
            this[1] = Math.atan2(m13, m33);
            this[2] = Math.atan2(m21, m22);
          } else {
            this[1] = Math.atan2(-m31, m11);
            this[2] = 0;
          }
          break;

        case Euler.ZXY:
          this[0] = Math.asin(clamp(m32, -1, 1));

          if (Math.abs(m32) < ALMOST_ONE) {
            this[1] = Math.atan2(-m31, m33);
            this[2] = Math.atan2(-m12, m22);
          } else {
            this[1] = 0;
            this[2] = Math.atan2(m21, m11);
          }
          break;

        case Euler.ZYX:
          this[1] = Math.asin(-clamp(m31, -1, 1));

          if (Math.abs(m31) < ALMOST_ONE) {
            this[0] = Math.atan2(m32, m33);
            this[2] = Math.atan2(m21, m11);
          } else {
            this[0] = 0;
            this[2] = Math.atan2(-m12, m22);
          }
          break;

        case Euler.YZX:
          this[2] = Math.asin(clamp(m21, -1, 1));

          if (Math.abs(m21) < ALMOST_ONE) {
            this[0] = Math.atan2(-m23, m22);
            this[1] = Math.atan2(-m31, m11);
          } else {
            this[0] = 0;
            this[1] = Math.atan2(m13, m33);
          }
          break;

        case Euler.XZY:
          this[2] = Math.asin(-clamp(m12, -1, 1));

          if (Math.abs(m12) < ALMOST_ONE) {
            this[0] = Math.atan2(m32, m22);
            this[1] = Math.atan2(m13, m11);
          } else {
            this[0] = Math.atan2(-m23, m33);
            this[1] = 0;
          }
          break;

        default:
          throw new Error(ERR_UNKNOWN_ORDER);
      }

      this[3] = order;

      return this;
    }
  }, {
    key: '_getRotationMatrix',
    value: function _getRotationMatrix() {
      var te = new Matrix4();

      var x = this.x,
          y = this.y,
          z = this.z;
      var a = Math.cos(x);
      var c = Math.cos(y);
      var e = Math.cos(z);
      var b = Math.sin(x);
      var d = Math.sin(y);
      var f = Math.sin(z);

      switch (this[3]) {
        case Euler.XYZ:
          {
            var ae = a * e,
                af = a * f,
                be = b * e,
                bf = b * f;

            te[0] = c * e;
            te[4] = -c * f;
            te[8] = d;

            te[1] = af + be * d;
            te[5] = ae - bf * d;
            te[9] = -b * c;

            te[2] = bf - ae * d;
            te[6] = be + af * d;
            te[10] = a * c;
            break;
          }

        case Euler.YXZ:
          {
            var ce = c * e,
                cf = c * f,
                de = d * e,
                df = d * f;

            te[0] = ce + df * b;
            te[4] = de * b - cf;
            te[8] = a * d;

            te[1] = a * f;
            te[5] = a * e;
            te[9] = -b;

            te[2] = cf * b - de;
            te[6] = df + ce * b;
            te[10] = a * c;
            break;
          }

        case Euler.ZXY:
          {
            var _ce = c * e,
                _cf = c * f,
                _de = d * e,
                _df = d * f;

            te[0] = _ce - _df * b;
            te[4] = -a * f;
            te[8] = _de + _cf * b;

            te[1] = _cf + _de * b;
            te[5] = a * e;
            te[9] = _df - _ce * b;

            te[2] = -a * d;
            te[6] = b;
            te[10] = a * c;
            break;
          }

        case Euler.ZYX:
          {
            var _ae = a * e,
                _af = a * f,
                _be = b * e,
                _bf = b * f;

            te[0] = c * e;
            te[4] = _be * d - _af;
            te[8] = _ae * d + _bf;

            te[1] = c * f;
            te[5] = _bf * d + _ae;
            te[9] = _af * d - _be;

            te[2] = -d;
            te[6] = b * c;
            te[10] = a * c;
            break;
          }

        case Euler.YZX:
          {
            var ac = a * c,
                ad = a * d,
                bc = b * c,
                bd = b * d;

            te[0] = c * e;
            te[4] = bd - ac * f;
            te[8] = bc * f + ad;

            te[1] = f;
            te[5] = a * e;
            te[9] = -b * e;

            te[2] = -d * e;
            te[6] = ad * f + bc;
            te[10] = ac - bd * f;
            break;
          }

        case Euler.XZY:
          {
            var _ac = a * c,
                _ad = a * d,
                _bc = b * c,
                _bd = b * d;

            te[0] = c * e;
            te[4] = -f;
            te[8] = d * e;

            te[1] = _ac * f + _bd;
            te[5] = a * e;
            te[9] = _ad * f - _bc;

            te[2] = _bc * f - _ad;
            te[6] = b * e;
            te[10] = _bd * f + _ac;
            break;
          }

        default:
          throw new Error(ERR_UNKNOWN_ORDER);
      }

      // last column
      te[3] = 0;
      te[7] = 0;
      te[11] = 0;

      // bottom row
      te[12] = 0;
      te[13] = 0;
      te[14] = 0;
      te[15] = 1;

      return this;
    }
    /* eslint-enable complexity, max-statements, one-var */

  }, {
    key: 'x',
    get: function get() {
      return this[0];
    },
    set: function set(value) {
      return this[0] = checkNumber(value);
    }
  }, {
    key: 'y',
    get: function get() {
      return this[1];
    },
    set: function set(value) {
      return this[1] = checkNumber(value);
    }
  }, {
    key: 'z',
    get: function get() {
      return this[2];
    },
    set: function set(value) {
      return this[2] = checkNumber(value);
    }

    // alpha, beta, gamma angle notation

  }, {
    key: 'alpha',
    get: function get() {
      return this[0];
    },
    set: function set(value) {
      return this[0] = checkNumber(value);
    }
  }, {
    key: 'beta',
    get: function get() {
      return this[1];
    },
    set: function set(value) {
      return this[1] = checkNumber(value);
    }
  }, {
    key: 'gamma',
    get: function get() {
      return this[2];
    },
    set: function set(value) {
      return this[2] = checkNumber(value);
    }

    // phi, theta, psi angle notation

  }, {
    key: 'phi',
    get: function get() {
      return this[0];
    },
    set: function set(value) {
      return this[0] = checkNumber(value);
    }
  }, {
    key: 'theta',
    get: function get() {
      return this[1];
    },
    set: function set(value) {
      return this[1] = checkNumber(value);
    }
  }, {
    key: 'psi',
    get: function get() {
      return this[2];
    },
    set: function set(value) {
      return this[2] = checkNumber(value);
    }

    // rotation order, in all three angle notations

  }, {
    key: 'order',
    get: function get() {
      return this[3];
    },
    set: function set(value) {
      return this[3] = checkOrder(value);
    }
  }]);

  return Euler;
}(MathArray);

export default Euler;
//# sourceMappingURL=euler.js.map