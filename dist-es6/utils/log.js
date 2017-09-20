/* eslint-disable no-console */
/* global console */
var cache = {};

var _log = {
  priority: 0,
  table: function table(priority, _table) {
    if (priority <= _log.priority && _table) {
      console.table(_table);
    }
  },
  log: function log(priority, arg) {
    if (priority <= _log.priority) {
      var _console;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      (_console = console).debug.apply(_console, ['luma.gl: ' + arg].concat(args));
    }
  },
  info: function info(priority, arg) {
    if (priority <= _log.priority) {
      var _console2;

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      (_console2 = console).log.apply(_console2, ['luma.gl: ' + arg].concat(args));
    }
  },
  once: function once(priority, arg) {
    if (!cache[arg]) {
      for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      _log.log.apply(_log, [priority, arg].concat(args));
    }
    cache[arg] = true;
  },
  warn: function warn(priority, arg) {
    if (priority <= _log.priority && !cache[arg]) {
      var _console3;

      for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      (_console3 = console).warn.apply(_console3, ['luma.gl: ' + arg].concat(args));
    }
    cache[arg] = true;
  },
  error: function error(priority, arg) {
    var _console4;

    for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
      args[_key5 - 2] = arguments[_key5];
    }

    (_console4 = console).error.apply(_console4, ['luma.gl: ' + arg].concat(args));
  },
  deprecated: function deprecated(oldUsage, newUsage) {
    _log.warn(0, 'luma.gl: `' + oldUsage + '` is deprecated and will be removed in a later version. Use `' + newUsage + '` instead');
  },
  group: function group(priority, arg) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$collapsed = _ref.collapsed,
        collapsed = _ref$collapsed === undefined ? false : _ref$collapsed;

    if (priority <= _log.priority) {
      if (collapsed) {
        console.groupCollapsed('luma.gl: ' + arg);
      } else {
        console.group('luma.gl: ' + arg);
      }
    }
  },
  groupEnd: function groupEnd(priority, arg) {
    if (priority <= _log.priority) {
      console.groupEnd('luma.gl: ' + arg);
    }
  }
};

function formatArrayValue(v, opts) {
  var _opts$maxElts = opts.maxElts,
      maxElts = _opts$maxElts === undefined ? 16 : _opts$maxElts,
      _opts$size = opts.size,
      size = _opts$size === undefined ? 1 : _opts$size;

  var string = '[';
  for (var i = 0; i < v.length && i < maxElts; ++i) {
    if (i > 0) {
      string += ',' + (i % size === 0 ? ' ' : '');
    }
    string += formatValue(v[i], opts);
  }
  var terminator = v.length > maxElts ? '...' : ']';
  return '' + string + terminator;
}

export function formatValue(v) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var EPSILON = 1e-16;
  var _opts$isInteger = opts.isInteger,
      isInteger = _opts$isInteger === undefined ? false : _opts$isInteger;

  if (Array.isArray(v) || ArrayBuffer.isView(v)) {
    return formatArrayValue(v, opts);
  }
  if (!Number.isFinite(v)) {
    return String(v);
  }
  if (Math.abs(v) < EPSILON) {
    return isInteger ? '0' : '0.';
  }
  if (isInteger) {
    return v.toFixed(0);
  }
  if (Math.abs(v) > 100 && Math.abs(v) < 10000) {
    return v.toFixed(0);
  }
  var string = v.toPrecision(2);
  var decimal = string.indexOf('.0');
  return decimal === string.length - 2 ? string.slice(0, -1) : string;
}

export default _log;
//# sourceMappingURL=log.js.map