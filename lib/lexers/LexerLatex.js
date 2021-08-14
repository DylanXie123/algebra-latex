"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Lexer = _interopRequireDefault(require("./Lexer"));

var _greekLetters = _interopRequireDefault(require("../models/greek-letters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LatexLexer extends _Lexer.default {
  constructor(latex) {
    super(latex);
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

    const blank_chars = [' ', '\n', '\\ ', '\\!', '&', '\\,', '\\:', '\\;', '\\quad', '\\qquad'];

    for (let blank of blank_chars) {
      if (this.text.startsWith(blank, this.pos)) {
        this.increment(blank.length);
        return this.next_token();
      }
    }

    if (this.current_char() === '\\') {
      return this.keyword();
    }

    if (this.current_char().match(/[0-9]/)) {
      return this.number();
    }

    if (this.current_char().match(/[a-zA-Z]/)) {
      return this.variable();
    }

    if (this.current_char() === '{') {
      this.increment();
      return {
        type: 'bracket',
        open: true,
        value: '{'
      };
    }

    if (this.current_char() === '}') {
      this.increment();
      return {
        type: 'bracket',
        open: false,
        value: '}'
      };
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

    if (this.current_char() === '[') {
      this.increment();
      return {
        type: 'bracket',
        open: true,
        value: '['
      };
    }

    if (this.current_char() === ']') {
      this.increment();
      return {
        type: 'bracket',
        open: false,
        value: ']'
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
  }

  keyword() {
    this.eat('\\');
    let variable = this.variable();

    if (variable.value === 'cdot' || variable.value === 'times') {
      return {
        type: 'operator',
        value: 'multiply'
      };
    }

    if (variable.value === 'mod') {
      return {
        type: 'operator',
        value: 'modulus'
      };
    }

    if (variable.value === 'left') {
      let bracket = this.next_token();

      if (bracket.type !== 'bracket' || bracket.open !== true) {
        throw this.error('Expected opening bracket found ' + JSON.stringify(bracket));
      }

      return bracket;
    }

    if (variable.value === 'right') {
      let bracket = this.next_token();

      if (bracket.type !== 'bracket' || bracket.open !== false) {
        throw this.error('Expected closing bracket found ' + JSON.stringify(bracket));
      }

      return bracket;
    }

    if (_greekLetters.default.map(x => x.name).includes(variable.value.toLowerCase())) {
      return {
        type: 'variable',
        value: variable.value
      };
    }

    return {
      type: 'keyword',
      value: variable.value
    };
  }

  variable() {
    let token = '';

    while (this.current_char().match(/[a-zA-Z]/) && this.pos <= this.text.length) {
      token += this.current_char();
      this.increment();
    }

    return {
      type: 'variable',
      value: token
    };
  }

}

exports.default = LatexLexer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sZXhlcnMvTGV4ZXJMYXRleC50cyJdLCJuYW1lcyI6WyJMYXRleExleGVyIiwiTGV4ZXIiLCJjb25zdHJ1Y3RvciIsImxhdGV4IiwibmV4dF90b2tlbiIsInByZXZfY29sIiwiY29sIiwicHJldl9saW5lIiwibGluZSIsInBvcyIsInRleHQiLCJsZW5ndGgiLCJ0eXBlIiwiY3VycmVudF9jaGFyIiwiYmxhbmtfY2hhcnMiLCJibGFuayIsInN0YXJ0c1dpdGgiLCJpbmNyZW1lbnQiLCJrZXl3b3JkIiwibWF0Y2giLCJudW1iZXIiLCJ2YXJpYWJsZSIsIm9wZW4iLCJ2YWx1ZSIsImVycm9yIiwiZWF0IiwiYnJhY2tldCIsIkpTT04iLCJzdHJpbmdpZnkiLCJncmVla0xldHRlcnMiLCJtYXAiLCJ4IiwibmFtZSIsImluY2x1ZGVzIiwidG9Mb3dlckNhc2UiLCJ0b2tlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBR2UsTUFBTUEsVUFBTixTQUF5QkMsY0FBekIsQ0FBK0I7QUFDNUNDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFnQjtBQUN6QixVQUFNQSxLQUFOO0FBQ0Q7O0FBRURDLEVBQUFBLFVBQVUsR0FBVTtBQUNsQixTQUFLQyxRQUFMLEdBQWdCLEtBQUtDLEdBQXJCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixLQUFLQyxJQUF0Qjs7QUFFQSxRQUFJLEtBQUtDLEdBQUwsSUFBWSxLQUFLQyxJQUFMLENBQVVDLE1BQTFCLEVBQWtDO0FBQ2hDLGFBQU87QUFBRUMsUUFBQUEsSUFBSSxFQUFFO0FBQVIsT0FBUDtBQUNEOztBQUVELFFBQUksS0FBS0MsWUFBTCxPQUF3QixJQUE1QixFQUFrQztBQUNoQyxXQUFLUCxHQUFMLEdBQVcsQ0FBWDtBQUNBLFdBQUtFLElBQUw7QUFDRDs7QUFFRCxVQUFNTSxXQUFXLEdBQUcsQ0FDbEIsR0FEa0IsRUFFbEIsSUFGa0IsRUFHbEIsS0FIa0IsRUFJbEIsS0FKa0IsRUFLbEIsR0FM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LENBQUNFO0FBRlgsS0FBUDtBQUlEOztBQUVERixFQUFBQSxRQUFRLEdBQWE7QUFDbkIsUUFBSWMsS0FBSyxHQUFHLEVBQVo7O0FBQ0EsV0FDRSxLQUFLdEIsWUFBTCxHQUFvQk0sS0FBcEIsQ0FBMEIsVUFBMUIsS0FDQSxLQUFLVixHQUFMLElBQVksS0FBS0MsSUFBTCxDQUFVQyxNQUZ4QixFQUdFO0FBQ0F3QixNQUFBQSxLQUFLLElBQUksS0FBS3RCLFlBQUwsRUFBVDtBQUNBLFdBQUtJLFNBQUw7QUFDRDs7QUFFRCxXQUFPO0FBQ0xMLE1BQUFBLElBQUksRUFBRSxVQUREO0FBRUxXLE1BQUFBLEtBQUssRUFBRVk7QUFGRixLQUFQO0FBSUQ7O0FBL0syQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMZXhlciBmcm9tICcuL0xleGVyJ1xyXG5pbXBvcnQgZ3JlZWtMZXR0ZXJzIGZyb20gJy4uL21vZGVscy9ncmVlay1sZXR0ZXJzJ1xyXG5pbXBvcnQgVG9rZW4sIHsgVmFsVG9rZW4gfSBmcm9tICcuL1Rva2VuJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF0ZXhMZXhlciBleHRlbmRzIExleGVyIHtcclxuICBjb25zdHJ1Y3RvcihsYXRleDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihsYXRleClcclxuICB9XHJcblxyXG4gIG5leHRfdG9rZW4oKTogVG9rZW4ge1xyXG4gICAgdGhpcy5wcmV2X2NvbCA9IHRoaXMuY29sXHJcbiAgICB0aGlzLnByZXZfbGluZSA9IHRoaXMubGluZVxyXG5cclxuICAgIGlmICh0aGlzLnBvcyA+PSB0aGlzLnRleHQubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdFT0YnIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJ1xcbicpIHtcclxuICAgICAgdGhpcy5jb2wgPSAwXHJcbiAgICAgIHRoaXMubGluZSsrXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYmxhbmtfY2hhcnMgPSBbXHJcbiAgICAgICcgJyxcclxuICAgICAgJ1xcbicsXHJcbiAgICAgICdcXFxcICcsXHJcbiAgICAgICdcXFxcIScsXHJcbiAgICAgICcmJyxcclxuICAgICAgJ1xcXFwsJyxcclxuICAgICAgJ1xcXFw6JyxcclxuICAgICAgJ1xcXFw7JyxcclxuICAgICAgJ1xcXFxxdWFkJyxcclxuICAgICAgJ1xcXFxxcXVhZCcsXHJcbiAgICBdXHJcblxyXG4gICAgZm9yIChsZXQgYmxhbmsgb2YgYmxhbmtfY2hhcnMpIHtcclxuICAgICAgaWYgKHRoaXMudGV4dC5zdGFydHNXaXRoKGJsYW5rLCB0aGlzLnBvcykpIHtcclxuICAgICAgICB0aGlzLmluY3JlbWVudChibGFuay5sZW5ndGgpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dF90b2tlbigpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJ1xcXFwnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmtleXdvcmQoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpLm1hdGNoKC9bMC05XS8pKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm51bWJlcigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkubWF0Y2goL1thLXpBLVpdLykpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGUoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpID09PSAneycpIHtcclxuICAgICAgdGhpcy5pbmNyZW1lbnQoKVxyXG4gICAgICByZXR1cm4geyB0eXBlOiAnYnJhY2tldCcsIG9wZW46IHRydWUsIHZhbHVlOiAneycgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpID09PSAnfScpIHtcclxuICAgICAgdGhpcy5pbmNyZW1lbnQoKVxyXG4gICAgICByZXR1cm4geyB0eXBlOiAnYnJhY2tldCcsIG9wZW46IGZhbHNlLCB2YWx1ZTogJ30nIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJygnKSB7XHJcbiAgICAgIHRoaXMuaW5jcmVtZW50KClcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ2JyYWNrZXQnLCBvcGVuOiB0cnVlLCB2YWx1ZTogJygnIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJyknKSB7XHJcbiAgICAgIHRoaXMuaW5jcmVtZW50KClcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ2JyYWNrZXQnLCBvcGVuOiBmYWxzZSwgdmFsdWU6ICcpJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICdbJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdicmFja2V0Jywgb3BlbjogdHJ1ZSwgdmFsdWU6ICdbJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICddJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdicmFja2V0Jywgb3BlbjogZmFsc2UsIHZhbHVlOiAnXScgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpID09PSAnKycpIHtcclxuICAgICAgdGhpcy5pbmNyZW1lbnQoKVxyXG4gICAgICByZXR1cm4geyB0eXBlOiAnb3BlcmF0b3InLCB2YWx1ZTogJ3BsdXMnIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJy0nKSB7XHJcbiAgICAgIHRoaXMuaW5jcmVtZW50KClcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ29wZXJhdG9yJywgdmFsdWU6ICdtaW51cycgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpID09PSAnKicpIHtcclxuICAgICAgdGhpcy5pbmNyZW1lbnQoKVxyXG4gICAgICByZXR1cm4geyB0eXBlOiAnb3BlcmF0b3InLCB2YWx1ZTogJ211bHRpcGx5JyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICcvJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdvcGVyYXRvcicsIHZhbHVlOiAnZGl2aWRlJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICdeJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdvcGVyYXRvcicsIHZhbHVlOiAnZXhwb25lbnQnIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gJz0nKSB7XHJcbiAgICAgIHRoaXMuaW5jcmVtZW50KClcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ2VxdWFsJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudF9jaGFyKCkgPT09ICdfJykge1xyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICd1bmRlcnNjb3JlJyB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhyb3cgdGhpcy5lcnJvcignVW5rbm93biBzeW1ib2w6ICcgKyB0aGlzLmN1cnJlbnRfY2hhcigpKVxyXG4gIH1cclxuXHJcbiAga2V5d29yZCgpOiBUb2tlbiB7XHJcbiAgICB0aGlzLmVhdCgnXFxcXCcpXHJcblxyXG4gICAgbGV0IHZhcmlhYmxlID0gdGhpcy52YXJpYWJsZSgpXHJcblxyXG4gICAgaWYgKHZhcmlhYmxlLnZhbHVlID09PSAnY2RvdCcgfHwgdmFyaWFibGUudmFsdWUgPT09ICd0aW1lcycpIHtcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ29wZXJhdG9yJywgdmFsdWU6ICdtdWx0aXBseScgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YXJpYWJsZS52YWx1ZSA9PT0gJ21vZCcpIHtcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ29wZXJhdG9yJywgdmFsdWU6ICdtb2R1bHVzJyB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhcmlhYmxlLnZhbHVlID09PSAnbGVmdCcpIHtcclxuICAgICAgbGV0IGJyYWNrZXQgPSB0aGlzLm5leHRfdG9rZW4oKVxyXG5cclxuICAgICAgaWYgKGJyYWNrZXQudHlwZSAhPT0gJ2JyYWNrZXQnIHx8IGJyYWNrZXQub3BlbiAhPT0gdHJ1ZSkge1xyXG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IoJ0V4cGVjdGVkIG9wZW5pbmcgYnJhY2tldCBmb3VuZCAnICsgSlNPTi5zdHJpbmdpZnkoYnJhY2tldCkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBicmFja2V0XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhcmlhYmxlLnZhbHVlID09PSAncmlnaHQnKSB7XHJcbiAgICAgIGxldCBicmFja2V0ID0gdGhpcy5uZXh0X3Rva2VuKClcclxuXHJcbiAgICAgIGlmIChicmFja2V0LnR5cGUgIT09ICdicmFja2V0JyB8fCBicmFja2V0Lm9wZW4gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcignRXhwZWN0ZWQgY2xvc2luZyBicmFja2V0IGZvdW5kICcgKyBKU09OLnN0cmluZ2lmeShicmFja2V0KSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGJyYWNrZXRcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZ3JlZWtMZXR0ZXJzLm1hcCh4ID0+IHgubmFtZSkuaW5jbHVkZXMoKHZhcmlhYmxlLnZhbHVlIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ3ZhcmlhYmxlJywgdmFsdWU6IHZhcmlhYmxlLnZhbHVlIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAna2V5d29yZCcsXHJcbiAgICAgIHZhbHVlOiB2YXJpYWJsZS52YWx1ZSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhcmlhYmxlKCk6IFZhbFRva2VuIHtcclxuICAgIGxldCB0b2tlbiA9ICcnXHJcbiAgICB3aGlsZSAoXHJcbiAgICAgIHRoaXMuY3VycmVudF9jaGFyKCkubWF0Y2goL1thLXpBLVpdLykgJiZcclxuICAgICAgdGhpcy5wb3MgPD0gdGhpcy50ZXh0Lmxlbmd0aFxyXG4gICAgKSB7XHJcbiAgICAgIHRva2VuICs9IHRoaXMuY3VycmVudF9jaGFyKClcclxuICAgICAgdGhpcy5pbmNyZW1lbnQoKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICd2YXJpYWJsZScsXHJcbiAgICAgIHZhbHVlOiB0b2tlbixcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19