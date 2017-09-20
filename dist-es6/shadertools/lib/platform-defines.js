import { getContextInfo } from '../../webgl';

export function checkRendererVendor(debugInfo, gpuVendor) {
  var vendor = debugInfo.vendor,
      renderer = debugInfo.renderer;

  var result = void 0;
  switch (gpuVendor) {
    case 'nvidia':
      result = vendor.match(/NVIDIA/i) || renderer.match(/NVIDIA/i);
      break;
    case 'intel':
      result = vendor.match(/INTEL/i) || renderer.match(/INTEL/i);
      break;
    case 'amd':
      result = vendor.match(/AMD/i) || renderer.match(/AMD/i) || vendor.match(/ATI/i) || renderer.match(/ATI/i);
      break;
    default:
      result = false;
  }
  return result;
}

export function getPlatformShaderDefines(gl) {
  /* eslint-disable */
  var platformDefines = '';
  var debugInfo = getContextInfo(gl);

  if (checkRendererVendor(debugInfo, 'nvidia')) {
    platformDefines += '#define NVIDIA_GPU\n#define NVIDIA_FP64_WORKAROUND 1\n#define NVIDIA_EQUATION_WORKAROUND 1\n';
  } else if (checkRendererVendor(debugInfo, 'intel')) {
    platformDefines += '#define INTEL_GPU\n#define INTEL_FP64_WORKAROUND 1\n#define NVIDIA_EQUATION_WORKAROUND 1\n #define INTEL_TAN_WORKAROUND 1\n';
  } else if (checkRendererVendor(debugInfo, 'amd')) {
    platformDefines += '#define AMD_GPU\n';
  } else {
    platformDefines += '#define DEFAULT_GPU\n';
  }

  return platformDefines;
}

export var VERSION_DEFINES = '// Defines for shader portability\n#if (__VERSION__ > 120)\n# define attribute in\n# define varying out\n#else\n// # define in attribute\n// # define out varying\n#endif // __VERSION\n\n// FRAG_DEPTH => gl_FragDepth is available\n#ifdef GL_EXT_frag_depth\n#extension GL_EXT_frag_depth : enable\n# define FRAG_DEPTH\n# define gl_FragDepth gl_FragDepthEXT\n#endif\n#if (__VERSION__ > 120)\n# define FRAG_DEPTH\n#endif\n\n// DERIVATIVES => dxdF, dxdY and fwidth are available\n// deactivated for IE11 compat reasons\n//#ifdef GL_OES_standard_derivatives\n//#extension GL_OES_standard_derivatives : enable\n//# define DERIVATIVES\n//#endif\n#if (__VERSION__ > 120)\n# define DERIVATIVES\n#endif\n\n// DRAW_BUFFERS => gl_FragData[] is available\n// deactivated for IE11 compat reasons\n//#ifdef GL_EXT_draw_buffers\n//#extension GL_EXT_draw_buffers : require\n//#define DRAW_BUFFERS\n//#endif\n#if (__VERSION__ > 120)\n# define DRAW_BUFFERS\n#endif\n\n// TEXTURE_LOD => texture2DLod etc are available\n#ifdef GL_EXT_shader_texture_lod\n#extension GL_EXT_shader_texture_lod : enable\n# define TEXTURE_LOD\n#define texture2DLod texture2DLodEXT\n#define texture2DProjLod texture2DProjLodEXT\n#define texture2DProjLod texture2DProjLodEXT\n#define textureCubeLod textureCubeLodEXT\n#define texture2DGrad texture2DGradEXT\n#define texture2DProjGrad texture2DProjGradEXT\n#define texture2DProjGrad texture2DProjGradEXT\n#define textureCubeGrad textureCubeGradEXT\n#endif\n#if (__VERSION__ > 120)\n# define TEXTURE_LOD\n#endif\n';
//# sourceMappingURL=platform-defines.js.map