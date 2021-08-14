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

var _nerdamer = _interopRequireDefault(require("nerdamer"));

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
      return (0, _nerdamer.default)('');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJBbGdlYnJhTGF0ZXgiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJwYXJzZUxhdGV4IiwibGF0ZXgiLCJyZXBsYWNlIiwiaW5wdXQiLCJwYXJzZXIiLCJQYXJzZXIiLCJMYXRleExleGVyIiwicGFyc2UiLCJwYXJzZU1hdGgiLCJtYXRoIiwiTWF0aExleGVyIiwiZ2V0QXN0IiwiYXN0IiwiRXJyb3IiLCJ0b01hdGgiLCJNYXRoRm9ybWF0dGVyIiwiZm9ybWF0IiwidG9MYXRleCIsIkxhdGV4Rm9ybWF0dGVyIiwidG9OZXJkYW1lciIsIk5lcmRhbWVyRm9ybWF0dGVyIiwiZ2V0RXhwcmVzc2lvbiIsImlzRXF1YXRpb24iLCJpbmNsdWRlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxZQUFOLENBQW1CO0FBSWpCO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFQyxFQUFBQSxXQUFXLENBQUNDLE9BQU8sR0FBRyxFQUFYLEVBQWU7QUFBQTs7QUFBQTs7QUFBQTs7QUFDeEIsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7O0FBRURDLEVBQUFBLFVBQVUsQ0FBQ0MsS0FBRCxFQUFnQjtBQUN4QjtBQUNBQSxJQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ0MsT0FBTixDQUFjLElBQWQsRUFBb0IsR0FBcEIsQ0FBUjtBQUVBLFNBQUtDLEtBQUwsR0FBYUYsS0FBYjtBQUNBLFNBQUtHLE1BQUwsR0FBYyxJQUFJQyxlQUFKLENBQVdKLEtBQVgsRUFBa0JLLG1CQUFsQixFQUE4QixLQUFLUCxPQUFuQyxDQUFkO0FBQ0EsU0FBS0ssTUFBTCxDQUFZRyxLQUFaO0FBRUEsV0FBTyxJQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLFNBQVMsQ0FBQ0MsSUFBRCxFQUFlO0FBQ3RCO0FBQ0FBLElBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDUCxPQUFMLENBQWEsSUFBYixFQUFtQixHQUFuQixDQUFQO0FBRUEsU0FBS0MsS0FBTCxHQUFhTSxJQUFiO0FBQ0EsU0FBS0wsTUFBTCxHQUFjLElBQUlDLGVBQUosQ0FBV0ksSUFBWCxFQUFpQkMsa0JBQWpCLEVBQTRCLEtBQUtYLE9BQWpDLENBQWQ7QUFDQSxTQUFLSyxNQUFMLENBQVlHLEtBQVo7QUFFQSxXQUFPLElBQVA7QUFDRDs7QUFFREksRUFBQUEsTUFBTSxHQUFHO0FBQ1AsWUFBUSxLQUFLUCxNQUFMLENBQVlRLEdBQXBCO0FBQ0UsV0FBSyxJQUFMO0FBQ0UsY0FBTUMsS0FBSyxDQUFDLGtCQUFELENBQVg7O0FBQ0YsV0FBSyxFQUFMO0FBQ0UsZUFBTyxFQUFQOztBQUNGO0FBQ0UsZUFBTyxLQUFLVCxNQUFMLENBQVlRLEdBQW5CO0FBTko7QUFRRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDRUUsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsUUFBSSxLQUFLSCxNQUFMLE9BQWtCLEVBQXRCLEVBQTBCO0FBQ3hCLGFBQU8sRUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sSUFBSUksc0JBQUosQ0FBa0IsS0FBS0osTUFBTCxFQUFsQixFQUF3Q0ssTUFBeEMsRUFBUDtBQUNEO0FBQ0Y7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O0FBQ0VDLEVBQUFBLE9BQU8sR0FBRztBQUNSLFFBQUksS0FBS04sTUFBTCxPQUFrQixFQUF0QixFQUEwQjtBQUN4QixhQUFPLEVBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLElBQUlPLHVCQUFKLENBQW1CLEtBQUtQLE1BQUwsRUFBbkIsRUFBeUNLLE1BQXpDLEVBQVA7QUFDRDtBQUNGO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztBQUNFRyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUFJLEtBQUtSLE1BQUwsT0FBa0IsRUFBdEIsRUFBMEI7QUFDeEIsYUFBTyx1QkFBUyxFQUFULENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLElBQUlTLDBCQUFKLENBQXNCLEtBQUtULE1BQUwsRUFBdEIsRUFBNENVLGFBQTVDLEVBQVA7QUFDRDtBQUNGLEdBakZnQixDQW1GakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDRUMsRUFBQUEsVUFBVSxHQUFHO0FBQ1gsV0FBTyxLQUFLbkIsS0FBTCxDQUFXb0IsUUFBWCxDQUFvQixHQUFwQixDQUFQO0FBQ0Q7O0FBdkpnQjs7ZUEwSkoxQixZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhcnNlciBmcm9tICcuL1BhcnNlcidcclxuaW1wb3J0IE1hdGhGb3JtYXR0ZXIgZnJvbSAnLi9mb3JtYXR0ZXJzL0Zvcm1hdHRlck1hdGgnXHJcbmltcG9ydCBMYXRleEZvcm1hdHRlciBmcm9tICcuL2Zvcm1hdHRlcnMvRm9ybWF0dGVyTGF0ZXgnXHJcbmltcG9ydCBMYXRleExleGVyIGZyb20gJy4vbGV4ZXJzL0xleGVyTGF0ZXgnXHJcbmltcG9ydCBNYXRoTGV4ZXIgZnJvbSAnLi9sZXhlcnMvTGV4ZXJNYXRoJ1xyXG5pbXBvcnQgQVNUIGZyb20gJy4vZm9ybWF0dGVycy9BU1QnXHJcbmltcG9ydCBuZXJkYW1lciBmcm9tICduZXJkYW1lcidcclxuaW1wb3J0IE5lcmRhbWVyRm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVycy9Gb3JtYXR0ZXJOZXJkYW1lcidcclxuXHJcbi8qKlxyXG4gKiBBIGNsYXNzIGZvciBwYXJzaW5nIGxhdGV4IG1hdGhcclxuICovXHJcbmNsYXNzIEFsZ2VicmFMYXRleCB7XHJcbiAgb3B0aW9uczoge31cclxuICBpbnB1dCE6IHN0cmluZ1xyXG4gIHBhcnNlciE6IFBhcnNlclxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBBbGdlYnJhTGF0ZXggb2JqZWN0LCB0byBiZSBjb252ZXJ0ZWRcclxuICAgKiBUaGUgbGF0ZXggcGFyZW1ldGVyIHdhcyByZW1vdmVkIGFzIG9mIHYyLjAsIHVzZSBwYXJzZUxhdGV4KClcclxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyB0byBwcm92aWRlIHRvIHRoZSBsaWJyYXJ5XHJcbiAgICogQHJldHVybiB7QWxnZWJyYUxhdGV4fSBvYmplY3QgdG8gYmUgY29udmVydGVkXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcbiAgfVxyXG5cclxuICBwYXJzZUxhdGV4KGxhdGV4OiBzdHJpbmcpIHtcclxuICAgIC8vIFJlcGxhY2UgLCB3aXRoIC4gZm9yIGV1cm9wZWFuIGRlY2ltYWwgc2VwYXJhdG9yc1xyXG4gICAgbGF0ZXggPSBsYXRleC5yZXBsYWNlKC8sL2csICcuJylcclxuXHJcbiAgICB0aGlzLmlucHV0ID0gbGF0ZXhcclxuICAgIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcihsYXRleCwgTGF0ZXhMZXhlciwgdGhpcy5vcHRpb25zKVxyXG4gICAgdGhpcy5wYXJzZXIucGFyc2UoKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICBwYXJzZU1hdGgobWF0aDogc3RyaW5nKSB7XHJcbiAgICAvLyBSZXBsYWNlICwgd2l0aCAuIGZvciBldXJvcGVhbiBkZWNpbWFsIHNlcGFyYXRvcnNcclxuICAgIG1hdGggPSBtYXRoLnJlcGxhY2UoLywvZywgJy4nKVxyXG5cclxuICAgIHRoaXMuaW5wdXQgPSBtYXRoXHJcbiAgICB0aGlzLnBhcnNlciA9IG5ldyBQYXJzZXIobWF0aCwgTWF0aExleGVyLCB0aGlzLm9wdGlvbnMpXHJcbiAgICB0aGlzLnBhcnNlci5wYXJzZSgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIGdldEFzdCgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5wYXJzZXIuYXN0KSB7XHJcbiAgICAgIGNhc2UgbnVsbDpcclxuICAgICAgICB0aHJvdyBFcnJvcignQ2FsbCBwYXJzZSBmaXJzdCcpO1xyXG4gICAgICBjYXNlICcnOlxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIuYXN0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV2lsbCByZXR1cm4gYSBzZXJpYWxpemVkIHN0cmluZyBlZy4gMiooMys0KS8oc3FydCg1KSktOFxyXG4gICAqIEByZXR1cm4gc3RyaW5nIFRoZSBzZXJpYWxpemVkIHN0cmluZ1xyXG4gICAqL1xyXG4gIHRvTWF0aCgpIHtcclxuICAgIGlmICh0aGlzLmdldEFzdCgpID09PSAnJykge1xyXG4gICAgICByZXR1cm4gJydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBuZXcgTWF0aEZvcm1hdHRlcih0aGlzLmdldEFzdCgpIGFzIEFTVCkuZm9ybWF0KClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFdpbGwgcmV0dXJuIGEgZm9ybWF0dGVkIGxhdGV4IHN0cmluZyBlZy4gXFxmcmFjezF9e1xcc3FydHsyfX1cclxuICAgKiBAcmV0dXJuIHN0cmluZyBUaGUgZm9ybWF0dGVkIGxhdGV4IHN0cmluZ1xyXG4gICAqL1xyXG4gIHRvTGF0ZXgoKSB7XHJcbiAgICBpZiAodGhpcy5nZXRBc3QoKSA9PT0gJycpIHtcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbmV3IExhdGV4Rm9ybWF0dGVyKHRoaXMuZ2V0QXN0KCkgYXMgQVNUKS5mb3JtYXQoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV2lsbCByZXR1cm4gYSBuZXJkYW1lciBvYmplY3RcclxuICAgKiBAcmV0dXJuIG5lcmRhbWVyIG9iamVjdFxyXG4gICAqL1xyXG4gIHRvTmVyZGFtZXIoKSB7XHJcbiAgICBpZiAodGhpcy5nZXRBc3QoKSA9PT0gJycpIHtcclxuICAgICAgcmV0dXJuIG5lcmRhbWVyKCcnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG5ldyBOZXJkYW1lckZvcm1hdHRlcih0aGlzLmdldEFzdCgpIGFzIEFTVCkuZ2V0RXhwcmVzc2lvbigpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAvKipcclxuICAvLyAgKiBAZGVwcmVjYXRlZCB0b0xhdGV4KCkgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZFxyXG4gIC8vICAqL1xyXG4gIC8vIHRvVGV4KCkge1xyXG4gIC8vICAgcmV0dXJuIHNlbGYudG9MYXRleCgpXHJcbiAgLy8gfVxyXG5cclxuICAvLyAvKipcclxuICAvLyAgKiBXaWxsIHJldHVybiBhbiBhbGdlYnJhLmpzIEV4cHJlc3Npb24gb3IgRXF1YXRpb25cclxuICAvLyAgKiBAcGFyYW0ge09iamVjdH0gYWxnZWJyYUpTIGFuIGluc3RhbmNlIG9mIGFsZ2VicmEuanNcclxuICAvLyAgKiBAcmV0dXJuIHsoRXhwcmVzc2lvbnxFcXVhdGlvbil9IGFuIEV4cHJlc3Npb24gb3IgRXF1YXRpb25cclxuICAvLyAgKi9cclxuICAvLyB0b0FsZ2VicmEoYWxnZWJyYUpTKSB7XHJcbiAgLy8gICBpZiAoYWxnZWJyYUpTID09PSBudWxsKSB7XHJcbiAgLy8gICAgIHRocm93IG5ldyBFcnJvcignQWxnZWJyYS5qcyBtdXN0IGJlIHBhc3NlZCBhcyBhIHBhcmFtZXRlciBmb3IgdG9BbGdlYnJhJylcclxuICAvLyAgIH1cclxuXHJcbiAgLy8gICBsZXQgbWF0aFRvUGFyc2UgPSB0aGlzLnRvTWF0aCgpXHJcbiAgLy8gICBtYXRoVG9QYXJzZSA9IGdyZWVrTGV0dGVycy5jb252ZXJ0U3ltYm9scyhtYXRoVG9QYXJzZSlcclxuXHJcbiAgLy8gICByZXR1cm4gYWxnZWJyYUpTLnBhcnNlKG1hdGhUb1BhcnNlKVxyXG4gIC8vIH1cclxuXHJcbiAgLy8gLyoqXHJcbiAgLy8gICogV2lsbCByZXR1cm4gYW4gYWxnZWJyaXRlIG9iamVjdFxyXG4gIC8vICAqIEBwYXJhbSB7T2JqZWN0fSBhbGdlYnJpdGUgYW4gaW5zdGFuY2Ugb2YgYWxnZWJyaXRlXHJcbiAgLy8gICogQHJldHVybiB7T2JqZWN0fSBhbiBhbGdlYnJpdGUgb2JqZWN0XHJcbiAgLy8gICovXHJcbiAgLy8gdG9BbGdlYnJpdGUoYWxnZWJyaXRlKSB7XHJcbiAgLy8gICBpZiAoYWxnZWJyaXRlID09PSBudWxsKSB7XHJcbiAgLy8gICAgIHJldHVybiBuZXcgRXJyb3IoXHJcbiAgLy8gICAgICAgJ0FsZ2Vicml0ZSBtdXN0IGJlIHBhc3NlZCBhcyBhIHBhcmFtZXRlciBmb3IgdG9BbGdlYnJpdGUnXHJcbiAgLy8gICAgIClcclxuICAvLyAgIH1cclxuXHJcbiAgLy8gICBpZiAodGhpcy5pc0VxdWF0aW9uKCkpIHtcclxuICAvLyAgICAgcmV0dXJuIG5ldyBFcnJvcignQWxnZWJyaXRlIGNhbiBub3QgaGFuZGxlIGVxdWF0aW9ucywgb25seSBleHByZXNzaW9ucycpXHJcbiAgLy8gICB9XHJcblxyXG4gIC8vICAgbGV0IG1hdGhUb1BhcnNlID0gdGhpcy50b01hdGgoKVxyXG4gIC8vICAgbWF0aFRvUGFyc2UgPSBncmVla0xldHRlcnMuY29udmVydFN5bWJvbHMobWF0aFRvUGFyc2UpXHJcblxyXG4gIC8vICAgcmV0dXJuIGFsZ2Vicml0ZS5ldmFsKG1hdGhUb1BhcnNlKVxyXG4gIC8vIH1cclxuXHJcbiAgLy8gLyoqXHJcbiAgLy8gICogV2lsbCByZXR1cm4gYSBjb2ZmZXF1YXRlIG9iamVjdFxyXG4gIC8vICAqIEByZXR1cm4ge09iamVjdH0gYSBjb2ZmZWVxdWF0ZSBvYmplY3RcclxuICAvLyAgKi9cclxuICAvLyB0b0NvZmZlZXF1YXRlKGNvZmZlZXF1YXRlKSB7XHJcbiAgLy8gICBpZiAoY29mZmVlcXVhdGUgPT09IG51bGwpIHtcclxuICAvLyAgICAgcmV0dXJuIG5ldyBFcnJvcihcclxuICAvLyAgICAgICAnQ29mZmVlcXVhbnRlIG11c3QgYmUgcGFzc2VkIGFzIGEgcGFyYW1ldGVyIGZvciB0b0NvZmZlZXF1YW50ZSdcclxuICAvLyAgICAgKVxyXG4gIC8vICAgfVxyXG5cclxuICAvLyAgIGxldCByZXN1bHQgPSB0aGlzLnRvTWF0aCgpXHJcbiAgLy8gICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXFxeL2csICcqKicpXHJcblxyXG4gIC8vICAgcmV0dXJuIGNvZmZlZXF1YXRlKHJlc3VsdClcclxuICAvLyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFdldGhlciBvciBub3QgdGhlIG9iamVjdCBpcyBhbiBlcXVhdGlvbiBvciBhbiBleHByZXNzaW9uXHJcbiAgICogQHJldHVybiBCb29sZWFuIHRydWUgaWYgZXhwcmVzc2lvblxyXG4gICAqL1xyXG4gIGlzRXF1YXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnB1dC5pbmNsdWRlcygnPScpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBbGdlYnJhTGF0ZXhcclxuIl19