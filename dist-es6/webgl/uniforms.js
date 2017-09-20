var _UNIFORM_SETTERS;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import Texture from './texture';
import { formatValue } from '../utils';
import assert from 'assert';

// Local constants, will be "collapsed" during minification

// WebGL1

var GL_FLOAT = 0x1406;
var GL_FLOAT_VEC2 = 0x8B50;
var GL_FLOAT_VEC3 = 0x8B51;
var GL_FLOAT_VEC4 = 0x8B52;

var GL_INT = 0x1404;
var GL_INT_VEC2 = 0x8B53;
var GL_INT_VEC3 = 0x8B54;
var GL_INT_VEC4 = 0x8B55;

var GL_BOOL = 0x8B56;
var GL_BOOL_VEC2 = 0x8B57;
var GL_BOOL_VEC3 = 0x8B58;
var GL_BOOL_VEC4 = 0x8B59;

var GL_FLOAT_MAT2 = 0x8B5A;
var GL_FLOAT_MAT3 = 0x8B5B;
var GL_FLOAT_MAT4 = 0x8B5C;

var GL_SAMPLER_2D = 0x8B5E;
var GL_SAMPLER_CUBE = 0x8B60;

// WebGL2

var GL_UNSIGNED_INT = 0x1405;
var GL_UNSIGNED_INT_VEC2 = 0x8DC6;
var GL_UNSIGNED_INT_VEC3 = 0x8DC7;
var GL_UNSIGNED_INT_VEC4 = 0x8DC8;

/* eslint-disable camelcase */
var GL_FLOAT_MAT2x3 = 0x8B65;
var GL_FLOAT_MAT2x4 = 0x8B66;
var GL_FLOAT_MAT3x2 = 0x8B67;
var GL_FLOAT_MAT3x4 = 0x8B68;
var GL_FLOAT_MAT4x2 = 0x8B69;
var GL_FLOAT_MAT4x3 = 0x8B6A;

var GL_SAMPLER_3D = 0x8B5F;
var GL_SAMPLER_2D_SHADOW = 0x8B62;
var GL_SAMPLER_2D_ARRAY = 0x8DC1;
var GL_SAMPLER_2D_ARRAY_SHADOW = 0x8DC4;
var GL_SAMPLER_CUBE_SHADOW = 0x8DC5;
var GL_INT_SAMPLER_2D = 0x8DCA;
var GL_INT_SAMPLER_3D = 0x8DCB;
var GL_INT_SAMPLER_CUBE = 0x8DCC;
var GL_INT_SAMPLER_2D_ARRAY = 0x8DCF;
var GL_UNSIGNED_INT_SAMPLER_2D = 0x8DD2;
var GL_UNSIGNED_INT_SAMPLER_3D = 0x8DD3;
var GL_UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4;
var GL_UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;

/* TODO - create static Float32...Arrays and copy into those instead of minting new ones?
const arrays = {};
function getTypedArray(type, data) {
  if (flatArrayLength > 1) {
    setter = val => {
      if (!(val instanceof TypedArray)) {
        const typedArray = new TypedArray(flatArrayLength);
        typedArray.set(val);
        val = typedArray;
      }
      assert(val.length === flatArrayLength);
    };
  }
}
// TODO - handle array uniforms
*/

var UNIFORM_SETTERS = (_UNIFORM_SETTERS = {}, _defineProperty(_UNIFORM_SETTERS, GL_FLOAT, function (gl, location, value) {
  return gl.uniform1f(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_VEC2, function (gl, location, value) {
  return gl.uniform2fv(location, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_VEC3, function (gl, location, value) {
  return gl.uniform3fv(location, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_VEC4, function (gl, location, value) {
  return gl.uniform4fv(location, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_INT, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_INT_VEC2, function (gl, location, value) {
  return gl.uniform2iv(location, new Int32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_INT_VEC3, function (gl, location, value) {
  return gl.uniform3iv(location, new Int32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_INT_VEC4, function (gl, location, value) {
  return gl.uniform4iv(location, new Int32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_BOOL, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_BOOL_VEC2, function (gl, location, value) {
  return gl.uniform2iv(location, new Int32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_BOOL_VEC3, function (gl, location, value) {
  return gl.uniform3fv(location, new Int32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_BOOL_VEC4, function (gl, location, value) {
  return gl.uniform4iv(location, new Int32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT2, function (gl, location, value) {
  return gl.uniformMatrix2fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT3, function (gl, location, value) {
  return gl.uniformMatrix3fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT4, function (gl, location, value) {
  return gl.uniformMatrix4fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_SAMPLER_2D, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_SAMPLER_CUBE, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT, function (gl, location, value) {
  return gl.uniform1ui(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT_VEC2, function (gl, location, value) {
  return gl.uniform2uiv(location, new Uint32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT_VEC3, function (gl, location, value) {
  return gl.uniform3uiv(location, new Uint32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT_VEC4, function (gl, location, value) {
  return gl.uniform4uiv(location, new Uint32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT2x3, function (gl, location, value) {
  return gl.uniformMatrix2x3fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT2x4, function (gl, location, value) {
  return gl.uniformMatrix2x4fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT3x2, function (gl, location, value) {
  return gl.uniformMatrix3x2fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT3x4, function (gl, location, value) {
  return gl.uniformMatrix3x4fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT4x2, function (gl, location, value) {
  return gl.uniformMatrix4x2fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_FLOAT_MAT4x3, function (gl, location, value) {
  return gl.uniformMatrix4x3fv(location, false, new Float32Array(value));
}), _defineProperty(_UNIFORM_SETTERS, GL_SAMPLER_3D, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_SAMPLER_2D_SHADOW, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_SAMPLER_2D_ARRAY, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_SAMPLER_2D_ARRAY_SHADOW, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_SAMPLER_CUBE_SHADOW, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_INT_SAMPLER_2D, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_INT_SAMPLER_3D, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_INT_SAMPLER_CUBE, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_INT_SAMPLER_2D_ARRAY, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT_SAMPLER_2D, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT_SAMPLER_3D, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT_SAMPLER_CUBE, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _defineProperty(_UNIFORM_SETTERS, GL_UNSIGNED_INT_SAMPLER_2D_ARRAY, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _UNIFORM_SETTERS);

export function parseUniformName(name) {
  // name = name[name.length - 1] === ']' ?
  // name.substr(0, name.length - 3) : name;

  // if array name then clean the array brackets
  var UNIFORM_NAME_REGEXP = /([^\[]*)(\[[0-9]+\])?/;
  var matches = name.match(UNIFORM_NAME_REGEXP);
  if (!matches || matches.length < 2) {
    throw new Error('Failed to parse GLSL uniform name ' + name);
  }

  return {
    name: matches[1],
    length: matches[2] || 1,
    isArray: Boolean(matches[2])
  };
}

// Returns a Magic Uniform Setter
/* eslint-disable complexity */
export function getUniformSetter(gl, location, info) {
  var setter = UNIFORM_SETTERS[info.type];
  if (!setter) {
    throw new Error('Unknown GLSL uniform type ' + info.type);
  }
  return setter.bind(null, gl, location);
}

// Basic checks of uniform values without knowledge of program
// To facilitate early detection of e.g. undefined values in JavaScript
export function checkUniformValues(uniforms, source) {
  for (var uniformName in uniforms) {
    var value = uniforms[uniformName];
    if (!checkUniformValue(value)) {
      // Add space to source
      source = source ? source + ' ' : '';
      // Value could be unprintable so write the object on console
      console.error(source + ' Bad uniform ' + uniformName, value); // eslint-disable-line
      /* eslint-enable no-console */
      throw new Error(source + ' Bad uniform ' + uniformName);
    }
  }
  return true;
}

function checkUniformValue(value) {
  var ok = true;

  // Test for texture (for sampler uniforms)
  // WebGL2: if (value instanceof Texture || value instanceof Sampler) {
  if (value instanceof Texture) {
    ok = true;
    // Check that every element in array is a number, and at least 1 element
  } else if (Array.isArray(value)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var element = _step.value;

        if (!isFinite(element)) {
          ok = false;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    ok = ok && value.length > 0;
    // Typed arrays can only contain numbers, but check length
  } else if (ArrayBuffer.isView(value)) {
    ok = value.length > 0;
    // Check that single value is a number
  } else if (!isFinite(value)) {
    ok = false;
  }

  return ok;
}

// Helper
function addUniform(table, header, uniforms, uniformName) {
  var value = uniforms[uniformName];
  var isDefined = value !== undefined && value !== null;
  table[uniformName] = _defineProperty({
    // Add program's unprovided uniforms
    Type: isDefined ? value : 'NOT PROVIDED'
  }, header, isDefined ? formatValue(value) : 'N/A');
}

// Prepares a table suitable for console.table
/* eslint-disable max-statements */
export function getUniformsTable() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$header = _ref.header,
      header = _ref$header === undefined ? 'Uniforms' : _ref$header,
      program = _ref.program,
      uniforms = _ref.uniforms;

  assert(program);

  var SHADER_MODULE_UNIFORM_REGEXP = '.*_.*';

  var uniformLocations = program._uniformSetters;
  var table = {}; // {[header]: {}};

  // Add program's provided uniforms (in alphabetical order)
  var uniformNames = Object.keys(uniformLocations).sort();

  // First add non-underscored uniforms (assumed not coming from shader modules)
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = uniformNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _uniformName = _step2.value;

      if (!_uniformName.match(SHADER_MODULE_UNIFORM_REGEXP)) {
        addUniform(table, header, uniforms, _uniformName);
      }
    }

    // add underscored uniforms (assumed from shader modules)
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = uniformNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _uniformName2 = _step3.value;

      if (!table[_uniformName2]) {
        addUniform(table, header, uniforms, _uniformName2);
      }
    }

    // Create a table of unused uniforms
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  var unusedTable = {};
  var unusedCount = 0;
  for (var uniformName in uniforms) {
    var uniform = uniforms[uniformName];
    if (!table[uniformName]) {
      unusedCount++;
      unusedTable[uniformName] = _defineProperty({
        Type: 'NOT USED: ' + uniform
      }, header, formatValue(uniform));
    }
  }

  return { table: table, unusedTable: unusedTable, unusedCount: unusedCount };
}
//# sourceMappingURL=uniforms.js.map