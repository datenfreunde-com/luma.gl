var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint quotes: ["error", "single", { "allowTemplateLiterals": true }]*/
// A scenegraph object node
import { GL, Buffer, Program, withParameters, checkUniformValues, isWebGL } from '../webgl';
// import {withParameters} from '../webgl/context-state';
import { getUniformsTable } from '../webgl/uniforms';
import { getDrawMode } from '../geometry/geometry';

import Object3D from '../core/object-3d';
import { log, formatValue } from '../utils';
import { MONOLITHIC_SHADERS, MODULAR_SHADERS } from '../shadertools/shaders';
import { assembleShaders } from '../shadertools';

import { addModel, removeModel, logModel, getOverrides } from '../debug/seer-integration';
import Query from '../webgl/query';
import assert from 'assert';

var MSG_INSTANCED_PARAM_DEPRECATED = 'Warning: Model constructor: parameter "instanced" renamed to "isInstanced".\nThis will become a hard error in a future version of luma.gl.';

var ERR_MODEL_PARAMS = 'Model needs drawMode and vertexCount';

// Model abstract O3D Class

var Model = /*#__PURE__*/function (_Object3D) {
  _inherits(Model, _Object3D);

  function Model(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Model);

    var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, opts));

    if (isWebGL(gl)) {
      // constructor signature 1: (gl, {...opts})
      _this.gl = gl;
    } else {
      // Warning that we are using v3 style construction
      log.deprecated('Model({gl, ...opts})', 'Model(gl, {...opts}');
      // constructor signature 2: ({gl, ...opts})
      // Note: A Model subclass may still have supplied opts, just use those as overrides
      opts = Object.assign(gl, opts);
      // v3 compatibility: Auto extract gl from program if supplied
      _this.gl = opts.gl || opts.program && opts.program.gl;
      // Verify that we have a valid context
      assert(isWebGL(_this.gl), 'Not a WebGL context');
    }
    _this.init(opts);
    return _this;
  }

  /* eslint-disable max-statements  */
  /* eslint-disable complexity  */


  _createClass(Model, [{
    key: 'init',
    value: function init() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$vs = _ref.vs,
          vs = _ref$vs === undefined ? null : _ref$vs,
          _ref$fs = _ref.fs,
          fs = _ref$fs === undefined ? null : _ref$fs,
          _ref$modules = _ref.modules,
          modules = _ref$modules === undefined ? null : _ref$modules,
          _ref$defines = _ref.defines,
          defines = _ref$defines === undefined ? {} : _ref$defines,
          _ref$moduleSettings = _ref.moduleSettings,
          moduleSettings = _ref$moduleSettings === undefined ? {} : _ref$moduleSettings,
          defaultUniforms = _ref.defaultUniforms,
          _ref$program = _ref.program,
          program = _ref$program === undefined ? null : _ref$program,
          _ref$shaderCache = _ref.shaderCache,
          shaderCache = _ref$shaderCache === undefined ? null : _ref$shaderCache,
          _ref$isInstanced = _ref.isInstanced,
          isInstanced = _ref$isInstanced === undefined ? false : _ref$isInstanced,
          instanced = _ref.instanced,
          _ref$vertexCount = _ref.vertexCount,
          vertexCount = _ref$vertexCount === undefined ? undefined : _ref$vertexCount,
          _ref$instanceCount = _ref.instanceCount,
          instanceCount = _ref$instanceCount === undefined ? 0 : _ref$instanceCount,
          drawMode = _ref.drawMode,
          _ref$uniforms = _ref.uniforms,
          uniforms = _ref$uniforms === undefined ? {} : _ref$uniforms,
          _ref$attributes = _ref.attributes,
          attributes = _ref$attributes === undefined ? {} : _ref$attributes,
          _ref$geometry = _ref.geometry,
          geometry = _ref$geometry === undefined ? null : _ref$geometry,
          _ref$pickable = _ref.pickable,
          pickable = _ref$pickable === undefined ? true : _ref$pickable,
          _ref$pick = _ref.pick,
          pick = _ref$pick === undefined ? null : _ref$pick,
          _ref$render = _ref.render,
          render = _ref$render === undefined ? null : _ref$render,
          _ref$onBeforeRender = _ref.onBeforeRender,
          onBeforeRender = _ref$onBeforeRender === undefined ? function () {} : _ref$onBeforeRender,
          _ref$onAfterRender = _ref.onAfterRender,
          onAfterRender = _ref$onAfterRender === undefined ? function () {} : _ref$onAfterRender,
          _ref$timerQueryEnable = _ref.timerQueryEnabled,
          timerQueryEnabled = _ref$timerQueryEnable === undefined ? false : _ref$timerQueryEnable;

      this._initializeProgram({
        vs: vs,
        fs: fs,
        modules: modules,
        defines: defines,
        moduleSettings: moduleSettings,
        defaultUniforms: defaultUniforms,
        program: program,
        shaderCache: shaderCache
      });

      this.uniforms = {};

      // Make sure we have some reasonable default uniforms in place
      uniforms = Object.assign({}, this.program.defaultUniforms, uniforms);
      this.setUniforms(uniforms);
      // Get all default uniforms
      this.setUniforms(this.getModuleUniforms());
      // Get unforms for supplied parameters
      this.setUniforms(this.getModuleUniforms(moduleSettings));

      if (instanced) {
        /* global console */
        /* eslint-disable no-console */
        console.warn(MSG_INSTANCED_PARAM_DEPRECATED);
        isInstanced = isInstanced || instanced;
      }

      // TODO - remove?
      this.buffers = {};
      this.userData = {};
      this.drawParams = {};
      this.dynamic = false;
      this.needsRedraw = true;

      // Attributes and buffers
      this.setGeometry(geometry);

      this.attributes = {};
      this.setAttributes(attributes);

      // geometry might have set drawMode and vertexCount
      if (drawMode !== undefined) {
        this.drawMode = getDrawMode(drawMode);
      }
      if (vertexCount !== undefined) {
        this.vertexCount = vertexCount;
      }
      this.isInstanced = isInstanced;
      this.instanceCount = instanceCount;

      // picking options
      this.pickable = Boolean(pickable);
      this.pick = pick || function () {
        return false;
      };

      this.onBeforeRender = onBeforeRender;
      this.onAfterRender = onAfterRender;

      // assert(program || program instanceof Program);
      assert(this.drawMode !== undefined && Number.isFinite(this.vertexCount), ERR_MODEL_PARAMS);

      this.timerQueryEnabled = timerQueryEnabled && Query.isSupported(this.gl, { timer: true });
      this.timeElapsedQuery = undefined;
      this.lastQueryReturned = true;

      this.stats = {
        accumulatedFrameTime: 0,
        averageFrameTime: 0,
        profileFrameCount: 0
      };
    }
    /* eslint-enable max-statements */

  }, {
    key: '_initializeProgram',
    value: function _initializeProgram(_ref2) {
      var vs = _ref2.vs,
          fs = _ref2.fs,
          modules = _ref2.modules,
          defines = _ref2.defines,
          moduleSettings = _ref2.moduleSettings,
          defaultUniforms = _ref2.defaultUniforms,
          program = _ref2.program,
          shaderCache = _ref2.shaderCache;


      this.getModuleUniforms = function (x) {};

      if (!program) {
        // Assign default shaders if none are provided
        if (!vs) {
          vs = MODULAR_SHADERS.vs;
        }
        if (!fs) {
          fs = MODULAR_SHADERS.fs;
        }

        // Assign default uniforms (if any default shaders are being used)
        if (vs === MONOLITHIC_SHADERS.vs || fs === MONOLITHIC_SHADERS.fs) {
          log.warn(0, 'luma.gl: default shaders are deprecated and will be removed in a future version. Use shader modules instead.');
          defaultUniforms = defaultUniforms || MONOLITHIC_SHADERS.defaultUniforms;
        }

        var assembleResult = assembleShaders(this.gl, { vs: vs, fs: fs, modules: modules, defines: defines });


        // Retrive compiled shaders from cache if exist, otherwise add to the cache.
        vs = assembleResult.vs;
        fs = assembleResult.fs;
        if (shaderCache) {
          vs = shaderCache.getVertexShader(this.gl, vs);
          fs = shaderCache.getFragmentShader(this.gl, fs);
        }

        var getUniforms = assembleResult.getUniforms;

        this.getModuleUniforms = getUniforms || function (x) {};

        program = new Program(this.gl, { vs: vs, fs: fs });
      }

      this.program = program;
      assert(this.program instanceof Program, 'Model needs a program');
    }
    /* eslint-enable complexity */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.delete();
    }
  }, {
    key: 'delete',
    value: function _delete() {
      this.program.delete();
      removeModel(this.id);
    }
  }, {
    key: 'setNeedsRedraw',
    value: function setNeedsRedraw() {
      var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.needsRedraw = redraw;
      return this;
    }
  }, {
    key: 'getNeedsRedraw',
    value: function getNeedsRedraw() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$clearRedrawFlag = _ref3.clearRedrawFlags,
          clearRedrawFlags = _ref3$clearRedrawFlag === undefined ? false : _ref3$clearRedrawFlag;

      var redraw = false;
      redraw = redraw || this.needsRedraw;
      this.needsRedraw = this.needsRedraw && !clearRedrawFlags;
      redraw = redraw || this.geometry.getNeedsRedraw({ clearRedrawFlags: clearRedrawFlags });
      return redraw;
    }
  }, {
    key: 'setDrawMode',
    value: function setDrawMode(drawMode) {
      this.drawMode = getDrawMode(drawMode);
      return this;
    }
  }, {
    key: 'getDrawMode',
    value: function getDrawMode() {
      return this.drawMode;
    }
  }, {
    key: 'setVertexCount',
    value: function setVertexCount(vertexCount) {
      assert(Number.isFinite(vertexCount));
      this.vertexCount = vertexCount;
      return this;
    }
  }, {
    key: 'getVertexCount',
    value: function getVertexCount() {
      return this.vertexCount;
    }
  }, {
    key: 'setInstanceCount',
    value: function setInstanceCount(instanceCount) {
      assert(Number.isFinite(instanceCount));
      this.instanceCount = instanceCount;
      return this;
    }
  }, {
    key: 'getInstanceCount',
    value: function getInstanceCount() {
      return this.instanceCount;
    }
  }, {
    key: 'getProgram',
    value: function getProgram() {
      return this.program;
    }

    // TODO - just set attributes, don't hold on to geometry

  }, {
    key: 'setGeometry',
    value: function setGeometry(geometry) {
      this.geometry = geometry;
      this.vertexCount = geometry.getVertexCount();
      this.drawMode = geometry.drawMode;
      this._createBuffersFromAttributeDescriptors(this.geometry.getAttributes());
      this.setNeedsRedraw();
      return this;
    }
  }, {
    key: 'getAttributes',
    value: function getAttributes() {
      return this.attributes;
    }
  }, {
    key: 'setAttributes',
    value: function setAttributes() {
      var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(this.attributes, attributes);
      this._createBuffersFromAttributeDescriptors(attributes);
      this.setNeedsRedraw();
      return this;
    }
  }, {
    key: 'getUniforms',
    value: function getUniforms() {
      return this.uniforms;
    }

    // TODO - should actually set the uniforms

  }, {
    key: 'setUniforms',
    value: function setUniforms() {
      var uniforms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      checkUniformValues(uniforms, this.id);
      Object.assign(this.uniforms, uniforms);
      this.setNeedsRedraw();
      return this;
    }

    // getModuleUniforms (already on object)

  }, {
    key: 'updateModuleSettings',
    value: function updateModuleSettings(opts) {
      var uniforms = this.getModuleUniforms(opts);
      return this.setUniforms(uniforms);
    }

    // TODO - uniform names are too strongly linked camera <=> default shaders
    // At least all special handling is collected here.

  }, {
    key: 'addViewUniforms',
    value: function addViewUniforms(uniforms) {
      // TODO - special treatment of these parameters should be removed
      var camera = uniforms.camera,
          viewMatrix = uniforms.viewMatrix,
          modelMatrix = uniforms.modelMatrix;
      // Camera exposes uniforms that can be used directly in shaders

      var cameraUniforms = camera ? camera.getUniforms() : {};

      var viewUniforms = viewMatrix ? this.getCoordinateUniforms(viewMatrix, modelMatrix) : {};

      return Object.assign({}, uniforms, cameraUniforms, viewUniforms);
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$uniforms = _ref4.uniforms,
          uniforms = _ref4$uniforms === undefined ? {} : _ref4$uniforms,
          _ref4$attributes = _ref4.attributes,
          attributes = _ref4$attributes === undefined ? {} : _ref4$attributes,
          _ref4$samplers = _ref4.samplers,
          samplers = _ref4$samplers === undefined ? {} : _ref4$samplers,
          _ref4$parameters = _ref4.parameters,
          parameters = _ref4$parameters === undefined ? {} : _ref4$parameters,
          settings = _ref4.settings,
          _ref4$framebuffer = _ref4.framebuffer,
          framebuffer = _ref4$framebuffer === undefined ? null : _ref4$framebuffer;

      if (settings) {
        log.deprecated('settings', 'parameters');
        parameters = settings;
      }
      var gl = this.program.gl;

      if (framebuffer) {
        parameters = Object.assign(parameters, { framebuffer: framebuffer });
      }
      return withParameters(gl, parameters, function () {
        return _this2.render(uniforms, attributes, samplers);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var uniforms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var samplers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      addModel(this);

      var resolvedUniforms = this.addViewUniforms(uniforms);
      getOverrides(this.id, resolvedUniforms);

      this.setUniforms(resolvedUniforms);

      log.group(2, '>>> RENDERING MODEL ' + this.id, { collapsed: log.priority <= 2 });

      this.setProgramState();

      this._logAttributesAndUniforms(2, resolvedUniforms);

      this.onBeforeRender();

      var drawParams = this.drawParams;
      if (drawParams.isInstanced && !this.isInstanced) {
        log.warn(0, 'Found instanced attributes on non-instanced model');
      }
      var isIndexed = drawParams.isIndexed,
          indexType = drawParams.indexType;
      var isInstanced = this.isInstanced,
          instanceCount = this.instanceCount;


      this._timerQueryStart();

      this.program.draw({
        drawMode: this.getDrawMode(),
        vertexCount: this.getVertexCount(),
        isIndexed: isIndexed,
        indexType: indexType,
        isInstanced: isInstanced,
        instanceCount: instanceCount
      });

      this._timerQueryEnd();

      this.onAfterRender();

      this.unsetProgramState();

      this.setNeedsRedraw(false);

      log.groupEnd(2, '>>> RENDERING MODEL ' + this.id);

      return this;
    }
  }, {
    key: 'setProgramState',
    value: function setProgramState() {
      var program = this.program;

      program.use();
      this.drawParams = {};
      program.setBuffers(this.buffers, { drawParams: this.drawParams });
      program.setUniforms(this.uniforms, this.samplers);
      return this;
    }
  }, {
    key: 'unsetProgramState',
    value: function unsetProgramState() {
      // Ensures all vertex attributes are disabled and ELEMENT_ARRAY_BUFFER
      // is unbound
      this.program.unsetBuffers();
      return this;
    }
  }, {
    key: '_timerQueryStart',
    value: function _timerQueryStart() {
      if (this.timerQueryEnabled === true) {
        if (!this.timeElapsedQuery) {
          this.timeElapsedQuery = new Query(this.gl);
        }
        if (this.lastQueryReturned) {
          this.lastQueryReturned = false;
          this.timeElapsedQuery.beginTimeElapsedQuery();
        }
      }
    }
  }, {
    key: '_timerQueryEnd',
    value: function _timerQueryEnd() {
      if (this.timerQueryEnabled === true) {
        this.timeElapsedQuery.end();
        // TODO: Skip results if 'gl.getParameter(this.ext.GPU_DISJOINT_EXT)' returns false
        // should this be incorporated into Query object?
        if (this.timeElapsedQuery.isResultAvailable()) {
          this.lastQueryReturned = true;
          var elapsedTime = this.timeElapsedQuery.getResult();

          // Update stats (e.g. for seer)
          this.stats.lastFrameTime = elapsedTime;
          this.stats.accumulatedFrameTime += elapsedTime;
          this.stats.profileFrameCount++;
          this.stats.averageFrameTime = this.stats.accumulatedFrameTime / this.stats.profileFrameCount;

          // Log stats
          log.log(2, 'GPU time ' + this.program.id + ': ' + this.stats.lastFrameTime + 'ms avg ' + this.stats.averageFrameTime + 'ms acc: ' + this.stats.accumulatedFrameTime + 'ms count: ' + this.stats.profileFrameCount);
        }
      }
    }

    // Makes sure buffers are created for all attributes
    // and that the program is updated with those buffers
    // TODO - do we need the separation between "attributes" and "buffers"
    // couldn't apps just create buffers directly?

  }, {
    key: '_createBuffersFromAttributeDescriptors',
    value: function _createBuffersFromAttributeDescriptors(attributes) {
      var gl = this.program.gl;


      for (var attributeName in attributes) {
        var attribute = attributes[attributeName];

        if (attribute instanceof Buffer) {
          this.buffers[attributeName] = attribute;
        } else {
          // Autocreate a buffer
          this.buffers[attributeName] = this.buffers[attributeName] || new Buffer(gl, {
            target: attribute.isIndexed ? GL.ELEMENT_ARRAY_BUFFER : GL.ARRAY_BUFFER
          });

          var buffer = this.buffers[attributeName];
          buffer.setData({ data: attribute.value }).setDataLayout(attribute);
        }
      }

      return this;
    }
  }, {
    key: '_logAttributesAndUniforms',
    value: function _logAttributesAndUniforms() {
      var priority = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
      var uniforms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (log.priority >= priority) {
        var attributeTable = this._getAttributesTable({
          header: this.id + ' attributes',
          program: this.program,
          attributes: Object.assign({}, this.geometry.attributes, this.attributes)
        });
        log.table(priority, attributeTable);

        var _getUniformsTable = getUniformsTable({
          header: this.id + ' uniforms',
          program: this.program,
          uniforms: Object.assign({}, this.uniforms, uniforms)
        }),
            table = _getUniformsTable.table,
            unusedTable = _getUniformsTable.unusedTable,
            unusedCount = _getUniformsTable.unusedCount;

        log.table(priority, table);
        log.log(priority, (unusedCount || 'No') + ' unused uniforms ', unusedTable);
      }

      logModel(this, uniforms);
    }

    // Todo move to attributes manager

  }, {
    key: '_getAttributesTable',
    value: function _getAttributesTable() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          attributes = _ref5.attributes,
          _ref5$header = _ref5.header,
          header = _ref5$header === undefined ? 'Attributes' : _ref5$header,
          instanced = _ref5.instanced,
          program = _ref5.program;

      assert(program);
      var attributeLocations = program._attributeLocations;
      var table = {}; // {[header]: {}};

      // Add used attributes
      for (var attributeName in attributeLocations) {
        var attribute = attributes[attributeName];
        var location = attributeLocations[attributeName];
        table[attributeName] = this._getAttributeEntry(attribute, location, header);
      }

      // Add any unused attributes
      for (var _attributeName in attributes) {
        var _attribute = attributes[_attributeName];
        if (!table[_attributeName]) {
          table[_attributeName] = this._getAttributeEntry(_attribute, null, header);
        }
      }

      return table;
    }
  }, {
    key: '_getAttributeEntry',
    value: function _getAttributeEntry(attribute, location, header) {
      var round = function round(num) {
        return Math.round(num * 10) / 10;
      };

      var type = 'NOT PROVIDED';
      var instanced = 0;
      var size = 'N/A';
      var verts = 'N/A';
      var bytes = 'N/A';
      var value = 'N/A';

      if (attribute && location === null) {
        location = attribute.isIndexed ? 'ELEMENT_ARRAY_BUFFER' : 'NOT USED';
      }

      if (attribute instanceof Buffer) {
        var buffer = attribute;
        type = buffer.layout.type;
        instanced = buffer.layout.instanced;
        size = buffer.layout.size;
        verts = round(buffer.data.length / buffer.layout.size);
        bytes = buffer.data.length * buffer.data.BYTES_PER_ELEMENT;
      } else if (attribute) {
        type = attribute.value.constructor.name;
        instanced = attribute.instanced;
        size = attribute.size;
        verts = round(attribute.value.length / attribute.size);
        bytes = attribute.value.length * attribute.value.BYTES_PER_ELEMENT;
        value = attribute.value;
      }

      // Generate a type name by dropping Array from Float32Array etc.
      type = String(type).replace('Array', '');
      // Look for 'nt' to detect integer types, e.g. Int32Array, Uint32Array
      var isInteger = type.indexOf('nt') !== -1;

      return _defineProperty({
        'Inst/Verts/Comps/Bytes/Type/Loc': (instanced ? 'I ' : 'P ') + ' ' + verts + ' (x' + size + '=' + bytes + ' ' + type + ') loc=' + location
      }, header, formatValue(value, { size: size, isInteger: isInteger }));
    }

    // DEPRECATED / REMOVED

  }, {
    key: 'isPickable',
    value: function isPickable() {
      return this.pickable;
    }
  }, {
    key: 'setPickable',
    value: function setPickable() {
      var pickable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.pickable = Boolean(pickable);
      return this;
    }
  }, {
    key: 'getGeometry',
    value: function getGeometry() {
      return this.geometry;
    }
  }]);

  return Model;
}(Object3D);

export default Model;
//# sourceMappingURL=model.js.map