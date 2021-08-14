"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * An abstract class shared between lexers
 */
class Lexer {
  constructor(text) {
    _defineProperty(this, "text", void 0);

    _defineProperty(this, "pos", void 0);

    _defineProperty(this, "col", void 0);

    _defineProperty(this, "line", void 0);

    _defineProperty(this, "prev_col", void 0);

    _defineProperty(this, "prev_line", void 0);

    this.text = text;
    this.pos = 0;
    this.col = 0;
    this.line = 0;
    this.prev_col = 0;
    this.prev_line = 0;
  }

  increment(amount = 1) {
    this.pos += amount;
    this.col += amount;
  }

  error(message) {
    let line = this.text.split('\n')[this.prev_line];
    let spacing = '';

    for (let i = 0; i < this.prev_col; i++) {
      spacing += ' ';
    }

    return Error(`Lexer error\n${line}\n${spacing}^\nError at line: ${this.prev_line + 1} col: ${this.prev_col + 1}\n${message}`);
  }

  current_char() {
    return this.text.charAt(this.pos);
  }

  eat(char) {
    if (this.current_char() === char) {
      this.pos += 1;
    } else {
      throw this.error(`Expected ${char} found ${this.current_char()}`);
    }
  }

  number() {
    let num = '';
    let separator = false;

    while (this.current_char().match(/[0-9.]/)) {
      if (this.current_char() === '.') {
        if (separator) {
          break;
        } else {
          separator = true;
        }
      }

      num += this.current_char();
      this.increment();
    }

    let result = Number(num);

    if (isNaN(result)) {
      throw this.error(`Could not parse number: '${num}'`);
    }

    return {
      type: 'number',
      value: result
    };
  }

}

exports.default = Lexer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sZXhlcnMvTGV4ZXIudHMiXSwibmFtZXMiOlsiTGV4ZXIiLCJjb25zdHJ1Y3RvciIsInRleHQiLCJwb3MiLCJjb2wiLCJsaW5lIiwicHJldl9jb2wiLCJwcmV2X2xpbmUiLCJpbmNyZW1lbnQiLCJhbW91bnQiLCJlcnJvciIsIm1lc3NhZ2UiLCJzcGxpdCIsInNwYWNpbmciLCJpIiwiRXJyb3IiLCJjdXJyZW50X2NoYXIiLCJjaGFyQXQiLCJlYXQiLCJjaGFyIiwibnVtYmVyIiwibnVtIiwic2VwYXJhdG9yIiwibWF0Y2giLCJyZXN1bHQiLCJOdW1iZXIiLCJpc05hTiIsInR5cGUiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ2UsTUFBZUEsS0FBZixDQUFxQjtBQVFsQ0MsRUFBQUEsV0FBVyxDQUFDQyxJQUFELEVBQWU7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDeEIsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsR0FBTCxHQUFXLENBQVg7QUFFQSxTQUFLQyxHQUFMLEdBQVcsQ0FBWDtBQUNBLFNBQUtDLElBQUwsR0FBWSxDQUFaO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsQ0FBakI7QUFDRDs7QUFFREMsRUFBQUEsU0FBUyxDQUFDQyxNQUFNLEdBQUcsQ0FBVixFQUFhO0FBQ3BCLFNBQUtOLEdBQUwsSUFBWU0sTUFBWjtBQUNBLFNBQUtMLEdBQUwsSUFBWUssTUFBWjtBQUNEOztBQUVEQyxFQUFBQSxLQUFLLENBQUNDLE9BQUQsRUFBa0I7QUFDckIsUUFBSU4sSUFBSSxHQUFHLEtBQUtILElBQUwsQ0FBVVUsS0FBVixDQUFnQixJQUFoQixFQUFzQixLQUFLTCxTQUEzQixDQUFYO0FBQ0EsUUFBSU0sT0FBTyxHQUFHLEVBQWQ7O0FBRUEsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtSLFFBQXpCLEVBQW1DUSxDQUFDLEVBQXBDLEVBQXdDO0FBQ3RDRCxNQUFBQSxPQUFPLElBQUksR0FBWDtBQUNEOztBQUVELFdBQU9FLEtBQUssQ0FDVCxnQkFBZVYsSUFBSyxLQUFJUSxPQUFRLHFCQUFvQixLQUFLTixTQUFMLEdBQ25ELENBQUUsU0FBUSxLQUFLRCxRQUFMLEdBQWdCLENBQUUsS0FBSUssT0FBUSxFQUZoQyxDQUFaO0FBSUQ7O0FBRURLLEVBQUFBLFlBQVksR0FBRztBQUNiLFdBQU8sS0FBS2QsSUFBTCxDQUFVZSxNQUFWLENBQWlCLEtBQUtkLEdBQXRCLENBQVA7QUFDRDs7QUFFRGUsRUFBQUEsR0FBRyxDQUFDQyxJQUFELEVBQWU7QUFDaEIsUUFBSSxLQUFLSCxZQUFMLE9BQXdCRyxJQUE1QixFQUFrQztBQUNoQyxXQUFLaEIsR0FBTCxJQUFZLENBQVo7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNLEtBQUtPLEtBQUwsQ0FBWSxZQUFXUyxJQUFLLFVBQVMsS0FBS0gsWUFBTCxFQUFvQixFQUF6RCxDQUFOO0FBQ0Q7QUFDRjs7QUFFREksRUFBQUEsTUFBTSxHQUFhO0FBQ2pCLFFBQUlDLEdBQUcsR0FBRyxFQUFWO0FBQ0EsUUFBSUMsU0FBUyxHQUFHLEtBQWhCOztBQUVBLFdBQU8sS0FBS04sWUFBTCxHQUFvQk8sS0FBcEIsQ0FBMEIsUUFBMUIsQ0FBUCxFQUE0QztBQUMxQyxVQUFJLEtBQUtQLFlBQUwsT0FBd0IsR0FBNUIsRUFBaUM7QUFDL0IsWUFBSU0sU0FBSixFQUFlO0FBQ2I7QUFDRCxTQUZELE1BRU87QUFDTEEsVUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDRDtBQUNGOztBQUVERCxNQUFBQSxHQUFHLElBQUksS0FBS0wsWUFBTCxFQUFQO0FBQ0EsV0FBS1IsU0FBTDtBQUNEOztBQUVELFFBQUlnQixNQUFNLEdBQUdDLE1BQU0sQ0FBQ0osR0FBRCxDQUFuQjs7QUFDQSxRQUFJSyxLQUFLLENBQUNGLE1BQUQsQ0FBVCxFQUFtQjtBQUNqQixZQUFNLEtBQUtkLEtBQUwsQ0FBWSw0QkFBMkJXLEdBQUksR0FBM0MsQ0FBTjtBQUNEOztBQUVELFdBQU87QUFDTE0sTUFBQUEsSUFBSSxFQUFFLFFBREQ7QUFFTEMsTUFBQUEsS0FBSyxFQUFFSjtBQUZGLEtBQVA7QUFJRDs7QUEzRWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRva2VuLCB7IFZhbFRva2VuIH0gZnJvbSBcIi4vVG9rZW5cIlxyXG5cclxuLyoqXHJcbiAqIEFuIGFic3RyYWN0IGNsYXNzIHNoYXJlZCBiZXR3ZWVuIGxleGVyc1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgTGV4ZXIge1xyXG4gIHRleHQ6IHN0cmluZ1xyXG4gIHBvczogbnVtYmVyXHJcbiAgY29sOiBudW1iZXJcclxuICBsaW5lOiBudW1iZXJcclxuICBwcmV2X2NvbDogbnVtYmVyXHJcbiAgcHJldl9saW5lOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnRleHQgPSB0ZXh0XHJcbiAgICB0aGlzLnBvcyA9IDBcclxuXHJcbiAgICB0aGlzLmNvbCA9IDBcclxuICAgIHRoaXMubGluZSA9IDBcclxuICAgIHRoaXMucHJldl9jb2wgPSAwXHJcbiAgICB0aGlzLnByZXZfbGluZSA9IDBcclxuICB9XHJcblxyXG4gIGluY3JlbWVudChhbW91bnQgPSAxKSB7XHJcbiAgICB0aGlzLnBvcyArPSBhbW91bnRcclxuICAgIHRoaXMuY29sICs9IGFtb3VudFxyXG4gIH1cclxuXHJcbiAgZXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgbGluZSA9IHRoaXMudGV4dC5zcGxpdCgnXFxuJylbdGhpcy5wcmV2X2xpbmVdXHJcbiAgICBsZXQgc3BhY2luZyA9ICcnXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByZXZfY29sOyBpKyspIHtcclxuICAgICAgc3BhY2luZyArPSAnICdcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gRXJyb3IoXHJcbiAgICAgIGBMZXhlciBlcnJvclxcbiR7bGluZX1cXG4ke3NwYWNpbmd9XlxcbkVycm9yIGF0IGxpbmU6ICR7dGhpcy5wcmV2X2xpbmUgK1xyXG4gICAgICAgIDF9IGNvbDogJHt0aGlzLnByZXZfY29sICsgMX1cXG4ke21lc3NhZ2V9YFxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgY3VycmVudF9jaGFyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dC5jaGFyQXQodGhpcy5wb3MpXHJcbiAgfVxyXG5cclxuICBlYXQoY2hhcjogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50X2NoYXIoKSA9PT0gY2hhcikge1xyXG4gICAgICB0aGlzLnBvcyArPSAxXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyB0aGlzLmVycm9yKGBFeHBlY3RlZCAke2NoYXJ9IGZvdW5kICR7dGhpcy5jdXJyZW50X2NoYXIoKX1gKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbnVtYmVyKCk6IFZhbFRva2VuIHtcclxuICAgIGxldCBudW0gPSAnJ1xyXG4gICAgbGV0IHNlcGFyYXRvciA9IGZhbHNlXHJcblxyXG4gICAgd2hpbGUgKHRoaXMuY3VycmVudF9jaGFyKCkubWF0Y2goL1swLTkuXS8pKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRfY2hhcigpID09PSAnLicpIHtcclxuICAgICAgICBpZiAoc2VwYXJhdG9yKSB7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXBhcmF0b3IgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBudW0gKz0gdGhpcy5jdXJyZW50X2NoYXIoKVxyXG4gICAgICB0aGlzLmluY3JlbWVudCgpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IE51bWJlcihudW0pXHJcbiAgICBpZiAoaXNOYU4ocmVzdWx0KSkge1xyXG4gICAgICB0aHJvdyB0aGlzLmVycm9yKGBDb3VsZCBub3QgcGFyc2UgbnVtYmVyOiAnJHtudW19J2ApXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgIHZhbHVlOiByZXN1bHQsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhYnN0cmFjdCBuZXh0X3Rva2VuKCkgOiBUb2tlblxyXG59XHJcbiJdfQ==