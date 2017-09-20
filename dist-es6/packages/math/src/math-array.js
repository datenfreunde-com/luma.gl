var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

import { formatValue, equals as _equals, config } from './common';

var MathArray = function (_extendableBuiltin2) {
  _inherits(MathArray, _extendableBuiltin2);

  function MathArray() {
    _classCallCheck(this, MathArray);

    return _possibleConstructorReturn(this, (MathArray.__proto__ || Object.getPrototypeOf(MathArray)).apply(this, arguments));
  }

  _createClass(MathArray, [{
    key: 'clone',
    value: function clone() {
      var Subclass = this.constructor;
      var clone = new Subclass().copy(this);
      clone.check();
      return clone;
    }
  }, {
    key: 'copy',
    value: function copy(array) {
      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = array[i];
      }
      this.check();
      return this;
    }
  }, {
    key: 'set',
    value: function set() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = args[i] || 0;
      }
      this.check();
      return this;
    }
  }, {
    key: 'fromArray',
    value: function fromArray(array) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        this[i] = array[i + offset];
      }
      this.check();
      return this;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var string = '';
      for (var i = 0; i < this.ELEMENTS; ++i) {
        string += (i > 0 ? ', ' : '') + formatValue(this[i]);
      }
      return this.constructor.name + '(' + string + ')';
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      for (var i = 0; i < this.ELEMENTS; ++i) {
        array[offset + i] = this[i];
      }
      return array;
    }
  }, {
    key: 'toFloat32Array',
    value: function toFloat32Array() {
      return new Float32Array(this);
    }
  }, {
    key: 'equals',
    value: function equals(array) {
      if (!array || this.length !== array.length) {
        return false;
      }
      for (var i = 0; i < this.ELEMENTS; ++i) {
        if (!_equals(this[i], array[i])) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'exactEquals',
    value: function exactEquals(array) {
      if (!array || this.length !== array.length) {
        return false;
      }
      for (var i = 0; i < this.ELEMENTS; ++i) {
        if (this[i] !== array[i]) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'validate',
    value: function validate() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

      var valid = array && array.length === this.ELEMENTS;
      for (var i = 0; i < this.ELEMENTS; ++i) {
        valid = valid && Number.isFinite(array[i]);
      }
      return valid;
    }
  }, {
    key: 'check',
    value: function check() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

      if (config.debug && !this.validate(array)) {
        throw new Error('Invalid ' + this.constructor.name);
      }
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      var length = this.len();
      if (length !== 0) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] /= length;
        }
      }
      this.check();
      return this;
    }
  }]);

  return MathArray;
}(_extendableBuiltin(Array));

export default MathArray;
//# sourceMappingURL=math-array.js.map