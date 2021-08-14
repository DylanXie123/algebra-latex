"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nerdamer = _interopRequireDefault(require("nerdamer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('nerdamer/all');

class NerdamerFormatter {
  constructor(ast) {
    _defineProperty(this, "ast", void 0);

    _defineProperty(this, "parser", void 0);

    _defineProperty(this, "Symbol", void 0);

    this.ast = ast;
    this.parser = _nerdamer.default.getCore().PARSER;
    this.Symbol = _nerdamer.default.getCore().Symbol;
  }

  getExpression() {
    const symbol = this.format();

    const Expression = _nerdamer.default.getCore().Expression;

    return new Expression(symbol);
  }

  format(root = this.ast) {
    if (root === null) {
      return '';
    }

    switch (root.type) {
      case 'operator':
        return this.operator(root);

      case 'number':
        return this.number(root);

      case 'function':
        return this.function(root);

      case 'variable':
        return this.variable(root);

      case 'equation':
        return this.equation(root);

      case 'subscript':
        return this.subscript();

      case 'uni-operator':
        return this.uni_operator(root);

      default:
        throw Error('Unexpected type: ' + root);
    }
  }

  operator(root) {
    // const op: string = root.operator
    const lhs = this.format(root.lhs);
    const rhs = this.format(root.rhs);

    switch (root.operator) {
      case 'plus':
        return this.parser.add(lhs, rhs);

      case 'minus':
        return this.parser.subtract(lhs, rhs);

      case 'multiply':
        return this.parser.multiply(lhs, rhs);

      case 'divide':
        return this.parser.divide(lhs, rhs);

      case 'modulus':
        return this.parser.mod(lhs, rhs);

      case 'exponent':
        return this.parser.pow(lhs, rhs);

      default:
        throw Error('Unknow operator' + root.operator);
    } // switch (op) {
    //   case 'plus':
    //     op = '+'
    //     break
    //   case 'minus':
    //     op = '-'
    //     break
    //   case 'multiply':
    //     op = '\\cdot '
    //     break
    //   case 'divide':
    //     return this.fragment(root)
    //   case 'modulus':
    //     op = '%'
    //     break
    //   case 'exponent':
    //     op = '^'
    //     break
    //   default:
    // }
    // let lhs = this.format(root.lhs)
    // let rhs = this.format(root.rhs)
    // const precedensOrder: OperatorType[][] = [
    //   ['modulus'],
    //   ['exponent'],
    //   ['multiply'],
    //   ['plus', 'minus'],
    // ]
    // const higherPrecedens = (a: OperatorType, b: OperatorType) => {
    //   const depth = (op: OperatorType) => precedensOrder.findIndex(val => val.includes(op))
    //   return depth(b) > depth(a)
    // }
    // const shouldHaveParenthesis = (child: AST) =>
    //   child.type === 'operator' && higherPrecedens(root.operator, child.operator)
    // let lhsParen = shouldHaveParenthesis(root.lhs)
    // let rhsParen = shouldHaveParenthesis(root.rhs)
    // lhs = lhsParen ? `\\left(${lhs}\\right)` : lhs
    // if (root.operator === 'exponent') {
    //   rhsParen = true
    //   rhs = rhsParen ? `{${rhs}}` : rhs
    // } else {
    //   rhs = rhsParen ? `\\left(${rhs}\\right)` : rhs
    // }
    // return `${lhs}${op}${rhs}`

  } // fragment(root: OperatorNode) {
  //   let lhs = this.format(root.lhs)
  //   let rhs = this.format(root.rhs)
  //   return `\\frac{${lhs}}{${rhs}}`
  // }


  number(root) {
    return new this.Symbol(root.value);
  }

  function(root) {
    // if (root.value === 'sqrt') {
    //   return `\\${root.value}{${this.format(root.content)}}`
    // }
    // return `\\${root.value}\\left(${this.format(root.content)}\\right)`
    return this.parser.callfunction(root.value, this.format(root.content));
  }

  variable(root) {
    // if (greekLetters.map(l => l.name).includes((root.value as string).toLowerCase())) {
    //   return `\\${root.value}`
    // }
    // return `${root.value}`
    return this.Symbol(root.value);
  }

  equation(root) {
    // return `${this.format(root.lhs)}=${this.format(root.rhs)}`
    const Equation = _nerdamer.default.getCore().Equation;

    return new Equation(this.format(root.lhs), this.format(root.rhs));
  }

  subscript() {
    throw Error('subscript not implemented'); // if (root.subscript.type === 'variable' && (root.subscript.value as string).length === 1) {
    //   return `${this.format(root.base)}_${this.format(root.subscript)}`
    // }
    // return `${this.format(root.base)}_{${this.format(root.subscript)}}`
  }

  uni_operator(root) {
    if (root.operator === 'minus') {
      // return `-${this.format(root.value as AST)}`
      return this.parser.subtract(new this.Symbol(0), this.format(root.value));
    }

    return this.format(root.value);
  }

}

exports.default = NerdamerFormatter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXJzL0Zvcm1hdHRlck5lcmRhbWVyLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJOZXJkYW1lckZvcm1hdHRlciIsImNvbnN0cnVjdG9yIiwiYXN0IiwicGFyc2VyIiwibmVyZGFtZXIiLCJnZXRDb3JlIiwiUEFSU0VSIiwiU3ltYm9sIiwiZ2V0RXhwcmVzc2lvbiIsInN5bWJvbCIsImZvcm1hdCIsIkV4cHJlc3Npb24iLCJyb290IiwidHlwZSIsIm9wZXJhdG9yIiwibnVtYmVyIiwiZnVuY3Rpb24iLCJ2YXJpYWJsZSIsImVxdWF0aW9uIiwic3Vic2NyaXB0IiwidW5pX29wZXJhdG9yIiwiRXJyb3IiLCJsaHMiLCJyaHMiLCJhZGQiLCJzdWJ0cmFjdCIsIm11bHRpcGx5IiwiZGl2aWRlIiwibW9kIiwicG93IiwidmFsdWUiLCJjYWxsZnVuY3Rpb24iLCJjb250ZW50IiwiRXF1YXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0FBQ0FBLE9BQU8sQ0FBQyxjQUFELENBQVA7O0FBRWUsTUFBTUMsaUJBQU4sQ0FBd0I7QUFLckNDLEVBQUFBLFdBQVcsQ0FBQ0MsR0FBRCxFQUFXO0FBQUE7O0FBQUE7O0FBQUE7O0FBQ3BCLFNBQUtBLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtDLE1BQUwsR0FBY0Msa0JBQVNDLE9BQVQsR0FBbUJDLE1BQWpDO0FBQ0EsU0FBS0MsTUFBTCxHQUFjSCxrQkFBU0MsT0FBVCxHQUFtQkUsTUFBakM7QUFDRDs7QUFFREMsRUFBQUEsYUFBYSxHQUFHO0FBQ2QsVUFBTUMsTUFBTSxHQUFHLEtBQUtDLE1BQUwsRUFBZjs7QUFDQSxVQUFNQyxVQUFVLEdBQUdQLGtCQUFTQyxPQUFULEdBQW1CTSxVQUF0Qzs7QUFDQSxXQUFRLElBQUlBLFVBQUosQ0FBZUYsTUFBZixDQUFSO0FBQ0Q7O0FBRURDLEVBQUFBLE1BQU0sQ0FBQ0UsSUFBSSxHQUFHLEtBQUtWLEdBQWIsRUFBdUI7QUFDM0IsUUFBSVUsSUFBSSxLQUFLLElBQWIsRUFBbUI7QUFDakIsYUFBTyxFQUFQO0FBQ0Q7O0FBRUQsWUFBUUEsSUFBSSxDQUFDQyxJQUFiO0FBQ0UsV0FBSyxVQUFMO0FBQ0UsZUFBTyxLQUFLQyxRQUFMLENBQWNGLElBQWQsQ0FBUDs7QUFDRixXQUFLLFFBQUw7QUFDRSxlQUFPLEtBQUtHLE1BQUwsQ0FBWUgsSUFBWixDQUFQOztBQUNGLFdBQUssVUFBTDtBQUNFLGVBQU8sS0FBS0ksUUFBTCxDQUFjSixJQUFkLENBQVA7O0FBQ0YsV0FBSyxVQUFMO0FBQ0UsZUFBTyxLQUFLSyxRQUFMLENBQWNMLElBQWQsQ0FBUDs7QUFDRixXQUFLLFVBQUw7QUFDRSxlQUFPLEtBQUtNLFFBQUwsQ0FBY04sSUFBZCxDQUFQOztBQUNGLFdBQUssV0FBTDtBQUNFLGVBQU8sS0FBS08sU0FBTCxFQUFQOztBQUNGLFdBQUssY0FBTDtBQUNFLGVBQU8sS0FBS0MsWUFBTCxDQUFrQlIsSUFBbEIsQ0FBUDs7QUFDRjtBQUNFLGNBQU1TLEtBQUssQ0FBQyxzQkFBc0JULElBQXZCLENBQVg7QUFoQko7QUFrQkQ7O0FBRURFLEVBQUFBLFFBQVEsQ0FBQ0YsSUFBRCxFQUFxQjtBQUMzQjtBQUVBLFVBQU1VLEdBQUcsR0FBRyxLQUFLWixNQUFMLENBQVlFLElBQUksQ0FBQ1UsR0FBakIsQ0FBWjtBQUNBLFVBQU1DLEdBQUcsR0FBRyxLQUFLYixNQUFMLENBQVlFLElBQUksQ0FBQ1csR0FBakIsQ0FBWjs7QUFFQSxZQUFRWCxJQUFJLENBQUNFLFFBQWI7QUFDRSxXQUFLLE1BQUw7QUFDRSxlQUFPLEtBQUtYLE1BQUwsQ0FBWXFCLEdBQVosQ0FBZ0JGLEdBQWhCLEVBQXFCQyxHQUFyQixDQUFQOztBQUNGLFdBQUssT0FBTDtBQUNFLGVBQU8sS0FBS3BCLE1BQUwsQ0FBWXNCLFFBQVosQ0FBcUJILEdBQXJCLEVBQTBCQyxHQUExQixDQUFQOztBQUNGLFdBQUssVUFBTDtBQUNFLGVBQU8sS0FBS3BCLE1BQUwsQ0FBWXVCLFFBQVosQ0FBcUJKLEdBQXJCLEVBQTBCQyxHQUExQixDQUFQOztBQUNGLFdBQUssUUFBTDtBQUNFLGVBQU8sS0FBS3BCLE1BQUwsQ0FBWXdCLE1BQVosQ0FBbUJMLEdBQW5CLEVBQXdCQyxHQUF4QixDQUFQOztBQUNGLFdBQUssU0FBTDtBQUNFLGVBQU8sS0FBS3BCLE1BQUwsQ0FBWXlCLEdBQVosQ0FBZ0JOLEdBQWhCLEVBQXFCQyxHQUFyQixDQUFQOztBQUNGLFdBQUssVUFBTDtBQUNFLGVBQU8sS0FBS3BCLE1BQUwsQ0FBWTBCLEdBQVosQ0FBZ0JQLEdBQWhCLEVBQXFCQyxHQUFyQixDQUFQOztBQUNGO0FBQ0UsY0FBTUYsS0FBSyxDQUFDLG9CQUFvQlQsSUFBSSxDQUFDRSxRQUExQixDQUFYO0FBZEosS0FOMkIsQ0F1QjNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBQ0QsR0F0SG9DLENBd0hyQztBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7QUFFQUMsRUFBQUEsTUFBTSxDQUFDSCxJQUFELEVBQW1CO0FBQ3ZCLFdBQU8sSUFBSSxLQUFLTCxNQUFULENBQWdCSyxJQUFJLENBQUNrQixLQUFyQixDQUFQO0FBQ0Q7O0FBRURkLEVBQUFBLFFBQVEsQ0FBQ0osSUFBRCxFQUFxQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQU8sS0FBS1QsTUFBTCxDQUFZNEIsWUFBWixDQUF5Qm5CLElBQUksQ0FBQ2tCLEtBQTlCLEVBQXFDLEtBQUtwQixNQUFMLENBQVlFLElBQUksQ0FBQ29CLE9BQWpCLENBQXJDLENBQVA7QUFDRDs7QUFFRGYsRUFBQUEsUUFBUSxDQUFDTCxJQUFELEVBQXFCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBTyxLQUFLTCxNQUFMLENBQVlLLElBQUksQ0FBQ2tCLEtBQWpCLENBQVA7QUFDRDs7QUFFRFosRUFBQUEsUUFBUSxDQUFDTixJQUFELEVBQXFCO0FBQzNCO0FBQ0EsVUFBTXFCLFFBQVEsR0FBRzdCLGtCQUFTQyxPQUFULEdBQW1CNEIsUUFBcEM7O0FBQ0EsV0FBTyxJQUFJQSxRQUFKLENBQWEsS0FBS3ZCLE1BQUwsQ0FBWUUsSUFBSSxDQUFDVSxHQUFqQixDQUFiLEVBQW9DLEtBQUtaLE1BQUwsQ0FBWUUsSUFBSSxDQUFDVyxHQUFqQixDQUFwQyxDQUFQO0FBQ0Q7O0FBRURKLEVBQUFBLFNBQVMsR0FBVTtBQUNqQixVQUFNRSxLQUFLLENBQUMsMkJBQUQsQ0FBWCxDQURpQixDQUVqQjtBQUNBO0FBQ0E7QUFFQTtBQUNEOztBQUVERCxFQUFBQSxZQUFZLENBQUNSLElBQUQsRUFBb0I7QUFDOUIsUUFBSUEsSUFBSSxDQUFDRSxRQUFMLEtBQWtCLE9BQXRCLEVBQStCO0FBQzdCO0FBQ0EsYUFBTyxLQUFLWCxNQUFMLENBQVlzQixRQUFaLENBQXFCLElBQUksS0FBS2xCLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBckIsRUFBeUMsS0FBS0csTUFBTCxDQUFZRSxJQUFJLENBQUNrQixLQUFqQixDQUF6QyxDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLcEIsTUFBTCxDQUFZRSxJQUFJLENBQUNrQixLQUFqQixDQUFQO0FBQ0Q7O0FBektvQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBncmVla0xldHRlcnMgZnJvbSAnLi4vbW9kZWxzL2dyZWVrLWxldHRlcnMnXHJcbmltcG9ydCBBU1QsIHsgRXF1YXRpb25Ob2RlLCBGdW5jdGlvbk5vZGUsIE51bWJlck5vZGUsIE9wZXJhdG9yTm9kZSwgVW5pT3Blck5vZGUsIFZhcmlhYmxlTm9kZSB9IGZyb20gJy4vQVNUJ1xyXG5pbXBvcnQgbmVyZGFtZXIsIHsgRXhwcmVzc2lvbiB9IGZyb20gJ25lcmRhbWVyJ1xyXG5yZXF1aXJlKCduZXJkYW1lci9hbGwnKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVyZGFtZXJGb3JtYXR0ZXIge1xyXG4gIGFzdDogQVNUXHJcbiAgcHJpdmF0ZSBwYXJzZXI6IGFueVxyXG4gIHByaXZhdGUgU3ltYm9sOiBhbnlcclxuXHJcbiAgY29uc3RydWN0b3IoYXN0OiBBU1QpIHtcclxuICAgIHRoaXMuYXN0ID0gYXN0XHJcbiAgICB0aGlzLnBhcnNlciA9IG5lcmRhbWVyLmdldENvcmUoKS5QQVJTRVJcclxuICAgIHRoaXMuU3ltYm9sID0gbmVyZGFtZXIuZ2V0Q29yZSgpLlN5bWJvbFxyXG4gIH1cclxuXHJcbiAgZ2V0RXhwcmVzc2lvbigpIHtcclxuICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMuZm9ybWF0KCk7XHJcbiAgICBjb25zdCBFeHByZXNzaW9uID0gbmVyZGFtZXIuZ2V0Q29yZSgpLkV4cHJlc3Npb247XHJcbiAgICByZXR1cm4gKG5ldyBFeHByZXNzaW9uKHN5bWJvbCkgYXMgRXhwcmVzc2lvbilcclxuICB9XHJcblxyXG4gIGZvcm1hdChyb290ID0gdGhpcy5hc3QpOiBhbnkge1xyXG4gICAgaWYgKHJvb3QgPT09IG51bGwpIHtcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChyb290LnR5cGUpIHtcclxuICAgICAgY2FzZSAnb3BlcmF0b3InOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm9wZXJhdG9yKHJvb3QpXHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyKHJvb3QpXHJcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5mdW5jdGlvbihyb290KVxyXG4gICAgICBjYXNlICd2YXJpYWJsZSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGUocm9vdClcclxuICAgICAgY2FzZSAnZXF1YXRpb24nOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmVxdWF0aW9uKHJvb3QpXHJcbiAgICAgIGNhc2UgJ3N1YnNjcmlwdCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0KClcclxuICAgICAgY2FzZSAndW5pLW9wZXJhdG9yJzpcclxuICAgICAgICByZXR1cm4gdGhpcy51bmlfb3BlcmF0b3Iocm9vdClcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aHJvdyBFcnJvcignVW5leHBlY3RlZCB0eXBlOiAnICsgcm9vdClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZXJhdG9yKHJvb3Q6IE9wZXJhdG9yTm9kZSkge1xyXG4gICAgLy8gY29uc3Qgb3A6IHN0cmluZyA9IHJvb3Qub3BlcmF0b3JcclxuXHJcbiAgICBjb25zdCBsaHMgPSB0aGlzLmZvcm1hdChyb290LmxocylcclxuICAgIGNvbnN0IHJocyA9IHRoaXMuZm9ybWF0KHJvb3QucmhzKVxyXG5cclxuICAgIHN3aXRjaCAocm9vdC5vcGVyYXRvcikge1xyXG4gICAgICBjYXNlICdwbHVzJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIuYWRkKGxocywgcmhzKVxyXG4gICAgICBjYXNlICdtaW51cyc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnN1YnRyYWN0KGxocywgcmhzKVxyXG4gICAgICBjYXNlICdtdWx0aXBseSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLm11bHRpcGx5KGxocywgcmhzKVxyXG4gICAgICBjYXNlICdkaXZpZGUnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5kaXZpZGUobGhzLCByaHMpXHJcbiAgICAgIGNhc2UgJ21vZHVsdXMnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5tb2QobGhzLCByaHMpXHJcbiAgICAgIGNhc2UgJ2V4cG9uZW50JzpcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIucG93KGxocywgcmhzKVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRocm93IEVycm9yKCdVbmtub3cgb3BlcmF0b3InICsgcm9vdC5vcGVyYXRvcilcclxuICAgIH1cclxuXHJcbiAgICAvLyBzd2l0Y2ggKG9wKSB7XHJcbiAgICAvLyAgIGNhc2UgJ3BsdXMnOlxyXG4gICAgLy8gICAgIG9wID0gJysnXHJcbiAgICAvLyAgICAgYnJlYWtcclxuICAgIC8vICAgY2FzZSAnbWludXMnOlxyXG4gICAgLy8gICAgIG9wID0gJy0nXHJcbiAgICAvLyAgICAgYnJlYWtcclxuICAgIC8vICAgY2FzZSAnbXVsdGlwbHknOlxyXG4gICAgLy8gICAgIG9wID0gJ1xcXFxjZG90ICdcclxuICAgIC8vICAgICBicmVha1xyXG4gICAgLy8gICBjYXNlICdkaXZpZGUnOlxyXG4gICAgLy8gICAgIHJldHVybiB0aGlzLmZyYWdtZW50KHJvb3QpXHJcbiAgICAvLyAgIGNhc2UgJ21vZHVsdXMnOlxyXG4gICAgLy8gICAgIG9wID0gJyUnXHJcbiAgICAvLyAgICAgYnJlYWtcclxuICAgIC8vICAgY2FzZSAnZXhwb25lbnQnOlxyXG4gICAgLy8gICAgIG9wID0gJ14nXHJcbiAgICAvLyAgICAgYnJlYWtcclxuICAgIC8vICAgZGVmYXVsdDpcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBsZXQgbGhzID0gdGhpcy5mb3JtYXQocm9vdC5saHMpXHJcbiAgICAvLyBsZXQgcmhzID0gdGhpcy5mb3JtYXQocm9vdC5yaHMpXHJcblxyXG4gICAgLy8gY29uc3QgcHJlY2VkZW5zT3JkZXI6IE9wZXJhdG9yVHlwZVtdW10gPSBbXHJcbiAgICAvLyAgIFsnbW9kdWx1cyddLFxyXG4gICAgLy8gICBbJ2V4cG9uZW50J10sXHJcbiAgICAvLyAgIFsnbXVsdGlwbHknXSxcclxuICAgIC8vICAgWydwbHVzJywgJ21pbnVzJ10sXHJcbiAgICAvLyBdXHJcblxyXG4gICAgLy8gY29uc3QgaGlnaGVyUHJlY2VkZW5zID0gKGE6IE9wZXJhdG9yVHlwZSwgYjogT3BlcmF0b3JUeXBlKSA9PiB7XHJcbiAgICAvLyAgIGNvbnN0IGRlcHRoID0gKG9wOiBPcGVyYXRvclR5cGUpID0+IHByZWNlZGVuc09yZGVyLmZpbmRJbmRleCh2YWwgPT4gdmFsLmluY2x1ZGVzKG9wKSlcclxuXHJcbiAgICAvLyAgIHJldHVybiBkZXB0aChiKSA+IGRlcHRoKGEpXHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gY29uc3Qgc2hvdWxkSGF2ZVBhcmVudGhlc2lzID0gKGNoaWxkOiBBU1QpID0+XHJcbiAgICAvLyAgIGNoaWxkLnR5cGUgPT09ICdvcGVyYXRvcicgJiYgaGlnaGVyUHJlY2VkZW5zKHJvb3Qub3BlcmF0b3IsIGNoaWxkLm9wZXJhdG9yKVxyXG5cclxuICAgIC8vIGxldCBsaHNQYXJlbiA9IHNob3VsZEhhdmVQYXJlbnRoZXNpcyhyb290LmxocylcclxuICAgIC8vIGxldCByaHNQYXJlbiA9IHNob3VsZEhhdmVQYXJlbnRoZXNpcyhyb290LnJocylcclxuXHJcbiAgICAvLyBsaHMgPSBsaHNQYXJlbiA/IGBcXFxcbGVmdCgke2xoc31cXFxccmlnaHQpYCA6IGxoc1xyXG5cclxuICAgIC8vIGlmIChyb290Lm9wZXJhdG9yID09PSAnZXhwb25lbnQnKSB7XHJcbiAgICAvLyAgIHJoc1BhcmVuID0gdHJ1ZVxyXG4gICAgLy8gICByaHMgPSByaHNQYXJlbiA/IGB7JHtyaHN9fWAgOiByaHNcclxuICAgIC8vIH0gZWxzZSB7XHJcbiAgICAvLyAgIHJocyA9IHJoc1BhcmVuID8gYFxcXFxsZWZ0KCR7cmhzfVxcXFxyaWdodClgIDogcmhzXHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcmV0dXJuIGAke2xoc30ke29wfSR7cmhzfWBcclxuICB9XHJcblxyXG4gIC8vIGZyYWdtZW50KHJvb3Q6IE9wZXJhdG9yTm9kZSkge1xyXG4gIC8vICAgbGV0IGxocyA9IHRoaXMuZm9ybWF0KHJvb3QubGhzKVxyXG4gIC8vICAgbGV0IHJocyA9IHRoaXMuZm9ybWF0KHJvb3QucmhzKVxyXG5cclxuICAvLyAgIHJldHVybiBgXFxcXGZyYWN7JHtsaHN9fXske3Joc319YFxyXG4gIC8vIH1cclxuXHJcbiAgbnVtYmVyKHJvb3Q6IE51bWJlck5vZGUpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcy5TeW1ib2wocm9vdC52YWx1ZSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uKHJvb3Q6IEZ1bmN0aW9uTm9kZSkge1xyXG4gICAgLy8gaWYgKHJvb3QudmFsdWUgPT09ICdzcXJ0Jykge1xyXG4gICAgLy8gICByZXR1cm4gYFxcXFwke3Jvb3QudmFsdWV9eyR7dGhpcy5mb3JtYXQocm9vdC5jb250ZW50KX19YFxyXG4gICAgLy8gfVxyXG4gICAgLy8gcmV0dXJuIGBcXFxcJHtyb290LnZhbHVlfVxcXFxsZWZ0KCR7dGhpcy5mb3JtYXQocm9vdC5jb250ZW50KX1cXFxccmlnaHQpYFxyXG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLmNhbGxmdW5jdGlvbihyb290LnZhbHVlLCB0aGlzLmZvcm1hdChyb290LmNvbnRlbnQpKVxyXG4gIH1cclxuXHJcbiAgdmFyaWFibGUocm9vdDogVmFyaWFibGVOb2RlKSB7XHJcbiAgICAvLyBpZiAoZ3JlZWtMZXR0ZXJzLm1hcChsID0+IGwubmFtZSkuaW5jbHVkZXMoKHJvb3QudmFsdWUgYXMgc3RyaW5nKS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgLy8gICByZXR1cm4gYFxcXFwke3Jvb3QudmFsdWV9YFxyXG4gICAgLy8gfVxyXG4gICAgLy8gcmV0dXJuIGAke3Jvb3QudmFsdWV9YFxyXG4gICAgcmV0dXJuIHRoaXMuU3ltYm9sKHJvb3QudmFsdWUpXHJcbiAgfVxyXG5cclxuICBlcXVhdGlvbihyb290OiBFcXVhdGlvbk5vZGUpIHtcclxuICAgIC8vIHJldHVybiBgJHt0aGlzLmZvcm1hdChyb290Lmxocyl9PSR7dGhpcy5mb3JtYXQocm9vdC5yaHMpfWBcclxuICAgIGNvbnN0IEVxdWF0aW9uID0gbmVyZGFtZXIuZ2V0Q29yZSgpLkVxdWF0aW9uO1xyXG4gICAgcmV0dXJuIG5ldyBFcXVhdGlvbih0aGlzLmZvcm1hdChyb290LmxocyksIHRoaXMuZm9ybWF0KHJvb3QucmhzKSlcclxuICB9XHJcblxyXG4gIHN1YnNjcmlwdCgpOiBuZXZlciB7XHJcbiAgICB0aHJvdyBFcnJvcignc3Vic2NyaXB0IG5vdCBpbXBsZW1lbnRlZCcpXHJcbiAgICAvLyBpZiAocm9vdC5zdWJzY3JpcHQudHlwZSA9PT0gJ3ZhcmlhYmxlJyAmJiAocm9vdC5zdWJzY3JpcHQudmFsdWUgYXMgc3RyaW5nKS5sZW5ndGggPT09IDEpIHtcclxuICAgIC8vICAgcmV0dXJuIGAke3RoaXMuZm9ybWF0KHJvb3QuYmFzZSl9XyR7dGhpcy5mb3JtYXQocm9vdC5zdWJzY3JpcHQpfWBcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyByZXR1cm4gYCR7dGhpcy5mb3JtYXQocm9vdC5iYXNlKX1feyR7dGhpcy5mb3JtYXQocm9vdC5zdWJzY3JpcHQpfX1gXHJcbiAgfVxyXG5cclxuICB1bmlfb3BlcmF0b3Iocm9vdDogVW5pT3Blck5vZGUpIHtcclxuICAgIGlmIChyb290Lm9wZXJhdG9yID09PSAnbWludXMnKSB7XHJcbiAgICAgIC8vIHJldHVybiBgLSR7dGhpcy5mb3JtYXQocm9vdC52YWx1ZSBhcyBBU1QpfWBcclxuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnN1YnRyYWN0KG5ldyB0aGlzLlN5bWJvbCgwKSwgdGhpcy5mb3JtYXQocm9vdC52YWx1ZSBhcyBBU1QpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmZvcm1hdChyb290LnZhbHVlIGFzIEFTVClcclxuICB9XHJcbn1cclxuIl19