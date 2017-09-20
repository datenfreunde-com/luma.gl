var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-console */
import { IS_NODE, logger, timestamp } from './env';

// TODO - this used to use d3.format(.3s)
function formatSI(value) {
  return value.toFixed(3);
}

// TODO: Currently unused, keeping in case we want it later for log formatting
export function formatTime(ms) {
  var formatted = void 0;
  if (ms < 10) {
    formatted = ms.toFixed(2) + 'ms';
  } else if (ms < 100) {
    formatted = ms.toFixed(1) + 'ms';
  } else if (ms < 1000) {
    formatted = (ms / 1000).toFixed(3) + 's';
  } else {
    formatted = (ms / 1000).toFixed(2) + 's';
  }
  return formatted;
}

var DEFAULT_CONFIG = {
  // off by default
  isEnabled: false,
  // logging level
  level: 1,
  // Whether logging is turned on
  isLogEnabled: true,
  // Whether logging prints to console
  isPrintEnabled: true,
  // Whether Probe#run executes code
  isRunEnabled: true
};

function noop() {}

var TO_DISABLE = ['_probe', '_fps', '_externalProbe', '_log', 'run', 'getOption', 'getIterationsPerSecond', 'logIterationsPerSecond'];

var Probe = /*#__PURE__*/function () {

  /**
   * @constructor
   * @param {Object} config Optional configuration args; see #configure
   */
  function Probe() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Probe);

    // Data containers
    this._logStore = [];
    this._sampleStore = {};
    this._fpsStore = {};
    this._startStore = {};
    // Timestamps - pegged to an arbitrary time in the past
    this._startTs = timestamp();
    this._deltaTs = timestamp();
    // Other systems passing in epoch info require an epoch ts to convert
    this._startEpochTs = Date.now();
    this._iterationsTs = null;
    // Configuration
    this._config = config.ignoreEnvironment ? Object.assign({}, DEFAULT_CONFIG) : this._getConfigFromEnvironment();
    // Override with new configuration, if any
    this.configure(config);
    // Disable methods if necessary
    if (!this._config.isEnabled) {
      this.disable();
    }
  }

  /**
   * Turn probe on
   * @return {Probe} self, to support chaining
   */


  _createClass(Probe, [{
    key: 'enable',
    value: function enable() {
      // Swap in live methods
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = TO_DISABLE[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var method = _step.value;

          this[method] = Probe.prototype[method];
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

      return this.configure({ isEnabled: true });
    }

    /**
     * Turn probe off
     * @return {Probe} self, to support chaining
     */

  }, {
    key: 'disable',
    value: function disable() {
      // Swap in noops for live methods
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = TO_DISABLE[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var method = _step2.value;

          this[method] = noop;
        }
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

      return this.configure({ isEnabled: false });
    }

    /**
     * Convenience function: Set probe level
     * @param {Number} level Level to set
     * @return {Probe} self, to support chaining
     */

  }, {
    key: 'setLevel',
    value: function setLevel(level) {
      return this.configure({ level: level });
    }

    /**
     * Configure probe with new values (can include custom key/value pairs).
     * Configuration will be persisted across browser sessions
     * @param {Object} config - named parameters
     * @param {Boolean} config.isEnabled Whether probe is enabled
     * @param {Number} config.level Logging level
     * @param {Boolean} config.isLogEnabled Whether logging prints to console
     * @param {Boolean} config.isRunEnabled Whether #run executes code
     * @return {Probe} self, to support chaining
     */

  }, {
    key: 'configure',
    value: function configure() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var newConfig = Object.assign({}, this._config, config);
      this._config = newConfig;
      // if (!IS_NODE) {
      //   const serialized = JSON.stringify(newConfig);
      //   cookie.set(COOKIE_NAME, serialized);
      // }
      // Support chaining
      return this;
    }

    /**
     * Get a single option from preset configuration. Useful when using Probe to
     * set developer-only switches.
     * @param  {String} key Key to get value for
     * @return {mixed}     Option value, or undefined
     */

  }, {
    key: 'getOption',
    value: function getOption(key) {
      return this._config[key];
    }

    /**
     * Get current log, as an array of log row objects
     * @return {Object[]} Log
     */

  }, {
    key: 'getLog',
    value: function getLog() {
      return this._logStore.slice();
    }

    /**
     * Whether Probe is currently enabled
     * @return {Boolean} isEnabled
     */

  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      return Boolean(this._config.isEnabled);
    }

    /**
     * Reset all internal stores, dropping logs
     */

  }, {
    key: 'reset',
    value: function reset() {
      // Data containers
      this._logStore = [];
      this._sampleStore = {};
      this._fpsStore = {};
      this._startStore = {};
      // Timestamps
      this._startTs = timestamp();
      this._deltaTs = timestamp();
      this._iterationsTs = null;
    }

    /**
     * Reset the long timer
     */

  }, {
    key: 'resetStart',
    value: function resetStart() {
      this._startTs = this._deltaTs = timestamp();
    }

    /**
     * Reset the time since last probe
     */

  }, {
    key: 'resetDelta',
    value: function resetDelta() {
      this._deltaTs = timestamp();
    }

    /**
     * @return {Number} milliseconds, with fractions
     */

  }, {
    key: 'getTotal',
    value: function getTotal() {
      return timestamp() - this._startTs;
    }

    /**
     * @return {Number} milliseconds, with fractions
     */

  }, {
    key: 'getDelta',
    value: function getDelta() {
      return timestamp() - this._deltaTs;
    }
  }, {
    key: '_getElapsedTime',
    value: function _getElapsedTime() {
      var total = timestamp() - this._startTs;
      var delta = timestamp() - this._deltaTs;
      // reset delta timer
      this._deltaTs = timestamp();
      return { total: total, delta: delta };
    }
  }, {
    key: '_log',
    value: function _log(level, name) {
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var times = this._getElapsedTime();
      var logRow = Object.assign({ level: level, name: name }, times, meta);
      // duration handling
      if (meta.start) {
        this._startStore[name] = timestamp();
      } else if (meta.end) {
        // If start isn't found, take the full duration since initialization
        var start = this._startStore[name] || this._startTs;
        logRow.duration = timestamp() - start;
      }
      this._logStore.push(logRow);
      // Log to console if enabled
      if (this._config.isPrintEnabled) {
        // TODO: Nicer console logging
        logger.debug(JSON.stringify(logRow));
      }
    }
  }, {
    key: '_shouldLog',
    value: function _shouldLog(probeLevel) {
      var _config = this._config,
          isEnabled = _config.isEnabled,
          isLogEnabled = _config.isLogEnabled,
          level = _config.level;

      return isEnabled && isLogEnabled && level >= probeLevel;
    }

    /**
     * Displays a double timing (from "start time" and from last probe).
     */

  }, {
    key: 'probe',
    value: function probe() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._probe.apply(this, [1].concat(args));
    }
  }, {
    key: 'probe1',
    value: function probe1() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this._probe.apply(this, [1].concat(args));
    }
  }, {
    key: 'probe2',
    value: function probe2() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this._probe.apply(this, [2].concat(args));
    }
  }, {
    key: 'probe3',
    value: function probe3() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      this._probe.apply(this, [3].concat(args));
    }
  }, {
    key: '_probe',
    value: function _probe(level, name, meta) {
      if (this._shouldLog(level)) {
        this._log(level, name, meta);
      }
    }

    /**
     * Display an averaged value of the time since last probe.
     * Keyed on the first string argument.
     */

  }, {
    key: 'sample',
    value: function sample() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      this._sample.apply(this, [1].concat(args));
    }
  }, {
    key: 'sample1',
    value: function sample1() {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      this._sample.apply(this, [1].concat(args));
    }
  }, {
    key: 'sample2',
    value: function sample2() {
      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      this._sample.apply(this, [2].concat(args));
    }
  }, {
    key: 'sample3',
    value: function sample3() {
      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      this._sample.apply(this, [3].concat(args));
    }
  }, {
    key: '_sample',
    value: function _sample(level, name, meta) {
      if (this._shouldLog(level)) {
        var samples = this._sampleStore;

        var probeData = samples[name] || (samples[name] = { timeSum: 0, count: 0, averageTime: 0 });
        probeData.timeSum += timestamp() - this._deltaTs;
        probeData.count += 1;
        probeData.averageTime = probeData.timeSum / probeData.count;

        this._log(level, name, Object.assign({}, meta, { averageTime: probeData.averageTime }));

        // Weight more heavily on later samples. Otherwise it gets almost
        // impossible to see outliers after a while.
        if (probeData.count === 10) {
          probeData.count = 5;
          probeData.timeSum /= 2;
        }
      }
    }

    /**
     * These functions will average the time between calls and log that value
     * every couple of calls, in effect showing a times per second this
     * function is called - sometimes representing a "frames per second" count.
     */

  }, {
    key: 'fps',
    value: function fps() {
      for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      this._fps.apply(this, [1].concat(args));
    }
  }, {
    key: 'fps1',
    value: function fps1() {
      for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      this._fps.apply(this, [1].concat(args));
    }
  }, {
    key: 'fps2',
    value: function fps2() {
      for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      this._fps.apply(this, [2].concat(args));
    }
  }, {
    key: 'fps3',
    value: function fps3() {
      for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      this._fps.apply(this, [3].concat(args));
    }
  }, {
    key: '_fps',
    value: function _fps(level) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _opts$count = opts.count,
          count = _opts$count === undefined ? 10 : _opts$count;

      if (this._shouldLog(level)) {
        var fpsLog = this._fpsStore;
        var fpsData = fpsLog[name];
        if (!fpsData) {
          fpsLog[name] = { count: 1, time: timestamp() };
        } else if (++fpsData.count >= count) {
          var fps = fpsData.count / (timestamp() - fpsData.time);
          fpsData.count = 0;
          fpsData.time = timestamp();
          this._log(level, name, Object.assign({ fps: fps }, opts));
        }
      }
    }

    /**
     * Display a measurement from an external source, such as a server,
     * inline with other local measurements in the style of Probe's output.
     */

  }, {
    key: 'externalProbe',
    value: function externalProbe() {
      for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }

      this._externalProbe.apply(this, [1].concat(args));
    }
  }, {
    key: 'externalProbe1',
    value: function externalProbe1() {
      for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }

      this._externalProbe.apply(this, [1].concat(args));
    }
  }, {
    key: 'externalProbe2',
    value: function externalProbe2() {
      for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }

      this._externalProbe.apply(this, [2].concat(args));
    }
  }, {
    key: 'externalProbe3',
    value: function externalProbe3() {
      for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }

      this._externalProbe.apply(this, [3].concat(args));
    }
  }, {
    key: '_externalProbe',
    value: function _externalProbe(level, name, timeStart, timeSpent, meta) {
      if (this._shouldLog(level)) {
        // External probes are expected to provide epoch timestamps
        var total = timeStart - this._startEpochTs;
        var delta = timeSpent;
        this._log(level, name, Object.assign({ total: total, delta: delta }, meta));
      }
    }

    /* Conditionally run a function only when probe is enabled */

  }, {
    key: 'run',
    value: function run(func, arg) {
      var _config2 = this._config,
          isEnabled = _config2.isEnabled,
          isRunEnabled = _config2.isRunEnabled;

      if (isEnabled && isRunEnabled) {
        func(arg);
      }
    }
  }, {
    key: 'startIiterations',
    value: function startIiterations() {
      this._iterationsTs = timestamp();
    }

    /**
     * Get config from persistent store, if available
     * @return {Object} config
     */

  }, {
    key: '_getConfigFromEnvironment',
    value: function _getConfigFromEnvironment() {
      var customConfig = {};
      if (!IS_NODE) {
        var serialized = {}; // cookie.get(COOKIE_NAME);
        if (serialized) {
          customConfig = JSON.parse(serialized);
        }
      }
      return Object.assign({}, DEFAULT_CONFIG, customConfig);
    }

    /* Count iterations per second. Runs the provided function a
     * specified number of times and normalizes the result to represent
     * iterations per second.
     *
     * TODO/ib Measure one iteration and auto adjust iteration count.
     */

  }, {
    key: 'getIterationsPerSecond',
    value: function getIterationsPerSecond() {
      var iterations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
      var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var context = arguments[2];

      if (func) {
        Probe.startIiterations();
        // Keep call overhead minimal, only use Function.call if context supplied
        if (context) {
          for (var i = 0; i < iterations; i++) {
            func.call(context);
          }
        } else {
          for (var _i = 0; _i < iterations; _i++) {
            func();
          }
        }
      }
      var elapsedMillis = timestamp() - this._iterationsTs;
      var iterationsPerSecond = formatSI(iterations * 1000 / elapsedMillis);
      return iterationsPerSecond;
    }

    /*
     * Print the number of iterations per second measured using the provided
     * function
     */

  }, {
    key: 'logIterationsPerSecond',
    value: function logIterationsPerSecond(testName) {
      var iterations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
      var func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var elapsedMs = this.getIterationsPerSecond(iterations, func, context);
      var iterationsPerSecond = formatSI(iterations * 1000 / elapsedMs);
      logger.log(testName + ': ' + iterationsPerSecond + ' iterations/s');
    }

    /**
     * Show current log in a table, if supported by console
     * @param {Number} tail If supplied, show only the last n entries
     */

  }, {
    key: 'table',
    value: function table(tail) {
      if (typeof logger.table === 'function') {
        var rows = tail ? this._logStore.slice(-tail) : this._logStore;
        logger.table(rows);
      }
    }
  }]);

  return Probe;
}();

export default Probe;
//# sourceMappingURL=probe.js.map