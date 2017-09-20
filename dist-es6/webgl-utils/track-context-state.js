var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Support for listening to context state changes and intercepting state queries
//
// NOTE: this system does not handle buffer bindings
import GL from './constants';
import { setParameters, getParameters, GL_PARAMETER_DEFAULTS } from './set-parameters';
import polyfillContext from './polyfill-context';
import assert from 'assert';

export var clone = function clone(x) {
  return Array.isArray(x) || ArrayBuffer.isView(x) ? x.slice() : x;
};

export var deepEqual = function deepEqual(x, y) {
  var isArrayX = Array.isArray(x) || ArrayBuffer.isView(x);
  var isArrayY = Array.isArray(y) || ArrayBuffer.isView(y);
  if (isArrayX && isArrayY && x.length === y.length) {
    for (var i = 0; i < x.length; ++i) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
    return true;
  }
  return x === y;
};

// interceptors for WEBGL FUNCTIONS that set WebGLRenderingContext state

var GL_STATE_SETTERS = {

  // GENERIC SETTERS

  enable: function enable(setter, cap) {
    return setter(_defineProperty({}, cap, true));
  },
  disable: function disable(setter, cap) {
    return setter(_defineProperty({}, cap, false));
  },
  pixelStorei: function pixelStorei(setter, pname, param) {
    return setter(_defineProperty({}, pname, param));
  },
  hint: function hint(setter, pname, _hint) {
    return setter(_defineProperty({}, pname, _hint));
  },

  // SPECIFIC SETTERS

  clearStencil: function clearStencil(setter, s) {
    return setter(_defineProperty({}, GL.STENCIL_CLEAR_VALUE, s));
  },

  blendColor: function blendColor(setter, r, g, b, a) {
    return setter(_defineProperty({}, GL.BLEND_COLOR, new Float32Array([r, g, b, a])));
  },

  blendEquation: function blendEquation(setter, mode) {
    var _setter7;

    return setter((_setter7 = {}, _defineProperty(_setter7, GL.BLEND_EQUATION_RGB, mode), _defineProperty(_setter7, GL.BLEND_EQUATION_ALPHA, mode), _setter7));
  },

  blendEquationSeparate: function blendEquationSeparate(setter, modeRGB, modeAlpha) {
    var _setter8;

    return setter((_setter8 = {}, _defineProperty(_setter8, GL.BLEND_EQUATION_RGB, modeRGB), _defineProperty(_setter8, GL.BLEND_EQUATION_ALPHA, modeAlpha), _setter8));
  },

  blendFunc: function blendFunc(setter, src, dst) {
    var _setter9;

    return setter((_setter9 = {}, _defineProperty(_setter9, GL.BLEND_SRC_RGB, src), _defineProperty(_setter9, GL.BLEND_DST_RGB, dst), _defineProperty(_setter9, GL.BLEND_SRC_ALPHA, src), _defineProperty(_setter9, GL.BLEND_DST_ALPHA, dst), _setter9));
  },

  blendFuncSeparate: function blendFuncSeparate(setter, srcRGB, dstRGB, srcAlpha, dstAlpha) {
    var _setter10;

    return setter((_setter10 = {}, _defineProperty(_setter10, GL.BLEND_SRC_RGB, srcRGB), _defineProperty(_setter10, GL.BLEND_DST_RGB, dstRGB), _defineProperty(_setter10, GL.BLEND_SRC_ALPHA, srcAlpha), _defineProperty(_setter10, GL.BLEND_DST_ALPHA, dstAlpha), _setter10));
  },

  clearColor: function clearColor(setter, r, g, b, a) {
    return setter(_defineProperty({}, GL.COLOR_CLEAR_VALUE, new Float32Array([r, g, b, a])));
  },

  clearDepth: function clearDepth(setter, depth) {
    return setter(_defineProperty({}, GL.DEPTH_CLEAR_VALUE, depth));
  },

  colorMask: function colorMask(setter, r, g, b, a) {
    return setter(_defineProperty({}, GL.COLOR_WRITEMASK, [r, g, b, a]));
  },

  cullFace: function cullFace(setter, mode) {
    return setter(_defineProperty({}, GL.CULL_FACE_MODE, mode));
  },

  depthFunc: function depthFunc(setter, func) {
    return setter(_defineProperty({}, GL.DEPTH_FUNC, func));
  },

  depthRange: function depthRange(setter, zNear, zFar) {
    return setter(_defineProperty({}, GL.DEPTH_RANGE, new Float32Array([zNear, zFar])));
  },

  depthMask: function depthMask(setter, mask) {
    return setter(_defineProperty({}, GL.DEPTH_WRITEMASK, mask));
  },

  frontFace: function frontFace(setter, face) {
    return setter(_defineProperty({}, GL.FRONT_FACE, face));
  },

  lineWidth: function lineWidth(setter, width) {
    return setter(_defineProperty({}, GL.LINE_WIDTH, width));
  },

  polygonOffset: function polygonOffset(setter, factor, units) {
    var _setter20;

    return setter((_setter20 = {}, _defineProperty(_setter20, GL.POLYGON_OFFSET_FACTOR, factor), _defineProperty(_setter20, GL.POLYGON_OFFSET_UNITS, units), _setter20));
  },

  sampleCoverage: function sampleCoverage(setter, value, invert) {
    var _setter21;

    return setter((_setter21 = {}, _defineProperty(_setter21, GL.SAMPLE_COVERAGE_VALUE, value), _defineProperty(_setter21, GL.SAMPLE_COVERAGE_INVERT, invert), _setter21));
  },

  scissor: function scissor(setter, x, y, width, height) {
    return setter(_defineProperty({}, GL.SCISSOR_BOX, new Int32Array([x, y, width, height])));
  },

  stencilMask: function stencilMask(setter, mask) {
    var _setter23;

    return setter((_setter23 = {}, _defineProperty(_setter23, GL.STENCIL_WRITEMASK, mask), _defineProperty(_setter23, GL.STENCIL_BACK_WRITEMASK, mask), _setter23));
  },

  stencilMaskSeparate: function stencilMaskSeparate(setter, face, mask) {
    return setter(_defineProperty({}, face === GL.FRONT ? GL.STENCIL_WRITEMASK : GL.STENCIL_BACK_WRITEMASK, mask));
  },

  stencilFunc: function stencilFunc(setter, func, ref, mask) {
    var _setter25;

    return setter((_setter25 = {}, _defineProperty(_setter25, GL.STENCIL_FUNC, func), _defineProperty(_setter25, GL.STENCIL_REF, ref), _defineProperty(_setter25, GL.STENCIL_VALUE_MASK, mask), _defineProperty(_setter25, GL.STENCIL_BACK_FUNC, func), _defineProperty(_setter25, GL.STENCIL_BACK_REF, ref), _defineProperty(_setter25, GL.STENCIL_BACK_VALUE_MASK, mask), _setter25));
  },

  stencilFuncSeparate: function stencilFuncSeparate(setter, face, func, ref, mask) {
    var _setter26;

    return setter((_setter26 = {}, _defineProperty(_setter26, face === GL.FRONT ? GL.STENCIL_FUNC : GL.STENCIL_BACK_FUNC, func), _defineProperty(_setter26, face === GL.FRONT ? GL.STENCIL_REF : GL.STENCIL_BACK_REF, ref), _defineProperty(_setter26, face === GL.FRONT ? GL.STENCIL_VALUE_MASK : GL.STENCIL_BACK_VALUE_MASK, mask), _setter26));
  },

  stencilOp: function stencilOp(setter, fail, zfail, zpass) {
    var _setter27;

    return setter((_setter27 = {}, _defineProperty(_setter27, GL.STENCIL_FAIL, fail), _defineProperty(_setter27, GL.STENCIL_PASS_DEPTH_FAIL, zfail), _defineProperty(_setter27, GL.STENCIL_PASS_DEPTH_PASS, zpass), _defineProperty(_setter27, GL.STENCIL_BACK_FAIL, fail), _defineProperty(_setter27, GL.STENCIL_BACK_PASS_DEPTH_FAIL, zfail), _defineProperty(_setter27, GL.STENCIL_BACK_PASS_DEPTH_PASS, zpass), _setter27));
  },

  stencilOpSeparate: function stencilOpSeparate(setter, face, fail, zfail, zpass) {
    var _setter28;

    return setter((_setter28 = {}, _defineProperty(_setter28, face === GL.FRONT ? GL.STENCIL_FAIL : GL.STENCIL_BACK_FAIL, fail), _defineProperty(_setter28, face === GL.FRONT ? GL.STENCIL_PASS_DEPTH_FAIL : GL.STENCIL_BACK_PASS_DEPTH_FAIL, zfail), _defineProperty(_setter28, face === GL.FRONT ? GL.STENCIL_PASS_DEPTH_PASS : GL.STENCIL_BACK_PASS_DEPTH_PASS, zpass), _setter28));
  },

  viewport: function viewport(setter, x, y, width, height) {
    return setter(_defineProperty({}, GL.VIEWPORT, new Int32Array([x, y, width, height])));
  }
};

// HELPER FUNCTIONS - INSTALL GET/SET INTERCEPTORS (SPYS) ON THE CONTEXT

// Overrides a WebGLRenderingContext state "getter" function
// to return values directly from cache
export { GL_STATE_SETTERS };
function installGetterOverride(gl, functionName) {
  // Get the original function from the WebGLRenderingContext
  var originalGetterFunc = gl[functionName].bind(gl);

  // Wrap it with a spy so that we can update our state cache when it gets called
  gl[functionName] = function () {
    var pname = arguments.length <= 0 ? undefined : arguments[0];

    // WebGL limits are not prepopulated in the cache, we must
    // query first time. They are all primitive (single value)
    if (!(pname in gl.state.cache)) {
      gl.state.cache[pname] = originalGetterFunc.apply(undefined, arguments);
    }

    // Optionally call the original function to do a "hard" query from the WebGLRenderingContext
    return gl.state.enable ?
    // Call the getter the params so that it can e.g. serve from a cache
    gl.state.cache[pname] :
    // Optionally call the original function to do a "hard" query from the WebGLRenderingContext
    originalGetterFunc.apply(undefined, arguments);
  };

  // Set the name of this anonymous function to help in debugging and profiling
  Object.defineProperty(gl[functionName], 'name', { value: functionName + '-from-cache', configurable: false });
}

// Overrides a WebGLRenderingContext state "setter" function
// to call a setter spy before the actual setter. Allows us to keep a cache
// updated with a copy of the WebGL context state.
function installSetterSpy(gl, functionName, setter, updateCache) {
  // Get the original function from the WebGLRenderingContext
  var originalSetterFunc = gl[functionName].bind(gl);

  // Wrap it with a spy so that we can update our state cache when it gets called
  gl[functionName] = function () {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    // Update the value
    // Call the setter with the state cache and the params so that it can store the parameters
    var valueChanged = setter.apply(undefined, [updateCache].concat(params));

    // Call the original WebGLRenderingContext func to make sure the context actually gets updated
    if (valueChanged) {
      var _gl$state;

      (_gl$state = gl.state).log.apply(_gl$state, ['gl.' + functionName].concat(params)); // eslint-disable-line
      originalSetterFunc.apply(undefined, params);
    }
    // Note: if the original function fails to set the value, our state cache will be bad
    // No solution for this at the moment, but assuming that this is unlikely to be a real problem
    // We could call the setter after the originalSetterFunc. Concern is that this would
    // cause different behavior in debug mode, where originalSetterFunc can throw exceptions
  };

  // Set the name of this anonymous function to help in debugging and profiling
  Object.defineProperty(gl[functionName], 'name', { value: functionName + '-to-cache', configurable: false });
}

// HELPER CLASS - GLState

/* eslint-disable no-shadow */

var GLState = /*#__PURE__*/function () {
  function GLState(gl) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$copyState = _ref.copyState,
        copyState = _ref$copyState === undefined ? false : _ref$copyState,
        _ref$log = _ref.log,
        log = _ref$log === undefined ? function () {} : _ref$log;

    _classCallCheck(this, GLState);

    this.gl = gl;
    this.stateStack = [];
    this.enable = true;
    this.cache = copyState ? getParameters(gl) : Object.assign({}, GL_PARAMETER_DEFAULTS);
    this.log = log;

    this._updateCache = this._updateCache.bind(this);
    Object.seal(this);
  }

  _createClass(GLState, [{
    key: 'push',
    value: function push() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.stateStack.push({});
    }
  }, {
    key: 'pop',
    value: function pop() {
      assert(this.stateStack.length > 0);
      // Use the saved values in the state stack to restore parameters
      var oldValues = this.stateStack[this.stateStack.length - 1];
      setParameters(this.gl, oldValues, this.cache);
      // Don't pop until we have reset parameters (to make sure other "stack frames" are not affected)
      this.stateStack.pop();
    }

    // interceptor for context set functions - update our cache and our stack
    // values (Object) - the key values for this setter

  }, {
    key: '_updateCache',
    value: function _updateCache(values) {
      var valueChanged = false;

      var oldValues = this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1];

      for (var key in values) {
        assert(key !== undefined);
        // Check that value hasn't already been shadowed
        if (!deepEqual(values[key], this.cache[key])) {
          valueChanged = true;

          // First, save current value being shadowed
          // If a state stack frame is active, save the current parameter values for pop
          // but first check that value hasn't already been shadowed and saved
          if (oldValues && !(key in oldValues)) {
            oldValues[key] = this.cache[key];
          }

          // Save current value being shadowed
          this.cache[key] = values[key];
        }
      }

      return valueChanged;
    }
  }]);

  return GLState;
}();

// PUBLIC API

/**
 * Initialize WebGL state caching on a context
 * can be called multiple times to enable/disable
 * @param {WebGLRenderingContext} - context
 */
// After calling this function, context state will be cached
// gl.state.push() and gl.state.pop() will be available for saving,
// temporarily modifying, and then restoring state.


export default function trackContextState(gl) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$enable = _ref2.enable,
      enable = _ref2$enable === undefined ? true : _ref2$enable,
      copyState = _ref2.copyState;

  assert(copyState !== undefined);
  if (!gl.state) {
    polyfillContext(gl);

    // Create a state cache
    gl.state = new GLState(gl, { copyState: copyState, enable: enable });

    // intercept all setter functions in the table
    for (var key in GL_STATE_SETTERS) {
      var setter = GL_STATE_SETTERS[key];
      installSetterSpy(gl, key, setter, gl.state._updateCache);
    }

    // intercept all getter functions in the table
    installGetterOverride(gl, 'getParameter');
    installGetterOverride(gl, 'isEnabled');
  }

  gl.state.enable = enable;

  return gl;
}

export function pushContextState(gl) {
  assert(gl.state);
  gl.state.push();
}

export function popContextState(gl) {
  assert(gl.state);
  gl.state.pop();
}
//# sourceMappingURL=track-context-state.js.map