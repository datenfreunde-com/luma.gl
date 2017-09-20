import assert from 'assert';

// Resolve a WebGL enumeration name (returns itself if already a number)
export function getKeyValue(gl, name) {
  // If not a string, return (assume number)
  if (typeof name !== 'string') {
    return name;
  }

  // If string converts to number, return number
  var number = Number(name);
  if (!isNaN(number)) {
    return number;
  }

  // Look up string, after removing any 'GL.' or 'gl.' prefix
  name = name.replace(/^.*\./, '');
  var value = gl[name];
  assert(value !== undefined, 'Accessing undefined constant GL.' + name);
  return value;
}

export function getKey(gl, value) {
  value = Number(value);
  for (var key in gl) {
    if (gl[key] === value) {
      return 'gl.' + key;
    }
  }
  return String(value);
}

export function getKeyType(gl, value) {
  assert(value !== undefined, 'undefined key');
  value = Number(value);
  for (var key in gl) {
    if (gl[key] === value) {
      return 'gl.' + key;
    }
  }
  return String(value);
}
//# sourceMappingURL=constants-to-keys.js.map