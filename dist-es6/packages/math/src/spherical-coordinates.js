var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable camelcase */
import vec3_length from 'gl-vec3/length';
import vec3_add from 'gl-vec3/add';
import vec3_rotateX from 'gl-vec3/lerp';
import vec3_rotateY from 'gl-vec3/lerp';

var EARTH_RADIUS_METERS = 6.371e6;
var EPSILON = 0.000001;

export function radians(fromDegrees) {
  return fromDegrees / 180 * Math.PI;
}

export function degrees(fromRadians) {
  return fromRadians * 180 / Math.PI;
}

// constrain number between bounds
export function clamp(x, min, max) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
  // return Math.min(Math.max(value, min), max);
}

var SphericalCoordinates = function () {

  /**
   * Inspired by THREE.js Spherical class
   * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
   * The poles (phi) are at the positive and negative y axis.
   * The equator starts at positive z.
   * @class
   * @param {Number} phi=0 - rotation around X (latitude)
   * @param {Number} theta=0 - rotation around Y (longitude)
   * @param {Number} radius=1 - Distance from center
   */
  function SphericalCoordinates() {
    var phi = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var theta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;
    var radiusScale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EARTH_RADIUS_METERS;

    _classCallCheck(this, SphericalCoordinates);

    this.phi = phi; // up / down towards top and bottom pole
    this.theta = theta; // around the equator of the sphere
    this.radius = radius; // radial distance from center
    this.radiusScale = radiusScale; // Used by lngLatZ
    this.check();
    return this;
  }

  _createClass(SphericalCoordinates, [{
    key: 'set',
    value: function set(radius, phi, theta) {
      this.radius = radius;
      this.phi = phi;
      this.theta = theta;
      this.check();
      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new this.constructor().copy(this);
    }
  }, {
    key: 'copy',
    value: function copy(other) {
      this.radius = other.radius;
      this.phi = other.phi;
      this.theta = other.theta;
      this.check();
      return this;
    }
  }, {
    key: 'fromLngLatZ',
    value: function fromLngLatZ(_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          lng = _ref2[0],
          lat = _ref2[1],
          z = _ref2[2];

      this.radius = 1 + z / this.radiusScale;
      this.phi = radians(lat);
      this.theta = radians(lng);
    }
  }, {
    key: 'fromVector3',
    value: function fromVector3(v) {
      this.radius = vec3_length(v);
      if (this.radius === 0) {
        this.theta = 0;
        this.phi = 0;
      } else {
        this.theta = Math.atan2(v[0], v[1]); // equator angle around y-up axis
        this.phi = Math.acos(clamp(v[2] / this.radius, -1, 1)); // polar angle
      }
      return this;
    }

    // restrict phi to be betwee EPS and PI-EPS

  }, {
    key: 'makeSafe',
    value: function makeSafe() {
      this.phi = Math.max(EPSILON, Math.min(Math.PI - EPSILON, this.phi));
      return this;
    }

    /* eslint-disable brace-style */

    // Standard spherical coordinates

  }, {
    key: 'toVector3',


    // TODO - add parameter for orientation of sphere? up vector etc?
    value: function toVector3() {
      var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];

      var v = vec3_add([], center, [0, 0, this.distance]);
      vec3_rotateX(v, v, center, this.theta);
      vec3_rotateY(v, v, center, this.phi);
      return v;
    }
  }, {
    key: 'check',
    value: function check() {
      return true;
    }
  }, {
    key: 'phi',
    get: function get() {
      return this.phi;
    }
  }, {
    key: 'theta',
    get: function get() {
      return this.theta;
    }
  }, {
    key: 'radius',
    get: function get() {
      return this.radius;
    }
  }, {
    key: 'altitude',
    get: function get() {
      return this.radius - 1;
    } // relative altitude

    // lnglatZ coordinates

  }, {
    key: 'lng',
    get: function get() {
      return degrees(this.phi);
    }
  }, {
    key: 'lat',
    get: function get() {
      return degrees(this.theta);
    }
  }, {
    key: 'z',
    get: function get() {
      return (this.radius - 1) * this.radiusScale;
    }
  }]);

  return SphericalCoordinates;
}();

export default SphericalCoordinates;
//# sourceMappingURL=spherical-coordinates.js.map