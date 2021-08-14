"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var greekLetters = _interopRequireWildcard(require("../models/greek-letters"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MathFormatter {
  constructor(ast) {
    _defineProperty(this, "ast", void 0);

    this.ast = ast;
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
        return this.subscript(root);

      case 'uni-operator':
        return this.uni_operator(root);

      default:
        throw Error('Unexpected type: ' + root);
    }
  }

  operator(root) {
    let op = root.operator;

    switch (op) {
      case 'plus':
        op = '+';
        break;

      case 'minus':
        op = '-';
        break;

      case 'multiply':
        op = '*';
        break;

      case 'divide':
        op = '/';
        break;

      case 'modulus':
        op = '%';
        break;

      case 'exponent':
        op = '^';
        break;

      default:
    }

    let lhs = this.format(root.lhs);
    let rhs = this.format(root.rhs);
    const precedensOrder = [['modulus'], ['exponent'], ['multiply', 'divide'], ['plus', 'minus']];

    const higherPrecedens = (a, b) => {
      const depth = op => precedensOrder.findIndex(val => val.includes(op));

      return depth(b) > depth(a);
    };

    const shouldHaveParenthesis = child => child.type === 'operator' && higherPrecedens(root.operator, child.operator);

    let lhsParen = shouldHaveParenthesis(root.lhs);
    let rhsParen = shouldHaveParenthesis(root.rhs); // Special case for division

    rhsParen = rhsParen || op === '/' && root.rhs.type === 'operator';

    if (root.operator === 'exponent') {
      if (root.rhs.type === 'number' && root.rhs.value < 0) {
        rhsParen = true;
      }
    }

    lhs = lhsParen ? `(${lhs})` : lhs;
    rhs = rhsParen ? `(${rhs})` : rhs;
    return lhs + op + rhs;
  }

  number(root) {
    return `${root.value}`;
  }

  function(root) {
    return `${root.value}(${this.format(root.content)})`;
  }

  variable(root) {
    let greekLetter = greekLetters.getSymbol(root.value);

    if (greekLetter) {
      return greekLetter;
    }

    return `${root.value}`;
  }

  equation(root) {
    return `${this.format(root.lhs)}=${this.format(root.rhs)}`;
  }

  subscript(root) {
    if (root.subscript.type === 'variable' && root.subscript.value.length === 1) {
      return `${this.format(root.base)}_${this.format(root.subscript)}`;
    }

    return `${this.format(root.base)}_(${this.format(root.subscript)})`;
  }

  uni_operator(root) {
    if (root.operator === 'minus') {
      return `-${this.format(root.value)}`;
    }

    return this.format(root.value);
  }

}

exports.default = MathFormatter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXJzL0Zvcm1hdHRlck1hdGgudHMiXSwibmFtZXMiOlsiTWF0aEZvcm1hdHRlciIsImNvbnN0cnVjdG9yIiwiYXN0IiwiZm9ybWF0Iiwicm9vdCIsInR5cGUiLCJvcGVyYXRvciIsIm51bWJlciIsImZ1bmN0aW9uIiwidmFyaWFibGUiLCJlcXVhdGlvbiIsInN1YnNjcmlwdCIsInVuaV9vcGVyYXRvciIsIkVycm9yIiwib3AiLCJsaHMiLCJyaHMiLCJwcmVjZWRlbnNPcmRlciIsImhpZ2hlclByZWNlZGVucyIsImEiLCJiIiwiZGVwdGgiLCJmaW5kSW5kZXgiLCJ2YWwiLCJpbmNsdWRlcyIsInNob3VsZEhhdmVQYXJlbnRoZXNpcyIsImNoaWxkIiwibGhzUGFyZW4iLCJyaHNQYXJlbiIsInZhbHVlIiwiY29udGVudCIsImdyZWVrTGV0dGVyIiwiZ3JlZWtMZXR0ZXJzIiwiZ2V0U3ltYm9sIiwibGVuZ3RoIiwiYmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztBQUdlLE1BQU1BLGFBQU4sQ0FBb0I7QUFHakNDLEVBQUFBLFdBQVcsQ0FBQ0MsR0FBRCxFQUFXO0FBQUE7O0FBQ3BCLFNBQUtBLEdBQUwsR0FBV0EsR0FBWDtBQUNEOztBQUVEQyxFQUFBQSxNQUFNLENBQUNDLElBQUksR0FBRyxLQUFLRixHQUFiLEVBQTBCO0FBQzlCLFFBQUlFLElBQUksS0FBSyxJQUFiLEVBQW1CO0FBQ2pCLGFBQU8sRUFBUDtBQUNEOztBQUVELFlBQVFBLElBQUksQ0FBQ0MsSUFBYjtBQUNFLFdBQUssVUFBTDtBQUNFLGVBQU8sS0FBS0MsUUFBTCxDQUFjRixJQUFkLENBQVA7O0FBQ0YsV0FBSyxRQUFMO0FBQ0UsZUFBTyxLQUFLRyxNQUFMLENBQVlILElBQVosQ0FBUDs7QUFDRixXQUFLLFVBQUw7QUFDRSxlQUFPLEtBQUtJLFFBQUwsQ0FBY0osSUFBZCxDQUFQOztBQUNGLFdBQUssVUFBTDtBQUNFLGVBQU8sS0FBS0ssUUFBTCxDQUFjTCxJQUFkLENBQVA7O0FBQ0YsV0FBSyxVQUFMO0FBQ0UsZUFBTyxLQUFLTSxRQUFMLENBQWNOLElBQWQsQ0FBUDs7QUFDRixXQUFLLFdBQUw7QUFDRSxlQUFPLEtBQUtPLFNBQUwsQ0FBZVAsSUFBZixDQUFQOztBQUNGLFdBQUssY0FBTDtBQUNFLGVBQU8sS0FBS1EsWUFBTCxDQUFrQlIsSUFBbEIsQ0FBUDs7QUFDRjtBQUNFLGNBQU1TLEtBQUssQ0FBQyxzQkFBc0JULElBQXZCLENBQVg7QUFoQko7QUFrQkQ7O0FBRURFLEVBQUFBLFFBQVEsQ0FBQ0YsSUFBRCxFQUE2QjtBQUNuQyxRQUFJVSxFQUFVLEdBQUdWLElBQUksQ0FBQ0UsUUFBdEI7O0FBRUEsWUFBUVEsRUFBUjtBQUNFLFdBQUssTUFBTDtBQUNFQSxRQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNBOztBQUNGLFdBQUssT0FBTDtBQUNFQSxRQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNBOztBQUNGLFdBQUssVUFBTDtBQUNFQSxRQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNBOztBQUNGLFdBQUssUUFBTDtBQUNFQSxRQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNBOztBQUNGLFdBQUssU0FBTDtBQUNFQSxRQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNBOztBQUNGLFdBQUssVUFBTDtBQUNFQSxRQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNBOztBQUNGO0FBbkJGOztBQXNCQSxRQUFJQyxHQUFHLEdBQUcsS0FBS1osTUFBTCxDQUFZQyxJQUFJLENBQUNXLEdBQWpCLENBQVY7QUFDQSxRQUFJQyxHQUFHLEdBQUcsS0FBS2IsTUFBTCxDQUFZQyxJQUFJLENBQUNZLEdBQWpCLENBQVY7QUFFQSxVQUFNQyxjQUFjLEdBQUcsQ0FDckIsQ0FBQyxTQUFELENBRHFCLEVBRXJCLENBQUMsVUFBRCxDQUZxQixFQUdyQixDQUFDLFVBQUQsRUFBYSxRQUFiLENBSHFCLEVBSXJCLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FKcUIsQ0FBdkI7O0FBT0EsVUFBTUMsZUFBZSxHQUFHLENBQUNDLENBQUQsRUFBWUMsQ0FBWixLQUEwQjtBQUNoRCxZQUFNQyxLQUFLLEdBQUlQLEVBQUQsSUFBZ0JHLGNBQWMsQ0FBQ0ssU0FBZixDQUF5QkMsR0FBRyxJQUFJQSxHQUFHLENBQUNDLFFBQUosQ0FBYVYsRUFBYixDQUFoQyxDQUE5Qjs7QUFFQSxhQUFPTyxLQUFLLENBQUNELENBQUQsQ0FBTCxHQUFXQyxLQUFLLENBQUNGLENBQUQsQ0FBdkI7QUFDRCxLQUpEOztBQU1BLFVBQU1NLHFCQUFxQixHQUFJQyxLQUFELElBQzVCQSxLQUFLLENBQUNyQixJQUFOLEtBQWUsVUFBZixJQUE2QmEsZUFBZSxDQUFDZCxJQUFJLENBQUNFLFFBQU4sRUFBaUJvQixLQUFLLENBQUNwQixRQUF2QixDQUQ5Qzs7QUFHQSxRQUFJcUIsUUFBUSxHQUFHRixxQkFBcUIsQ0FBQ3JCLElBQUksQ0FBQ1csR0FBTixDQUFwQztBQUNBLFFBQUlhLFFBQVEsR0FBR0gscUJBQXFCLENBQUNyQixJQUFJLENBQUNZLEdBQU4sQ0FBcEMsQ0E3Q21DLENBK0NuQzs7QUFDQVksSUFBQUEsUUFBUSxHQUFHQSxRQUFRLElBQUtkLEVBQUUsS0FBSyxHQUFQLElBQWNWLElBQUksQ0FBQ1ksR0FBTCxDQUFVWCxJQUFWLEtBQW1CLFVBQXpEOztBQUVBLFFBQUlELElBQUksQ0FBQ0UsUUFBTCxLQUFrQixVQUF0QixFQUFrQztBQUNoQyxVQUFJRixJQUFJLENBQUNZLEdBQUwsQ0FBVVgsSUFBVixLQUFtQixRQUFuQixJQUErQkQsSUFBSSxDQUFDWSxHQUFMLENBQVVhLEtBQVYsR0FBbUIsQ0FBdEQsRUFBeUQ7QUFDdkRELFFBQUFBLFFBQVEsR0FBRyxJQUFYO0FBQ0Q7QUFDRjs7QUFFRGIsSUFBQUEsR0FBRyxHQUFHWSxRQUFRLEdBQUksSUFBR1osR0FBSSxHQUFYLEdBQWdCQSxHQUE5QjtBQUNBQyxJQUFBQSxHQUFHLEdBQUdZLFFBQVEsR0FBSSxJQUFHWixHQUFJLEdBQVgsR0FBZ0JBLEdBQTlCO0FBRUEsV0FBT0QsR0FBRyxHQUFHRCxFQUFOLEdBQVdFLEdBQWxCO0FBQ0Q7O0FBRURULEVBQUFBLE1BQU0sQ0FBQ0gsSUFBRCxFQUEyQjtBQUMvQixXQUFRLEdBQUVBLElBQUksQ0FBQ3lCLEtBQU0sRUFBckI7QUFDRDs7QUFFRHJCLEVBQUFBLFFBQVEsQ0FBQ0osSUFBRCxFQUE2QjtBQUNuQyxXQUFRLEdBQUVBLElBQUksQ0FBQ3lCLEtBQU0sSUFBRyxLQUFLMUIsTUFBTCxDQUFZQyxJQUFJLENBQUMwQixPQUFqQixDQUEwQixHQUFsRDtBQUNEOztBQUVEckIsRUFBQUEsUUFBUSxDQUFDTCxJQUFELEVBQTZCO0FBQ25DLFFBQUkyQixXQUFXLEdBQUdDLFlBQVksQ0FBQ0MsU0FBYixDQUF1QjdCLElBQUksQ0FBQ3lCLEtBQTVCLENBQWxCOztBQUVBLFFBQUlFLFdBQUosRUFBaUI7QUFDZixhQUFPQSxXQUFQO0FBQ0Q7O0FBRUQsV0FBUSxHQUFFM0IsSUFBSSxDQUFDeUIsS0FBTSxFQUFyQjtBQUNEOztBQUVEbkIsRUFBQUEsUUFBUSxDQUFDTixJQUFELEVBQTZCO0FBQ25DLFdBQVEsR0FBRSxLQUFLRCxNQUFMLENBQVlDLElBQUksQ0FBQ1csR0FBakIsQ0FBc0IsSUFBRyxLQUFLWixNQUFMLENBQVlDLElBQUksQ0FBQ1ksR0FBakIsQ0FBc0IsRUFBekQ7QUFDRDs7QUFFREwsRUFBQUEsU0FBUyxDQUFDUCxJQUFELEVBQThCO0FBQ3JDLFFBQUlBLElBQUksQ0FBQ08sU0FBTCxDQUFlTixJQUFmLEtBQXdCLFVBQXhCLElBQXVDRCxJQUFJLENBQUNPLFNBQUwsQ0FBZWtCLEtBQWhCLENBQWlDSyxNQUFqQyxLQUE0QyxDQUF0RixFQUF5RjtBQUN2RixhQUFRLEdBQUUsS0FBSy9CLE1BQUwsQ0FBWUMsSUFBSSxDQUFDK0IsSUFBakIsQ0FBdUIsSUFBRyxLQUFLaEMsTUFBTCxDQUFZQyxJQUFJLENBQUNPLFNBQWpCLENBQTRCLEVBQWhFO0FBQ0Q7O0FBRUQsV0FBUSxHQUFFLEtBQUtSLE1BQUwsQ0FBWUMsSUFBSSxDQUFDK0IsSUFBakIsQ0FBdUIsS0FBSSxLQUFLaEMsTUFBTCxDQUFZQyxJQUFJLENBQUNPLFNBQWpCLENBQTRCLEdBQWpFO0FBQ0Q7O0FBRURDLEVBQUFBLFlBQVksQ0FBQ1IsSUFBRCxFQUE0QjtBQUN0QyxRQUFJQSxJQUFJLENBQUNFLFFBQUwsS0FBa0IsT0FBdEIsRUFBK0I7QUFDN0IsYUFBUSxJQUFHLEtBQUtILE1BQUwsQ0FBWUMsSUFBSSxDQUFDeUIsS0FBakIsQ0FBK0IsRUFBMUM7QUFDRDs7QUFFRCxXQUFPLEtBQUsxQixNQUFMLENBQVlDLElBQUksQ0FBQ3lCLEtBQWpCLENBQVA7QUFDRDs7QUFsSWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZ3JlZWtMZXR0ZXJzIGZyb20gJy4uL21vZGVscy9ncmVlay1sZXR0ZXJzJ1xyXG5pbXBvcnQgQVNULCB7IEVxdWF0aW9uTm9kZSwgRnVuY3Rpb25Ob2RlLCBOdW1iZXJOb2RlLCBPcGVyYXRvck5vZGUsIFN1YnNjcmlwdE5vZGUsIFVuaU9wZXJOb2RlLCBWYXJpYWJsZU5vZGUgfSBmcm9tICcuL0FTVCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGhGb3JtYXR0ZXIge1xyXG4gIGFzdDogQVNUXHJcblxyXG4gIGNvbnN0cnVjdG9yKGFzdDogQVNUKSB7XHJcbiAgICB0aGlzLmFzdCA9IGFzdFxyXG4gIH1cclxuXHJcbiAgZm9ybWF0KHJvb3QgPSB0aGlzLmFzdCk6IHN0cmluZyB7XHJcbiAgICBpZiAocm9vdCA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gJydcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKHJvb3QudHlwZSkge1xyXG4gICAgICBjYXNlICdvcGVyYXRvcic6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlcmF0b3Iocm9vdClcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5udW1iZXIocm9vdClcclxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmZ1bmN0aW9uKHJvb3QpXHJcbiAgICAgIGNhc2UgJ3ZhcmlhYmxlJzpcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZShyb290KVxyXG4gICAgICBjYXNlICdlcXVhdGlvbic6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXF1YXRpb24ocm9vdClcclxuICAgICAgY2FzZSAnc3Vic2NyaXB0JzpcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHQocm9vdClcclxuICAgICAgY2FzZSAndW5pLW9wZXJhdG9yJzpcclxuICAgICAgICByZXR1cm4gdGhpcy51bmlfb3BlcmF0b3Iocm9vdClcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aHJvdyBFcnJvcignVW5leHBlY3RlZCB0eXBlOiAnICsgcm9vdClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZXJhdG9yKHJvb3Q6IE9wZXJhdG9yTm9kZSk6IHN0cmluZyB7XHJcbiAgICBsZXQgb3A6IHN0cmluZyA9IHJvb3Qub3BlcmF0b3JcclxuXHJcbiAgICBzd2l0Y2ggKG9wKSB7XHJcbiAgICAgIGNhc2UgJ3BsdXMnOlxyXG4gICAgICAgIG9wID0gJysnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbWludXMnOlxyXG4gICAgICAgIG9wID0gJy0nXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbXVsdGlwbHknOlxyXG4gICAgICAgIG9wID0gJyonXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnZGl2aWRlJzpcclxuICAgICAgICBvcCA9ICcvJ1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ21vZHVsdXMnOlxyXG4gICAgICAgIG9wID0gJyUnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnZXhwb25lbnQnOlxyXG4gICAgICAgIG9wID0gJ14nXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbGhzID0gdGhpcy5mb3JtYXQocm9vdC5saHMpXHJcbiAgICBsZXQgcmhzID0gdGhpcy5mb3JtYXQocm9vdC5yaHMpXHJcblxyXG4gICAgY29uc3QgcHJlY2VkZW5zT3JkZXIgPSBbXHJcbiAgICAgIFsnbW9kdWx1cyddLFxyXG4gICAgICBbJ2V4cG9uZW50J10sXHJcbiAgICAgIFsnbXVsdGlwbHknLCAnZGl2aWRlJ10sXHJcbiAgICAgIFsncGx1cycsICdtaW51cyddLFxyXG4gICAgXVxyXG5cclxuICAgIGNvbnN0IGhpZ2hlclByZWNlZGVucyA9IChhOiBzdHJpbmcsIGI6IHN0cmluZykgPT4ge1xyXG4gICAgICBjb25zdCBkZXB0aCA9IChvcDogc3RyaW5nKSA9PiBwcmVjZWRlbnNPcmRlci5maW5kSW5kZXgodmFsID0+IHZhbC5pbmNsdWRlcyhvcCkpXHJcblxyXG4gICAgICByZXR1cm4gZGVwdGgoYikgPiBkZXB0aChhKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNob3VsZEhhdmVQYXJlbnRoZXNpcyA9IChjaGlsZDogQVNUKSA9PlxyXG4gICAgICBjaGlsZC50eXBlID09PSAnb3BlcmF0b3InICYmIGhpZ2hlclByZWNlZGVucyhyb290Lm9wZXJhdG9yISwgY2hpbGQub3BlcmF0b3IhKVxyXG5cclxuICAgIGxldCBsaHNQYXJlbiA9IHNob3VsZEhhdmVQYXJlbnRoZXNpcyhyb290LmxocyEpXHJcbiAgICBsZXQgcmhzUGFyZW4gPSBzaG91bGRIYXZlUGFyZW50aGVzaXMocm9vdC5yaHMhKVxyXG5cclxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgZGl2aXNpb25cclxuICAgIHJoc1BhcmVuID0gcmhzUGFyZW4gfHwgKG9wID09PSAnLycgJiYgcm9vdC5yaHMhLnR5cGUgPT09ICdvcGVyYXRvcicpXHJcblxyXG4gICAgaWYgKHJvb3Qub3BlcmF0b3IgPT09ICdleHBvbmVudCcpIHtcclxuICAgICAgaWYgKHJvb3QucmhzIS50eXBlID09PSAnbnVtYmVyJyAmJiByb290LnJocyEudmFsdWUhIDwgMCkge1xyXG4gICAgICAgIHJoc1BhcmVuID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGhzID0gbGhzUGFyZW4gPyBgKCR7bGhzfSlgIDogbGhzXHJcbiAgICByaHMgPSByaHNQYXJlbiA/IGAoJHtyaHN9KWAgOiByaHNcclxuXHJcbiAgICByZXR1cm4gbGhzICsgb3AgKyByaHNcclxuICB9XHJcblxyXG4gIG51bWJlcihyb290OiBOdW1iZXJOb2RlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgJHtyb290LnZhbHVlfWBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uKHJvb3Q6IEZ1bmN0aW9uTm9kZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYCR7cm9vdC52YWx1ZX0oJHt0aGlzLmZvcm1hdChyb290LmNvbnRlbnQpfSlgXHJcbiAgfVxyXG5cclxuICB2YXJpYWJsZShyb290OiBWYXJpYWJsZU5vZGUpOiBzdHJpbmcge1xyXG4gICAgbGV0IGdyZWVrTGV0dGVyID0gZ3JlZWtMZXR0ZXJzLmdldFN5bWJvbChyb290LnZhbHVlIGFzIHN0cmluZylcclxuXHJcbiAgICBpZiAoZ3JlZWtMZXR0ZXIpIHtcclxuICAgICAgcmV0dXJuIGdyZWVrTGV0dGVyXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGAke3Jvb3QudmFsdWV9YFxyXG4gIH1cclxuXHJcbiAgZXF1YXRpb24ocm9vdDogRXF1YXRpb25Ob2RlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmZvcm1hdChyb290Lmxocyl9PSR7dGhpcy5mb3JtYXQocm9vdC5yaHMpfWBcclxuICB9XHJcblxyXG4gIHN1YnNjcmlwdChyb290OiBTdWJzY3JpcHROb2RlKTogc3RyaW5nIHtcclxuICAgIGlmIChyb290LnN1YnNjcmlwdC50eXBlID09PSAndmFyaWFibGUnICYmIChyb290LnN1YnNjcmlwdC52YWx1ZSBhcyBzdHJpbmcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByZXR1cm4gYCR7dGhpcy5mb3JtYXQocm9vdC5iYXNlKX1fJHt0aGlzLmZvcm1hdChyb290LnN1YnNjcmlwdCl9YFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBgJHt0aGlzLmZvcm1hdChyb290LmJhc2UpfV8oJHt0aGlzLmZvcm1hdChyb290LnN1YnNjcmlwdCl9KWBcclxuICB9XHJcblxyXG4gIHVuaV9vcGVyYXRvcihyb290OiBVbmlPcGVyTm9kZSk6IHN0cmluZyB7XHJcbiAgICBpZiAocm9vdC5vcGVyYXRvciA9PT0gJ21pbnVzJykge1xyXG4gICAgICByZXR1cm4gYC0ke3RoaXMuZm9ybWF0KHJvb3QudmFsdWUgYXMgQVNUKX1gXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0KHJvb3QudmFsdWUgYXMgQVNUKVxyXG4gIH1cclxufVxyXG4iXX0=