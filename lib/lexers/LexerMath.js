"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Lexer = _interopRequireDefault(require("./Lexer"));

var _functions = _interopRequireDefault(require("../models/functions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LatexLexer extends _Lexer.default {
  constructor(mathString) {
    super(mathString);
  }

  next_token() {
    this.prev_col = this.col;
    this.prev_line = this.line;

    if (this.pos >= this.text.length) {
      return {
        type: 'EOF'
      };
    }

    if (this.current_char() === '\n') {
      this.col = 0;
      this.line++;
    }

    const blank_chars = [' ', '\n'];

    for (let blank of blank_chars) {
      if (this.text.startsWith(blank, this.pos)) {
        this.increment(blank.length);
        return this.next_token();
      }
    }

    if (this.current_char().match(/[0-9]/)) {
      return this.number();
    }

    if (this.current_char().match(/[a-zA-Z]/)) {
      return this.alphabetic();
    }

    if (this.current_char() === '(') {
      this.increment();
      return {
        type: 'bracket',
        open: true,
        value: '('
      };
    }

    if (this.current_char() === ')') {
      this.increment();
      return {
        type: 'bracket',
        open: false,
        value: ')'
      };
    }

    if (this.current_char() === '+') {
      this.increment();
      return {
        type: 'operator',
        value: 'plus'
      };
    }

    if (this.current_char() === '-') {
      this.increment();
      return {
        type: 'operator',
        value: 'minus'
      };
    }

    if (this.current_char() === '*') {
      this.increment();
      return {
        type: 'operator',
        value: 'multiply'
      };
    }

    if (this.current_char() === '/') {
      this.increment();
      return {
        type: 'operator',
        value: 'divide'
      };
    }

    if (this.current_char() === '^') {
      this.increment();
      return {
        type: 'operator',
        value: 'exponent'
      };
    }

    if (this.current_char() === '=') {
      this.increment();
      return {
        type: 'equal'
      };
    }

    if (this.current_char() === '_') {
      this.increment();
      return {
        type: 'underscore'
      };
    }

    throw this.error('Unknown symbol: ' + this.current_char());
  } // Token contains string of alphabetic characters


  alphabetic() {
    let token = '';

    while (this.current_char().match(/[a-zA-Z]/) && this.pos <= this.text.length) {
      token += this.current_char();
      this.increment();
    }

    if (_functions.default.includes(token)) {
      return {
        type: 'keyword',
        value: token
      };
    }

    return {
      type: 'variable',
      value: token
    };
  }

}

exports.default = LatexLexer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sZXhlcnMvTGV4ZXJNYXRoLnRzIl0sIm5hbWVzIjpbIkxhdGV4TGV4ZXIiLCJMZXhlciIsImNvbnN0cnVjdG9yIiwibWF0aFN0cmluZyIsIm5leHRfdG9rZW4iLCJwcmV2X2NvbCIsImNvbCIsInByZXZfbGluZSIsImxpbmUiLCJwb3MiLCJ0ZXh0IiwibGVuZ3RoIiwidHlwZSIsImN1cnJlbnRfY2hhciIsImJsYW5rX2NoYXJzIiwiYmxhbmsiLCJzdGFydHNXaXRoIiwiaW5jcmVtZW50IiwibWF0Y2giLCJudW1iZXIiLCJhbHBoYWJldGljIiwib3BlbiIsInZhbHVlIiwiZXJyb3IiLCJ0b2tlbiIsImZ1bmN0aW9ucyIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFHZSxNQUFNQSxVQUFOLFNBQXlCQyxjQUF6QixDQUErQjtBQUM1Q0MsRUFBQUEsV0FBVyxDQUFDQyxVQUFELEVBQXFCO0FBQzlCLFVBQU1BLFVBQU47QUFDRDs7QUFFREMsRUFBQUEsVUFBVSxHQUFVO0FBQ2xCLFNBQUtDLFFBQUwsR0FBZ0IsS0FBS0MsR0FBckI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEtBQUtDLElBQXRCOztBQUVBLFFBQUksS0FBS0MsR0FBTCxJQUFZLEtBQUtDLElBQUwsQ0FBVUMsTUFBMUIsRUFBa0M7QUFDaEMsYUFBTztBQUFFQyxRQUFBQSxJQUFJLEVBQUU7QUFBUixPQUFQO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLQyxZQUFMLE9BQXdCLElBQTVCLEVBQWtDO0FBQ2hDLFdBQUtQLEdBQUwsR0FBVyxDQUFYO0FBQ0EsV0FBS0UsSUFBTDtBQUNEOztBQUVELFVBQU1NLFdBQVcsR0FBRyxDQUFDLEdBQUQsRUFBTSxJQUFOLENBQXBCOztBQUVBLFNBQUssSUFBSUMsS0FBVCxJQUFrQkQsV0FBbEIsRUFBK0I7QUFDN0IsVUFBSSxLQUFLSixJQUFMLENBQVVNLFVBQVYsQ0FBcUJELEtBQXJCLEVBQTRCLEtBQUtOLEdBQWpD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YUFBTztBQUNMWixRQUFBQSxJQUFJLEVBQUUsU0FERDtBQUVMVSxRQUFBQSxLQUFLLEVBQUVFO0FBRkYsT0FBUDtBQUlEOztBQUVELFdBQU87QUFDTFosTUFBQUEsSUFBSSxFQUFFLFVBREQ7QUFFTFUsTUFBQUEsS0FBSyxFQUFFRTtBQUZGLEtBQVA7QUFJRDs7QUF6RzJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExleGVyIGZyb20gJy4vTGV4ZXInXHJcbmltcG9ydCBmdW5jdGlvbnMgZnJvbSAnLi4vbW9kZWxzL2Z1bmN0aW9ucydcclxuaW1wb3J0IFRva2VuIGZyb20gJy4vVG9rZW4nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleExleGVyIGV4dGVuZHMgTGV4ZXIge1xyXG4gIGNvbnN0cnVjdG9yKG1hdGhTdHJpbmc6IHN0cmluZykge1xyXG4gICAgc3VwZXIobWF0aFN0cmluZylcclxuICB9XHJcblxyXG4gIG5leHRfdG9rZW4oKTogVG9rZW4ge1xyXG4gICAgdGhpcy5wcmV2X2NvbCA9IHRoaXMuY29sXHJcbiAgICB0aGlzLnByZXZfbGluZSA9IHRoaXMubGluZVxyXG5cclxuICAgIGlmICh0aGlzLnBvcyA+PSB0aGlzLnRleHQubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdFT0YnIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJ1xcbicpIHtcclxuICAgICAgdGhpcy5jb2wgPSAwXHJcbiAgICAgIHRoaXMubGluZSsrXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYmxhbmtfY2hhcnMgPSBbJyAnLCAnXFxuJ11cclxuXHJcbiAgICBmb3IgKGxldCBibGFuayBvZiBibGFua19jaGFycykge1xyXG4gICAgICBpZiAodGhpcy50ZXh0LnN0YXJ0c1dpdGgoYmxhbmssIHRoaXMucG9zKSkge1xyXG4gICAgICAgIHRoaXMuaW5jcmVtZW50KGJsYW5rLmxlbmd0aClcclxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0X3Rva2VuKClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpLm1hdGNoKC9bMC05XS8pKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm51bWJlcigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkubWF0Y2goL1thLXpBLVpdLykpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYWxwaGFiZXRpYygpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICcoJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdicmFja2V0Jywgb3BlbjogdHJ1ZSwgdmFsdWU6ICcoJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICcpJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdicmFja2V0Jywgb3BlbjogZmFsc2UsIHZhbHVlOiAnKScgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpID09PSAnKycpIHtcclxuICAgICAgdGhpcy5pbmNyZW1lbnQoKVxyXG4gICAgICByZXR1cm4geyB0eXBlOiAnb3BlcmF0b3InLCB2YWx1ZTogJ3BsdXMnIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJy0nKSB7XHJcbiAgICAgIHRoaXMuaW5jcmVtZW50KClcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ29wZXJhdG9yJywgdmFsdWU6ICdtaW51cycgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpID09PSAnKicpIHtcclxuICAgICAgdGhpcy5pbmNyZW1lbnQoKVxyXG4gICAgICByZXR1cm4geyB0eXBlOiAnb3BlcmF0b3InLCB2YWx1ZTogJ211bHRpcGx5JyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICcvJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdvcGVyYXRvcicsIHZhbHVlOiAnZGl2aWRlJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICdeJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdvcGVyYXRvcicsIHZhbHVlOiAnZXhwb25lbnQnIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJz0nKSB7XHJcbiAgICAgIHRoaXMuaW5jcmVtZW50KClcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ2VxdWFsJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICdfJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICd1bmRlcnNjb3JlJyB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhyb3cgdGhpcy5lcnJvcignVW5rbm93biBzeW1ib2w6ICcgKyB0aGlzLmN1cnJlbnRfY2hhcigpKVxyXG4gIH1cclxuXHJcbiAgLy8gVG9rZW4gY29udGFpbnMgc3RyaW5nIG9mIGFscGhhYmV0aWMgY2hhcmFjdGVyc1xyXG4gIGFscGhhYmV0aWMoKTogVG9rZW4ge1xyXG4gICAgbGV0IHRva2VuID0gJydcclxuICAgIHdoaWxlIChcclxuICAgICAgdGhpcy5jdXJyZW50X2NoYXIoKS5tYXRjaCgvW2EtekEtWl0vKSAmJlxyXG4gICAgICB0aGlzLnBvcyA8PSB0aGlzLnRleHQubGVuZ3RoXHJcbiAgICApIHtcclxuICAgICAgdG9rZW4gKz0gdGhpcy5jdXJyZW50X2NoYXIoKVxyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZ1bmN0aW9ucy5pbmNsdWRlcyh0b2tlbikpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAna2V5d29yZCcsXHJcbiAgICAgICAgdmFsdWU6IHRva2VuLFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ3ZhcmlhYmxlJyxcclxuICAgICAgdmFsdWU6IHRva2VuLFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=