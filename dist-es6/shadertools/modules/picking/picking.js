var DEFAULT_HIGHLIGHT_COLOR = new Uint8Array([0, 64, 128, 64]);

var DEFAULT_MODULE_OPTIONS = {
  pickingSelectedColor: null, //  Set to a picking color to visually highlight that item
  pickingHighlightColor: DEFAULT_HIGHLIGHT_COLOR, // Color of visual highlight of "selected" item
  pickingThreshold: 1.0,
  pickingActive: false, // Set to true when rendering to off-screen "picking" buffer
  pickingValid: false
};

/* eslint-disable camelcase */
function getUniforms() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_MODULE_OPTIONS;

  var uniforms = {};
  uniforms.picking_uValid = opts.pickingValid ? 1 : 0;
  if (opts.pickingSelectedColor !== undefined) {
    if (opts.pickingSelectedColor) {
      var selectedColor = [opts.pickingSelectedColor[0], opts.pickingSelectedColor[1], opts.pickingSelectedColor[2]];
      // console.log('selected picking color', selectedColor);
      uniforms.picking_uSelectedPickingColor = selectedColor;
    }
  }
  if (opts.pickingHighlightColor !== undefined) {
    uniforms.picking_uHighlightColor = opts.pickingHighlightColor;
  }
  // TODO - major hack - decide on normalization and remove
  if (opts.pickingThreshold !== undefined) {
    uniforms.picking_uThreshold = opts.pickingThreshold;
  }
  if (opts.pickingActive !== undefined) {
    uniforms.picking_uActive = opts.pickingActive ? 1 : 0;
  }
  return uniforms;
}

var vs = 'uniform vec3 picking_uSelectedPickingColor;\nuniform float picking_uThreshold;\nuniform bool picking_uValid;\n\nvarying vec4 picking_vRGBcolor_Aselected;\n\nconst float COLOR_SCALE = 1. / 256.;\n\nbool isVertexPicked(vec3 vertexColor, vec3 pickedColor, bool pickingValid) {\n  return\n    pickingValid &&\n    abs(vertexColor.r - pickedColor.r) < picking_uThreshold &&\n    abs(vertexColor.g - pickedColor.g) < picking_uThreshold &&\n    abs(vertexColor.b - pickedColor.b) < picking_uThreshold;\n}\n\nvoid picking_setPickingColor(vec3 pickingColor) {\n  // Do the comparison with selected item color in vertex shader as it should mean fewer compares\n  picking_vRGBcolor_Aselected.a =\n    float(isVertexPicked(pickingColor, picking_uSelectedPickingColor, picking_uValid));\n\n  // Stores the picking color so that the fragment shader can render it during picking\n  picking_vRGBcolor_Aselected.rgb = pickingColor * COLOR_SCALE;\n}\n';

var fs = 'uniform bool picking_uActive; // true during rendering to offscreen picking buffer\nuniform vec3 picking_uSelectedPickingColor;\nuniform vec4 picking_uHighlightColor;\n\nvarying vec4 picking_vRGBcolor_Aselected;\n\nconst float COLOR_SCALE = 1. / 256.;\n\n/*\n * Returns highlight color if this item is selected.\n */\nvec4 picking_filterHighlightColor(vec4 color) {\n  bool selected = bool(picking_vRGBcolor_Aselected.a);\n  return selected ? picking_uHighlightColor : color;\n}\n\n/*\n * Returns picking color if picking enabled else unmodified argument.\n */\nvec4 picking_filterPickingColor(vec4 color) {\n  vec3 pickingColor = picking_vRGBcolor_Aselected.rgb;\n  return picking_uActive ? vec4(pickingColor, 1.0) : color;\n}\n';

export default {
  name: 'picking',
  vs: vs,
  fs: fs,
  getUniforms: getUniforms
};
//# sourceMappingURL=picking.js.map