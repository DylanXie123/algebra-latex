"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = void 0;
let stackLevelRef = null;

const debug = (...msg) => {
  if (typeof process === 'object') {
    if (process.env.TEX_DEBUG) {
      let stackLevel = new Error().stack.split('\n').length;

      if (stackLevelRef === null) {
        stackLevelRef = stackLevel;
      }

      stackLevel -= stackLevelRef;
      let stackSpacing = '';

      for (let i = 0; i < stackLevel; i++) {
        stackSpacing += '-';
      }

      console.log(stackSpacing, ...msg);
    }
  }
};

exports.debug = debug;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnZXIudHMiXSwibmFtZXMiOlsic3RhY2tMZXZlbFJlZiIsImRlYnVnIiwibXNnIiwicHJvY2VzcyIsImVudiIsIlRFWF9ERUJVRyIsInN0YWNrTGV2ZWwiLCJFcnJvciIsInN0YWNrIiwic3BsaXQiLCJsZW5ndGgiLCJzdGFja1NwYWNpbmciLCJpIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBSUEsYUFBNEIsR0FBRyxJQUFuQzs7QUFFTyxNQUFNQyxLQUFLLEdBQUcsQ0FBQyxHQUFHQyxHQUFKLEtBQWdDO0FBQ25ELE1BQUksT0FBT0MsT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUMvQixRQUFJQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsU0FBaEIsRUFBMkI7QUFDekIsVUFBSUMsVUFBVSxHQUFHLElBQUlDLEtBQUosR0FBWUMsS0FBWixDQUFtQkMsS0FBbkIsQ0FBeUIsSUFBekIsRUFBK0JDLE1BQWhEOztBQUNBLFVBQUlWLGFBQWEsS0FBSyxJQUF0QixFQUE0QjtBQUMxQkEsUUFBQUEsYUFBYSxHQUFHTSxVQUFoQjtBQUNEOztBQUNEQSxNQUFBQSxVQUFVLElBQUlOLGFBQWQ7QUFFQSxVQUFJVyxZQUFZLEdBQUcsRUFBbkI7O0FBRUEsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTixVQUFwQixFQUFnQ00sQ0FBQyxFQUFqQyxFQUFxQztBQUNuQ0QsUUFBQUEsWUFBWSxJQUFJLEdBQWhCO0FBQ0Q7O0FBRURFLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSCxZQUFaLEVBQTBCLEdBQUdULEdBQTdCO0FBQ0Q7QUFDRjtBQUNGLENBbEJNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRva2VuIGZyb20gXCIuL2xleGVycy9Ub2tlblwiXHJcblxyXG5sZXQgc3RhY2tMZXZlbFJlZjogbnVtYmVyIHwgbnVsbCA9IG51bGxcclxuXHJcbmV4cG9ydCBjb25zdCBkZWJ1ZyA9ICguLi5tc2c6IChzdHJpbmcgfCBUb2tlbilbXSkgPT4ge1xyXG4gIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcpIHtcclxuICAgIGlmIChwcm9jZXNzLmVudi5URVhfREVCVUcpIHtcclxuICAgICAgbGV0IHN0YWNrTGV2ZWwgPSBuZXcgRXJyb3IoKS5zdGFjayEuc3BsaXQoJ1xcbicpLmxlbmd0aFxyXG4gICAgICBpZiAoc3RhY2tMZXZlbFJlZiA9PT0gbnVsbCkge1xyXG4gICAgICAgIHN0YWNrTGV2ZWxSZWYgPSBzdGFja0xldmVsXHJcbiAgICAgIH1cclxuICAgICAgc3RhY2tMZXZlbCAtPSBzdGFja0xldmVsUmVmXHJcblxyXG4gICAgICBsZXQgc3RhY2tTcGFjaW5nID0gJydcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhY2tMZXZlbDsgaSsrKSB7XHJcbiAgICAgICAgc3RhY2tTcGFjaW5nICs9ICctJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhzdGFja1NwYWNpbmcsIC4uLm1zZylcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19