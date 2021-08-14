"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Parser = _interopRequireDefault(require("./Parser"));

var _FormatterMath = _interopRequireDefault(require("./formatters/FormatterMath"));

var _FormatterLatex = _interopRequireDefault(require("./formatters/FormatterLatex"));

var _LexerLatex = _interopRequireDefault(require("./lexers/LexerLatex"));

var _LexerMath = _interopRequireDefault(require("./lexers/LexerMath"));

var _FormatterNerdamer = _interopRequireDefault(require("./formatters/FormatterNerdamer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A class for parsing latex math
 */
class AlgebraLatex {
  /**
   * Create an AlgebraLatex object, to be converted
   * The latex paremeter was removed as of v2.0, use parseLatex()
   * @param options the options to provide to the library
   * @return {AlgebraLatex} object to be converted
   */
  constructor(options = {}) {
    _defineProperty(this, "options", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "parser", void 0);

    this.options = options;
  }

  parseLatex(latex) {
    // Replace , with . for european decimal separators
    latex = latex.replace(/,/g, '.');
    this.input = latex;
    this.parser = new _Parser.default(latex, _LexerLatex.default, this.options);
    this.parser.parse();
    return this;
  }

  parseMath(math) {
    // Replace , with . for european decimal separators
    math = math.replace(/,/g, '.');
    this.input = math;
    this.parser = new _Parser.default(math, _LexerMath.default, this.options);
    this.parser.parse();
    return this;
  }

  getAst() {
    switch (this.parser.ast) {
      case null:
        throw Error('Call parse first');

      case '':
        return '';

      default:
        return this.parser.ast;
    }
  }
  /**
   * Will return a serialized string eg. 2*(3+4)/(sqrt(5))-8
   * @return string The serialized string
   */


  toMath() {
    if (this.getAst() === '') {
      return '';
    } else {
      return new _FormatterMath.default(this.getAst()).format();
    }
  }
  /**
   * Will return a formatted latex string eg. \frac{1}{\sqrt{2}}
   * @return string The formatted latex string
   */


  toLatex() {
    if (this.getAst() === '') {
      return '';
    } else {
      return new _FormatterLatex.default(this.getAst()).format();
    }
  }
  /**
   * Will return a nerdamer object
   * @return nerdamer object
   */


  toNerdamer() {
    if (this.getAst() === '') {
      return '';
    } else {
      return new _FormatterNerdamer.default(this.getAst()).getExpression();
    }
  } // /**
  //  * @deprecated toLatex() should be used instead
  //  */
  // toTex() {
  //   return self.toLatex()
  // }
  // /**
  //  * Will return an algebra.js Expression or Equation
  //  * @param {Object} algebraJS an instance of algebra.js
  //  * @return {(Expression|Equation)} an Expression or Equation
  //  */
  // toAlgebra(algebraJS) {
  //   if (algebraJS === null) {
  //     throw new Error('Algebra.js must be passed as a parameter for toAlgebra')
  //   }
  //   let mathToParse = this.toMath()
  //   mathToParse = greekLetters.convertSymbols(mathToParse)
  //   return algebraJS.parse(mathToParse)
  // }
  // /**
  //  * Will return an algebrite object
  //  * @param {Object} algebrite an instance of algebrite
  //  * @return {Object} an algebrite object
  //  */
  // toAlgebrite(algebrite) {
  //   if (algebrite === null) {
  //     return new Error(
  //       'Algebrite must be passed as a parameter for toAlgebrite'
  //     )
  //   }
  //   if (this.isEquation()) {
  //     return new Error('Algebrite can not handle equations, only expressions')
  //   }
  //   let mathToParse = this.toMath()
  //   mathToParse = greekLetters.convertSymbols(mathToParse)
  //   return algebrite.eval(mathToParse)
  // }
  // /**
  //  * Will return a coffequate object
  //  * @return {Object} a coffeequate object
  //  */
  // toCoffeequate(coffeequate) {
  //   if (coffeequate === null) {
  //     return new Error(
  //       'Coffeequante must be passed as a parameter for toCoffeequante'
  //     )
  //   }
  //   let result = this.toMath()
  //   result = result.replace(/\^/g, '**')
  //   return coffeequate(result)
  // }

  /**
   * Wether or not the object is an equation or an expression
   * @return Boolean true if expression
   */


  isEquation() {
    return this.input.includes('=');
  }

}

var _default = AlgebraLatex;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJBbGdlYnJhTGF0ZXgiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJwYXJzZUxhdGV4IiwibGF0ZXgiLCJyZXBsYWNlIiwiaW5wdXQiLCJwYXJzZXIiLCJQYXJzZXIiLCJMYXRleExleGVyIiwicGFyc2UiLCJwYXJzZU1hdGgiLCJtYXRoIiwiTWF0aExleGVyIiwiZ2V0QXN0IiwiYXN0IiwiRXJyb3IiLCJ0b01hdGgiLCJNYXRoRm9ybWF0dGVyIiwiZm9ybWF0IiwidG9MYXRleCIsIkxhdGV4Rm9ybWF0dGVyIiwidG9OZXJkYW1lciIsIk5lcmRhbWVyRm9ybWF0dGVyIiwiZ2V0RXhwcmVzc2lvbiIsImlzRXF1YXRpb24iLCJpbmNsdWRlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxZQUFOLENBQW1CO0FBSWpCO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFQyxFQUFBQSxXQUFXLENBQUNDLE9BQU8sR0FBRyxFQUFYLEVBQWU7QUFBQTs7QUFBQTs7QUFBQTs7QUFDeEIsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7O0FBRURDLEVBQUFBLFVBQVUsQ0FBQ0MsS0FBRCxFQUFnQjtBQUN4QjtBQUNBQSxJQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ0MsT0FBTixDQUFjLElBQWQsRUFBb0IsR0FBcEIsQ0FBUjtBQUVBLFNBQUtDLEtBQUwsR0FBYUYsS0FBYjtBQUNBLFNBQUtHLE1BQUwsR0FBYyxJQUFJQyxlQUFKLENBQVdKLEtBQVgsRUFBa0JLLG1CQUFsQixFQUE4QixLQUFLUCxPQUFuQyxDQUFkO0FBQ0EsU0FBS0ssTUFBTCxDQUFZRyxLQUFaO0FBRUEsV0FBTyxJQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLFNBQVMsQ0FBQ0MsSUFBRCxFQUFlO0FBQ3RCO0FBQ0FBLElBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDUCxPQUFMLENBQWEsSUFBYixFQUFtQixHQUFuQixDQUFQO0FBRUEsU0FBS0MsS0FBTCxHQUFhTSxJQUFiO0FBQ0EsU0FBS0wsTUFBTCxHQUFjLElBQUlDLGVBQUosQ0FBV0ksSUFBWCxFQUFpQkMsa0JBQWpCLEVBQTRCLEtBQUtYLE9BQWpDLENBQWQ7QUFDQSxTQUFLSyxNQUFMLENBQVlHLEtBQVo7QUFFQSxXQUFPLElBQVA7QUFDRDs7QUFFREksRUFBQUEsTUFBTSxHQUFHO0FBQ1AsWUFBUSxLQUFLUCxNQUFMLENBQVlRLEdBQXBCO0FBQ0UsV0FBSyxJQUFMO0FBQ0UsY0FBTUMsS0FBSyxDQUFDLGtCQUFELENBQVg7O0FBQ0YsV0FBSyxFQUFMO0FBQ0UsZUFBTyxFQUFQOztBQUNGO0FBQ0UsZUFBTyxLQUFLVCxNQUFMLENBQVlRLEdBQW5CO0FBTko7QUFRRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDRUUsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsUUFBSSxLQUFLSCxNQUFMLE9BQWtCLEVBQXRCLEVBQTBCO0FBQ3hCLGFBQU8sRUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sSUFBSUksc0JBQUosQ0FBa0IsS0FBS0osTUFBTCxFQUFsQixFQUF3Q0ssTUFBeEMsRUFBUDtBQUNEO0FBQ0Y7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O0FBQ0VDLEVBQUFBLE9BQU8sR0FBRztBQUNSLFFBQUksS0FBS04sTUFBTCxPQUFrQixFQUF0QixFQUEwQjtBQUN4QixhQUFPLEVBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLElBQUlPLHVCQUFKLENBQW1CLEtBQUtQLE1BQUwsRUFBbkIsRUFBeUNLLE1BQXpDLEVBQVA7QUFDRDtBQUNGO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztBQUNFRyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUFJLEtBQUtSLE1BQUwsT0FBa0IsRUFBdEIsRUFBMEI7QUFDeEIsYUFBTyxFQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxJQUFJUywwQkFBSixDQUFzQixLQUFLVCxNQUFMLEVBQXRCLEVBQTRDVSxhQUE1QyxFQUFQO0FBQ0Q7QUFDRixHQWpGZ0IsQ0FtRmpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNGO0FBQ0E7QUFDQTs7O0FBQ0VDLEVBQUFBLFVBQVUsR0FBRztBQUNYLFdBQU8sS0FBS25CLEtBQUwsQ0FBV29CLFFBQVgsQ0FBb0IsR0FBcEIsQ0FBUDtBQUNEOztBQXZKZ0I7O2VBMEpKMUIsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYXJzZXIgZnJvbSAnLi9QYXJzZXInXHJcbmltcG9ydCBNYXRoRm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVycy9Gb3JtYXR0ZXJNYXRoJ1xyXG5pbXBvcnQgTGF0ZXhGb3JtYXR0ZXIgZnJvbSAnLi9mb3JtYXR0ZXJzL0Zvcm1hdHRlckxhdGV4J1xyXG5pbXBvcnQgTGF0ZXhMZXhlciBmcm9tICcuL2xleGVycy9MZXhlckxhdGV4J1xyXG5pbXBvcnQgTWF0aExleGVyIGZyb20gJy4vbGV4ZXJzL0xleGVyTWF0aCdcclxuaW1wb3J0IEFTVCBmcm9tICcuL2Zvcm1hdHRlcnMvQVNUJ1xyXG5pbXBvcnQgTmVyZGFtZXJGb3JtYXR0ZXIgZnJvbSAnLi9mb3JtYXR0ZXJzL0Zvcm1hdHRlck5lcmRhbWVyJ1xyXG5cclxuLyoqXHJcbiAqIEEgY2xhc3MgZm9yIHBhcnNpbmcgbGF0ZXggbWF0aFxyXG4gKi9cclxuY2xhc3MgQWxnZWJyYUxhdGV4IHtcclxuICBvcHRpb25zOiB7fVxyXG4gIGlucHV0ITogc3RyaW5nXHJcbiAgcGFyc2VyITogUGFyc2VyXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGFuIEFsZ2VicmFMYXRleCBvYmplY3QsIHRvIGJlIGNvbnZlcnRlZFxyXG4gICAqIFRoZSBsYXRleCBwYXJlbWV0ZXIgd2FzIHJlbW92ZWQgYXMgb2YgdjIuMCwgdXNlIHBhcnNlTGF0ZXgoKVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIHRvIHByb3ZpZGUgdG8gdGhlIGxpYnJhcnlcclxuICAgKiBAcmV0dXJuIHtBbGdlYnJhTGF0ZXh9IG9iamVjdCB0byBiZSBjb252ZXJ0ZWRcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcclxuICB9XHJcblxyXG4gIHBhcnNlTGF0ZXgobGF0ZXg6IHN0cmluZykge1xyXG4gICAgLy8gUmVwbGFjZSAsIHdpdGggLiBmb3IgZXVyb3BlYW4gZGVjaW1hbCBzZXBhcmF0b3JzXHJcbiAgICBsYXRleCA9IGxhdGV4LnJlcGxhY2UoLywvZywgJy4nKVxyXG5cclxuICAgIHRoaXMuaW5wdXQgPSBsYXRleFxyXG4gICAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyKGxhdGV4LCBMYXRleExleGVyLCB0aGlzLm9wdGlvbnMpXHJcbiAgICB0aGlzLnBhcnNlci5wYXJzZSgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIHBhcnNlTWF0aChtYXRoOiBzdHJpbmcpIHtcclxuICAgIC8vIFJlcGxhY2UgLCB3aXRoIC4gZm9yIGV1cm9wZWFuIGRlY2ltYWwgc2VwYXJhdG9yc1xyXG4gICAgbWF0aCA9IG1hdGgucmVwbGFjZSgvLC9nLCAnLicpXHJcblxyXG4gICAgdGhpcy5pbnB1dCA9IG1hdGhcclxuICAgIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcihtYXRoLCBNYXRoTGV4ZXIsIHRoaXMub3B0aW9ucylcclxuICAgIHRoaXMucGFyc2VyLnBhcnNlKClcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgZ2V0QXN0KCkge1xyXG4gICAgc3dpdGNoICh0aGlzLnBhcnNlci5hc3QpIHtcclxuICAgICAgY2FzZSBudWxsOlxyXG4gICAgICAgIHRocm93IEVycm9yKCdDYWxsIHBhcnNlIGZpcnN0Jyk7XHJcbiAgICAgIGNhc2UgJyc6XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5hc3Q7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXaWxsIHJldHVybiBhIHNlcmlhbGl6ZWQgc3RyaW5nIGVnLiAyKigzKzQpLyhzcXJ0KDUpKS04XHJcbiAgICogQHJldHVybiBzdHJpbmcgVGhlIHNlcmlhbGl6ZWQgc3RyaW5nXHJcbiAgICovXHJcbiAgdG9NYXRoKCkge1xyXG4gICAgaWYgKHRoaXMuZ2V0QXN0KCkgPT09ICcnKSB7XHJcbiAgICAgIHJldHVybiAnJ1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG5ldyBNYXRoRm9ybWF0dGVyKHRoaXMuZ2V0QXN0KCkgYXMgQVNUKS5mb3JtYXQoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV2lsbCByZXR1cm4gYSBmb3JtYXR0ZWQgbGF0ZXggc3RyaW5nIGVnLiBcXGZyYWN7MX17XFxzcXJ0ezJ9fVxyXG4gICAqIEByZXR1cm4gc3RyaW5nIFRoZSBmb3JtYXR0ZWQgbGF0ZXggc3RyaW5nXHJcbiAgICovXHJcbiAgdG9MYXRleCgpIHtcclxuICAgIGlmICh0aGlzLmdldEFzdCgpID09PSAnJykge1xyXG4gICAgICByZXR1cm4gJydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBuZXcgTGF0ZXhGb3JtYXR0ZXIodGhpcy5nZXRBc3QoKSBhcyBBU1QpLmZvcm1hdCgpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXaWxsIHJldHVybiBhIG5lcmRhbWVyIG9iamVjdFxyXG4gICAqIEByZXR1cm4gbmVyZGFtZXIgb2JqZWN0XHJcbiAgICovXHJcbiAgdG9OZXJkYW1lcigpIHtcclxuICAgIGlmICh0aGlzLmdldEFzdCgpID09PSAnJykge1xyXG4gICAgICByZXR1cm4gJydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBuZXcgTmVyZGFtZXJGb3JtYXR0ZXIodGhpcy5nZXRBc3QoKSBhcyBBU1QpLmdldEV4cHJlc3Npb24oKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gLyoqXHJcbiAgLy8gICogQGRlcHJlY2F0ZWQgdG9MYXRleCgpIHNob3VsZCBiZSB1c2VkIGluc3RlYWRcclxuICAvLyAgKi9cclxuICAvLyB0b1RleCgpIHtcclxuICAvLyAgIHJldHVybiBzZWxmLnRvTGF0ZXgoKVxyXG4gIC8vIH1cclxuXHJcbiAgLy8gLyoqXHJcbiAgLy8gICogV2lsbCByZXR1cm4gYW4gYWxnZWJyYS5qcyBFeHByZXNzaW9uIG9yIEVxdWF0aW9uXHJcbiAgLy8gICogQHBhcmFtIHtPYmplY3R9IGFsZ2VicmFKUyBhbiBpbnN0YW5jZSBvZiBhbGdlYnJhLmpzXHJcbiAgLy8gICogQHJldHVybiB7KEV4cHJlc3Npb258RXF1YXRpb24pfSBhbiBFeHByZXNzaW9uIG9yIEVxdWF0aW9uXHJcbiAgLy8gICovXHJcbiAgLy8gdG9BbGdlYnJhKGFsZ2VicmFKUykge1xyXG4gIC8vICAgaWYgKGFsZ2VicmFKUyA9PT0gbnVsbCkge1xyXG4gIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsZ2VicmEuanMgbXVzdCBiZSBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgZm9yIHRvQWxnZWJyYScpXHJcbiAgLy8gICB9XHJcblxyXG4gIC8vICAgbGV0IG1hdGhUb1BhcnNlID0gdGhpcy50b01hdGgoKVxyXG4gIC8vICAgbWF0aFRvUGFyc2UgPSBncmVla0xldHRlcnMuY29udmVydFN5bWJvbHMobWF0aFRvUGFyc2UpXHJcblxyXG4gIC8vICAgcmV0dXJuIGFsZ2VicmFKUy5wYXJzZShtYXRoVG9QYXJzZSlcclxuICAvLyB9XHJcblxyXG4gIC8vIC8qKlxyXG4gIC8vICAqIFdpbGwgcmV0dXJuIGFuIGFsZ2Vicml0ZSBvYmplY3RcclxuICAvLyAgKiBAcGFyYW0ge09iamVjdH0gYWxnZWJyaXRlIGFuIGluc3RhbmNlIG9mIGFsZ2Vicml0ZVxyXG4gIC8vICAqIEByZXR1cm4ge09iamVjdH0gYW4gYWxnZWJyaXRlIG9iamVjdFxyXG4gIC8vICAqL1xyXG4gIC8vIHRvQWxnZWJyaXRlKGFsZ2Vicml0ZSkge1xyXG4gIC8vICAgaWYgKGFsZ2Vicml0ZSA9PT0gbnVsbCkge1xyXG4gIC8vICAgICByZXR1cm4gbmV3IEVycm9yKFxyXG4gIC8vICAgICAgICdBbGdlYnJpdGUgbXVzdCBiZSBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgZm9yIHRvQWxnZWJyaXRlJ1xyXG4gIC8vICAgICApXHJcbiAgLy8gICB9XHJcblxyXG4gIC8vICAgaWYgKHRoaXMuaXNFcXVhdGlvbigpKSB7XHJcbiAgLy8gICAgIHJldHVybiBuZXcgRXJyb3IoJ0FsZ2Vicml0ZSBjYW4gbm90IGhhbmRsZSBlcXVhdGlvbnMsIG9ubHkgZXhwcmVzc2lvbnMnKVxyXG4gIC8vICAgfVxyXG5cclxuICAvLyAgIGxldCBtYXRoVG9QYXJzZSA9IHRoaXMudG9NYXRoKClcclxuICAvLyAgIG1hdGhUb1BhcnNlID0gZ3JlZWtMZXR0ZXJzLmNvbnZlcnRTeW1ib2xzKG1hdGhUb1BhcnNlKVxyXG5cclxuICAvLyAgIHJldHVybiBhbGdlYnJpdGUuZXZhbChtYXRoVG9QYXJzZSlcclxuICAvLyB9XHJcblxyXG4gIC8vIC8qKlxyXG4gIC8vICAqIFdpbGwgcmV0dXJuIGEgY29mZmVxdWF0ZSBvYmplY3RcclxuICAvLyAgKiBAcmV0dXJuIHtPYmplY3R9IGEgY29mZmVlcXVhdGUgb2JqZWN0XHJcbiAgLy8gICovXHJcbiAgLy8gdG9Db2ZmZWVxdWF0ZShjb2ZmZWVxdWF0ZSkge1xyXG4gIC8vICAgaWYgKGNvZmZlZXF1YXRlID09PSBudWxsKSB7XHJcbiAgLy8gICAgIHJldHVybiBuZXcgRXJyb3IoXHJcbiAgLy8gICAgICAgJ0NvZmZlZXF1YW50ZSBtdXN0IGJlIHBhc3NlZCBhcyBhIHBhcmFtZXRlciBmb3IgdG9Db2ZmZWVxdWFudGUnXHJcbiAgLy8gICAgIClcclxuICAvLyAgIH1cclxuXHJcbiAgLy8gICBsZXQgcmVzdWx0ID0gdGhpcy50b01hdGgoKVxyXG4gIC8vICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1xcXi9nLCAnKionKVxyXG5cclxuICAvLyAgIHJldHVybiBjb2ZmZWVxdWF0ZShyZXN1bHQpXHJcbiAgLy8gfVxyXG5cclxuICAvKipcclxuICAgKiBXZXRoZXIgb3Igbm90IHRoZSBvYmplY3QgaXMgYW4gZXF1YXRpb24gb3IgYW4gZXhwcmVzc2lvblxyXG4gICAqIEByZXR1cm4gQm9vbGVhbiB0cnVlIGlmIGV4cHJlc3Npb25cclxuICAgKi9cclxuICBpc0VxdWF0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5wdXQuaW5jbHVkZXMoJz0nKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWxnZWJyYUxhdGV4XHJcbiJdfQ==