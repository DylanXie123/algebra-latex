"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _functions = _interopRequireDefault(require("./models/functions"));

var _logger = require("./logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ParserLatex {
  /**
   * @return `null`: parser error
   * @return '': empty input
   * @return `AST`: normal
   */
  constructor(latex, Lexer, options = {}) {
    _defineProperty(this, "lexer", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "ast", void 0);

    _defineProperty(this, "current_token", void 0);

    _defineProperty(this, "peek_token", void 0);

    _defineProperty(this, "functions", void 0);

    // if (!(Lexer instanceof LexerClass)) {
    //   throw Error('Please parse a valid lexer as second argument')
    // }
    this.lexer = new Lexer(latex);
    this.options = options;
    this.ast = null;
    this.current_token = null;
    this.peek_token = null;
    this.functions = _functions.default.concat((options === null || options === void 0 ? void 0 : options.functions) || []);
  }

  parse() {
    (0, _logger.debug)('\nLatex parser .parse()');

    if (this.lexer.text.length === 0) {
      this.ast = '';
      return '';
    } else {
      this.ast = this.equation();
      this.eat('EOF');
      return this.ast;
    }
  }
  /**
   * invoke this method to update `this.current_token`,
   * update `this.current_token` means that method is ready to handle 
   * current token
   */


  next_token() {
    if (this.peek_token !== null) {
      this.current_token = this.peek_token;
      this.peek_token = null;
      (0, _logger.debug)('next token from peek', this.current_token);
    } else {
      this.current_token = this.lexer.next_token();
      (0, _logger.debug)('next token', this.current_token);
    }

    return this.current_token;
  }
  /**
   * update `this.peek_token` if it's not null,
   * method usually use `this.peek_token` to see if it can handle next token,
   * if method can handle next token, it will invoke `this.next_token()` to 
   * update current token and handle it
   */


  peek() {
    if (this.peek_token === null) {
      this.peek_token = this.lexer.next_token();
    }

    (0, _logger.debug)('next token from peek', this.peek_token);
    return this.peek_token;
  }

  error(message) {
    let line = this.lexer.text.split('\n')[this.lexer.line];
    let spacing = '';

    for (let i = 0; i < this.lexer.col; i++) {
      spacing += ' ';
    }

    throw Error(`Parser error\n${line}\n${spacing}^\nError at line: ${this.lexer.line + 1} col: ${this.lexer.col + 1}\n${message}`);
  }
  /**
   * similar to `this.next_token()`, but it assert the type of
   * next token
   * @param  {string} token_type
   */


  eat(token_type) {
    if (this.next_token().type !== token_type) {
      this.error(`Expected ${token_type} found ${JSON.stringify(this.current_token)}`);
    }
  }

  equation() {
    // equation : expr ( EQUAL expr )?
    let lhs = this.expr();

    if (this.peek().type !== 'equal') {
      return lhs;
    } else {
      this.next_token();
    }

    let rhs = this.expr();
    return {
      type: 'equation',
      lhs,
      rhs
    };
  }

  expr() {
    // expr : operator
    (0, _logger.debug)('expr');
    this.peek();

    if (this.peek_token.type === 'number' || this.peek_token.type === 'operator' || this.peek_token.type === 'variable' || // this.peek_token.type === 'function' ||
    this.peek_token.type === 'keyword' || this.peek_token.type === 'bracket') {
      return this.operator();
    } // if (this.peek_token.type === 'bracket' && this.peek_token.open === false) {
    //   return null
    // }
    // if (this.peek_token!.type === 'EOF') {
    //   this.next_token()
    //   return null
    // }


    this.next_token();
    this.error(`Unexpected token: ${JSON.stringify(this.current_token)}`);
  }

  keyword() {
    // keyword : KEYWORD
    //         | fraction
    //         | function
    (0, _logger.debug)('keyword');

    if (this.peek().type !== 'keyword') {
      throw Error('Expected keyword found ' + JSON.stringify(this.peek_token));
    }
    /* this.peek_token.type === "keyword" */


    let kwd = this.peek_token.value;
    kwd = kwd.toLowerCase();
    (0, _logger.debug)('keyword -', kwd);

    if (kwd === 'frac') {
      return this.fraction();
    }

    if (kwd === 'sqrt') {
      return this.sqrt();
    }

    if (this.functions.includes(kwd.toLowerCase())) {
      return this.function();
    }

    this.eat('keyword');
    this.error('Unknow keyword:' + this.current_token.value);
  }

  sqrt() {
    // sqrt : SQRT (L_SQUARE_BRAC NUMBER R_SQUARE_BRAC)? GROUP
    (0, _logger.debug)('sqrt');
    this.eat('keyword');

    if (this.current_token.value !== 'sqrt') {
      this.error('Expected sqrt found ' + JSON.stringify(this.current_token));
    }

    if (this.peek().value !== '[') {
      let content = this.group();
      return {
        type: 'function',
        value: 'sqrt',
        content
      };
    }

    this.eat('bracket');

    if (this.current_token.value !== '[') {
      this.error('Expected "[" bracket, found ' + JSON.stringify(this.current_token));
    }

    let base = this.number();
    this.eat('bracket');

    if (this.current_token.value !== ']') {
      this.error('Expected "]" bracket, found ' + JSON.stringify(this.current_token));
    }

    let value = this.group();
    return {
      type: 'operator',
      operator: 'exponent',
      lhs: value,
      rhs: {
        type: 'operator',
        operator: 'divide',
        lhs: {
          type: 'number',
          value: 1
        },
        rhs: base
      }
    };
  }

  fraction() {
    // fraction : FRAC group group
    (0, _logger.debug)('fraction');
    this.eat('keyword');

    if (this.current_token.value !== 'frac') {
      this.error('Expected fraction found ' + JSON.stringify(this.current_token));
    }

    let nominator = this.group();
    let denominator = this.group();
    return {
      type: 'operator',
      operator: 'divide',
      lhs: nominator,
      rhs: denominator
    };
  }

  function() {
    // function : FUNCTION ( group | number )
    (0, _logger.debug)('function');
    this.eat('keyword');
    let value = this.current_token.value;
    let content;

    if (this.peek().type === 'bracket') {
      content = this.group();
    } else {
      content = this.number();
    }

    return {
      type: 'function',
      value: value.toString(),
      content: content
    };
  }

  group() {
    // group : LBRACKET expr RBRACKET
    (0, _logger.debug)('start group');
    this.eat('bracket');

    if (this.current_token.open !== true) {
      this.error('Expected opening bracket found ' + this.current_token);
    }

    let content = this.expr();
    this.eat('bracket');

    if (this.current_token.open !== false) {
      this.error('Expected closing bracket found ' + this.current_token);
    }

    (0, _logger.debug)('end group');
    return content;
  }

  operator() {
    // operator : operator_term ((PLUS | MINUS) operator)?
    (0, _logger.debug)('operator left');
    let lhs = this.operator_multiply();
    let op = this.peek();

    if (op.type !== 'operator' || op.value !== 'plus' && op.value !== 'minus') {
      (0, _logger.debug)('operator only left side');
      return lhs;
    } // Operator token


    this.next_token();
    (0, _logger.debug)('operator right');
    let rhs = this.operator();
    return {
      type: 'operator',
      operator: op.value,
      lhs,
      rhs
    };
  }

  operator_multiply() {
    // operator_multiply : (operator_divide | GROUP) ( (MULTIPLY operator_multiply) | number )?
    (0, _logger.debug)('op mul left');
    let lhs = this.operator_divide();
    let op = this.peek();

    if (op.type === 'number' || op.type === 'variable' || op.type === 'keyword' || op.type === 'bracket' && op.value === '(') {
      op = {
        type: 'operator',
        value: 'multiply'
      };
    } else if (op.type !== 'operator' || op.value !== 'multiply' && op.value !== 'divide') {
      (0, _logger.debug)('term only left side');
      return lhs;
    } else {
      // Operator token
      this.next_token();
    }

    (0, _logger.debug)('op mul right');
    let rhs = this.operator_multiply();
    return {
      type: 'operator',
      operator: op.value,
      lhs,
      rhs
    };
  }

  operator_divide() {
    // operator_divide : operator_mod operator_divide_prime
    (0, _logger.debug)('operator_divide');
    let lhs = this.operator_mod();
    const divideResult = this.operator_divide_prime(lhs);
    return divideResult;
  }

  operator_divide_prime(lhs) {
    // operator_divide_prime : epsilon | DIVIDE operator_mod operator_divide_prime
    let op = this.peek();

    if (op.type !== 'operator' || op.value !== 'divide') {
      (0, _logger.debug)('operator_divide_prime - epsilon');
      return lhs;
    } else {
      // Operator token
      this.next_token();
    }

    (0, _logger.debug)('operator_divide_prime - next operator');
    let rhs = this.operator_mod();
    return this.operator_divide_prime({
      type: 'operator',
      operator: 'divide',
      lhs,
      rhs
    });
  }

  operator_mod() {
    // operator_mod : operator_exp ( MODULUS operator_mod )?
    (0, _logger.debug)('modulus left');
    let lhs = this.operator_exp();
    let op = this.peek();

    if (op.type !== 'operator' || op.value !== 'modulus') {
      (0, _logger.debug)('modulus only left side');
      return lhs;
    } else {
      // Operator token
      this.next_token();
    }

    (0, _logger.debug)('modulus right');
    let rhs = this.operator_mod();
    return {
      type: 'operator',
      operator: 'modulus',
      lhs,
      rhs
    };
  }

  operator_exp() {
    // operator_exp : subscript ( EXPONENT operator_exp )?
    let lhs = this.subscript();
    let op = this.peek();

    if (op.type !== 'operator' || op.value !== 'exponent') {
      (0, _logger.debug)('modulus only left side');
      return lhs;
    } else {
      // Operator token
      this.next_token();
    }

    let rhs = this.operator_exp();
    return {
      type: 'operator',
      operator: 'exponent',
      lhs,
      rhs
    };
  }

  variable() {
    this.eat('variable');
    return {
      type: 'variable',
      value: this.current_token.value.toString()
    };
  }

  subscript() {
    // subscript : number ( SUBSCRIPT subscript )?
    const base_num = this.number();

    if (this.peek().type === 'underscore') {
      this.eat('underscore');
      const sub_value = this.subscript();
      return {
        type: 'subscript',
        base: base_num,
        subscript: sub_value
      };
    }

    return base_num;
  }

  number() {
    // number : NUMBER
    //        | uni_operator
    //        | variable
    //        | keyword
    //        | symbol
    //        | group
    (0, _logger.debug)('number');
    this.peek();

    if (this.peek_token.type === 'number') {
      this.next_token();
      return {
        type: "number",
        value: this.current_token.value
      };
    }

    if (this.peek_token.type === 'operator') {
      return this.uni_operator();
    }

    if (this.peek_token.type === 'variable') {
      return this.variable();
    }

    if (this.peek_token.type === 'keyword') {
      return this.keyword();
    }

    if (this.peek_token.type === 'bracket') {
      return this.group();
    }

    this.next_token();
    this.error('Expected number, variable, function, group, or + - found ' + JSON.stringify(this.current_token));
  }

  uni_operator() {
    this.eat('operator');

    if (this.current_token.value === 'plus' || this.current_token.value === 'minus') {
      let prefix = this.current_token.value;
      let value = this.number();

      if (value.type === 'number') {
        return {
          type: 'number',
          value: prefix === 'minus' ? -value.value : value.value
        };
      }

      return {
        type: 'uni-operator',
        operator: prefix,
        value
      };
    } else {
      this.error('Unsupported uni-operator');
    }
  }

}

exports.default = ParserLatex;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyTGF0ZXgiLCJjb25zdHJ1Y3RvciIsImxhdGV4IiwiTGV4ZXIiLCJvcHRpb25zIiwibGV4ZXIiLCJhc3QiLCJjdXJyZW50X3Rva2VuIiwicGVla190b2tlbiIsImZ1bmN0aW9ucyIsImNvbmNhdCIsInBhcnNlIiwidGV4dCIsImxlbmd0aCIsImVxdWF0aW9uIiwiZWF0IiwibmV4dF90b2tlbiIsInBlZWsiLCJlcnJvciIsIm1lc3NhZ2UiLCJsaW5lIiwic3BsaXQiLCJzcGFjaW5nIiwiaSIsImNvbCIsIkVycm9yIiwidG9rZW5fdHlwZSIsInR5cGUiLCJKU09OIiwic3RyaW5naWZ5IiwibGhzIiwiZXhwciIsInJocyIsIm9wZXJhdG9yIiwia2V5d29yZCIsImt3ZCIsInZhbHVlIiwidG9Mb3dlckNhc2UiLCJmcmFjdGlvbiIsInNxcnQiLCJpbmNsdWRlcyIsImZ1bmN0aW9uIiwiY29udGVudCIsImdyb3VwIiwiYmFzZSIsIm51bWJlciIsIm5vbWluYXRvciIsImRlbm9taW5hdG9yIiwidG9TdHJpbmciLCJvcGVuIiwib3BlcmF0b3JfbXVsdGlwbHkiLCJvcCIsIm9wZXJhdG9yX2RpdmlkZSIsIm9wZXJhdG9yX21vZCIsImRpdmlkZVJlc3VsdCIsIm9wZXJhdG9yX2RpdmlkZV9wcmltZSIsIm9wZXJhdG9yX2V4cCIsInN1YnNjcmlwdCIsInZhcmlhYmxlIiwiYmFzZV9udW0iLCJzdWJfdmFsdWUiLCJ1bmlfb3BlcmF0b3IiLCJwcmVmaXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBS2UsTUFBTUEsV0FBTixDQUFrQjtBQUkvQjtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBTUVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFnQkMsS0FBaEIsRUFBNEJDLE9BQVksR0FBRyxFQUEzQyxFQUErQztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUN4RDtBQUNBO0FBQ0E7QUFFQSxTQUFLQyxLQUFMLEdBQWEsSUFBSUYsS0FBSixDQUFVRCxLQUFWLENBQWI7QUFDQSxTQUFLRSxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLRSxHQUFMLEdBQVcsSUFBWDtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkEsbUJBQVVDLE1BQVYsQ0FBaUIsQ0FBQU4sT0FBTyxTQUFQLElBQUFBLE9BQU8sV0FBUCxZQUFBQSxPQUFPLENBQUVLLFNBQVQsS0FBc0IsRUFBdkMsQ0FBakI7QUFDRDs7QUFFREUsRUFBQUEsS0FBSyxHQUFHO0FBQ04sdUJBQU0seUJBQU47O0FBQ0EsUUFBSSxLQUFLTixLQUFMLENBQVdPLElBQVgsQ0FBZ0JDLE1BQWhCLEtBQTJCLENBQS9CLEVBQWtDO0FBQ2hDLFdBQUtQLEdBQUwsR0FBVyxFQUFYO0FBQ0EsYUFBTyxFQUFQO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsV0FBS0EsR0FBTCxHQUFXLEtBQUtRLFFBQUwsRUFBWDtBQUVBLFdBQUtDLEdBQUwsQ0FBUyxLQUFUO0FBRUEsYUFBTyxLQUFLVCxHQUFaO0FBQ0Q7QUFDRjtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUNFVSxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUFJLEtBQUtSLFVBQUwsS0FBb0IsSUFBeEIsRUFBOEI7QUFDNUIsV0FBS0QsYUFBTCxHQUFxQixLQUFLQyxVQUExQjtBQUNBLFdBQUtBLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSx5QkFBTSxzQkFBTixFQUE4QixLQUFLRCxhQUFuQztBQUNELEtBSkQsTUFJTztBQUNMLFdBQUtBLGFBQUwsR0FBcUIsS0FBS0YsS0FBTCxDQUFXVyxVQUFYLEVBQXJCO0FBQ0EseUJBQU0sWUFBTixFQUFvQixLQUFLVCxhQUF6QjtBQUNEOztBQUNELFdBQU8sS0FBS0EsYUFBWjtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDRVUsRUFBQUEsSUFBSSxHQUFHO0FBQ0wsUUFBSSxLQUFLVCxVQUFMLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLFdBQUtBLFVBQUwsR0FBa0IsS0FBS0gsS0FBTCxDQUFXVyxVQUFYLEVBQWxCO0FBQ0Q7O0FBRUQsdUJBQU0sc0JBQU4sRUFBOEIsS0FBS1IsVUFBbkM7QUFDQSxXQUFPLEtBQUtBLFVBQVo7QUFDRDs7QUFFRFUsRUFBQUEsS0FBSyxDQUFDQyxPQUFELEVBQXlCO0FBQzVCLFFBQUlDLElBQUksR0FBRyxLQUFLZixLQUFMLENBQVdPLElBQVgsQ0FBZ0JTLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCLEtBQUtoQixLQUFMLENBQVdlLElBQXZDLENBQVg7QUFDQSxRQUFJRSxPQUFPLEdBQUcsRUFBZDs7QUFFQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS2xCLEtBQUwsQ0FBV21CLEdBQS9CLEVBQW9DRCxDQUFDLEVBQXJDLEVBQXlDO0FBQ3ZDRCxNQUFBQSxPQUFPLElBQUksR0FBWDtBQUNEOztBQUVELFVBQU1HLEtBQUssQ0FDUixpQkFBZ0JMLElBQUssS0FBSUUsT0FBUSxxQkFBb0IsS0FBS2pCLEtBQUwsQ0FBV2UsSUFBWCxHQUFrQixDQUN2RSxTQUFRLEtBQUtmLEtBQUwsQ0FBV21CLEdBQVgsR0FBaUIsQ0FBRSxLQUFJTCxPQUFRLEVBRi9CLENBQVg7QUFJRDtBQUdEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUNFSixFQUFBQSxHQUFHLENBQUNXLFVBQUQsRUFBcUI7QUFDdEIsUUFBSSxLQUFLVixVQUFMLEdBQWtCVyxJQUFsQixLQUEyQkQsVUFBL0IsRUFBMkM7QUFDekMsV0FBS1IsS0FBTCxDQUNHLFlBQVdRLFVBQVcsVUFBU0UsSUFBSSxDQUFDQyxTQUFMLENBQWUsS0FBS3RCLGFBQXBCLENBQW1DLEVBRHJFO0FBR0Q7QUFDRjs7QUFFRE8sRUFBQUEsUUFBUSxHQUFRO0FBQ2Q7QUFDQSxRQUFJZ0IsR0FBRyxHQUFHLEtBQUtDLElBQUwsRUFBVjs7QUFFQSxRQUFJLEtBQUtkLElBQUwsR0FBWVUsSUFBWixLQUFxQixPQUF6QixFQUFrQztBQUNoQyxhQUFPRyxHQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS2QsVUFBTDtBQUNEOztBQUVELFFBQUlnQixHQUFHLEdBQUcsS0FBS0QsSUFBTCxFQUFWO0FBRUEsV0FBTztBQUNMSixNQUFBQSxJQUFJLEVBQUUsVUFERDtBQUVMRyxNQUFBQSxHQUZLO0FBR0xFLE1BQUFBO0FBSEssS0FBUDtBQUtEOztBQUVERCxFQUFBQSxJQUFJLEdBQVE7QUFDVjtBQUVBLHVCQUFNLE1BQU47QUFFQSxTQUFLZCxJQUFMOztBQUVBLFFBQ0UsS0FBS1QsVUFBTCxDQUFpQm1CLElBQWpCLEtBQTBCLFFBQTFCLElBQ0EsS0FBS25CLFVBQUwsQ0FBaUJtQixJQUFqQixLQUEwQixVQUQxQixJQUVBLEtBQUtuQixVQUFMLENBQWlCbUIsSUFBakIsS0FBMEIsVUFGMUIsSUFHQTtBQUNBLFNBQUtuQixVQUFMLENBQWlCbUIsSUFBakIsS0FBMEIsU0FKMUIsSUFLQSxLQUFLbkIsVUFBTCxDQUFpQm1CLElBQWpCLEtBQTBCLFNBTjVCLEVBT0U7QUFDQSxhQUFPLEtBQUtNLFFBQUwsRUFBUDtBQUNELEtBaEJTLENBa0JWO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQSxTQUFLakIsVUFBTDtBQUNBLFNBQUtFLEtBQUwsQ0FBWSxxQkFBb0JVLElBQUksQ0FBQ0MsU0FBTCxDQUFlLEtBQUt0QixhQUFwQixDQUFtQyxFQUFuRTtBQUNEOztBQUVEMkIsRUFBQUEsT0FBTyxHQUFRO0FBQ2I7QUFDQTtBQUNBO0FBRUEsdUJBQU0sU0FBTjs7QUFFQSxRQUFJLEtBQUtqQixJQUFMLEdBQVlVLElBQVosS0FBcUIsU0FBekIsRUFBb0M7QUFDbEMsWUFBTUYsS0FBSyxDQUFDLDRCQUE0QkcsSUFBSSxDQUFDQyxTQUFMLENBQWUsS0FBS3JCLFVBQXBCLENBQTdCLENBQVg7QUFDRDtBQUVEOzs7QUFDQSxRQUFJMkIsR0FBRyxHQUFJLEtBQUszQixVQUFOLENBQThCNEIsS0FBeEM7QUFDQUQsSUFBQUEsR0FBRyxHQUFJQSxHQUFELENBQWdCRSxXQUFoQixFQUFOO0FBRUEsdUJBQU0sV0FBTixFQUFtQkYsR0FBbkI7O0FBRUEsUUFBSUEsR0FBRyxLQUFLLE1BQVosRUFBb0I7QUFDbEIsYUFBTyxLQUFLRyxRQUFMLEVBQVA7QUFDRDs7QUFFRCxRQUFJSCxHQUFHLEtBQUssTUFBWixFQUFvQjtBQUNsQixhQUFPLEtBQUtJLElBQUwsRUFBUDtBQUNEOztBQUVELFFBQUksS0FBSzlCLFNBQUwsQ0FBZStCLFFBQWYsQ0FBd0JMLEdBQUcsQ0FBQ0UsV0FBSixFQUF4QixDQUFKLEVBQWdEO0FBQzlDLGFBQU8sS0FBS0ksUUFBTCxFQUFQO0FBQ0Q7O0FBRUQsU0FBSzFCLEdBQUwsQ0FBUyxTQUFUO0FBQ0EsU0FBS0csS0FBTCxDQUFXLG9CQUFxQixLQUFLWCxhQUFOLENBQWlDNkIsS0FBaEU7QUFDRDs7QUFFREcsRUFBQUEsSUFBSSxHQUFRO0FBQ1Y7QUFDQSx1QkFBTSxNQUFOO0FBRUEsU0FBS3hCLEdBQUwsQ0FBUyxTQUFUOztBQUVBLFFBQUssS0FBS1IsYUFBTixDQUFpQzZCLEtBQWpDLEtBQTJDLE1BQS9DLEVBQXVEO0FBQ3JELFdBQUtsQixLQUFMLENBQVcseUJBQXlCVSxJQUFJLENBQUNDLFNBQUwsQ0FBZSxLQUFLdEIsYUFBcEIsQ0FBcEM7QUFDRDs7QUFFRCxRQUFLLEtBQUtVLElBQUwsRUFBRCxDQUF5Q21CLEtBQXpDLEtBQW1ELEdBQXZELEVBQTREO0FBQzFELFVBQUlNLE9BQU8sR0FBRyxLQUFLQyxLQUFMLEVBQWQ7QUFFQSxhQUFPO0FBQ0xoQixRQUFBQSxJQUFJLEVBQUUsVUFERDtBQUVMUyxRQUFBQSxLQUFLLEVBQUUsTUFGRjtBQUdMTSxRQUFBQTtBQUhLLE9BQVA7QUFLRDs7QUFFRCxTQUFLM0IsR0FBTCxDQUFTLFNBQVQ7O0FBQ0EsUUFBSyxLQUFLUixhQUFOLENBQXFDNkIsS0FBckMsS0FBK0MsR0FBbkQsRUFBd0Q7QUFDdEQsV0FBS2xCLEtBQUwsQ0FDRSxpQ0FBaUNVLElBQUksQ0FBQ0MsU0FBTCxDQUFlLEtBQUt0QixhQUFwQixDQURuQztBQUdEOztBQUVELFFBQUlxQyxJQUFJLEdBQUcsS0FBS0MsTUFBTCxFQUFYO0FBRUEsU0FBSzlCLEdBQUwsQ0FBUyxTQUFUOztBQUNBLFFBQUssS0FBS1IsYUFBTixDQUFxQzZCLEtBQXJDLEtBQStDLEdBQW5ELEVBQXdEO0FBQ3RELFdBQUtsQixLQUFMLENBQ0UsaUNBQWlDVSxJQUFJLENBQUNDLFNBQUwsQ0FBZSxLQUFLdEIsYUFBcEIsQ0FEbkM7QUFHRDs7QUFFRCxRQUFJNkIsS0FBSyxHQUFHLEtBQUtPLEtBQUwsRUFBWjtBQUVBLFdBQU87QUFDTGhCLE1BQUFBLElBQUksRUFBRSxVQUREO0FBRUxNLE1BQUFBLFFBQVEsRUFBRSxVQUZMO0FBR0xILE1BQUFBLEdBQUcsRUFBRU0sS0FIQTtBQUlMSixNQUFBQSxHQUFHLEVBQUU7QUFDSEwsUUFBQUEsSUFBSSxFQUFFLFVBREg7QUFFSE0sUUFBQUEsUUFBUSxFQUFFLFFBRlA7QUFHSEgsUUFBQUEsR0FBRyxFQUFFO0FBQ0hILFVBQUFBLElBQUksRUFBRSxRQURIO0FBRUhTLFVBQUFBLEtBQUssRUFBRTtBQUZKLFNBSEY7QUFPSEosUUFBQUEsR0FBRyxFQUFFWTtBQVBGO0FBSkEsS0FBUDtBQWNEOztBQUVETixFQUFBQSxRQUFRLEdBQVE7QUFDZDtBQUVBLHVCQUFNLFVBQU47QUFFQSxTQUFLdkIsR0FBTCxDQUFTLFNBQVQ7O0FBRUEsUUFBSyxLQUFLUixhQUFOLENBQWlDNkIsS0FBakMsS0FBMkMsTUFBL0MsRUFBdUQ7QUFDckQsV0FBS2xCLEtBQUwsQ0FDRSw2QkFBNkJVLElBQUksQ0FBQ0MsU0FBTCxDQUFlLEtBQUt0QixhQUFwQixDQUQvQjtBQUdEOztBQUVELFFBQUl1QyxTQUFTLEdBQUcsS0FBS0gsS0FBTCxFQUFoQjtBQUNBLFFBQUlJLFdBQVcsR0FBRyxLQUFLSixLQUFMLEVBQWxCO0FBRUEsV0FBTztBQUNMaEIsTUFBQUEsSUFBSSxFQUFFLFVBREQ7QUFFTE0sTUFBQUEsUUFBUSxFQUFFLFFBRkw7QUFHTEgsTUFBQUEsR0FBRyxFQUFFZ0IsU0FIQTtBQUlMZCxNQUFBQSxHQUFHLEVBQUVlO0FBSkEsS0FBUDtBQU1EOztBQUVETixFQUFBQSxRQUFRLEdBQVE7QUFDZDtBQUVBLHVCQUFNLFVBQU47QUFFQSxTQUFLMUIsR0FBTCxDQUFTLFNBQVQ7QUFDQSxRQUFJcUIsS0FBSyxHQUFJLEtBQUs3QixhQUFOLENBQWlDNkIsS0FBN0M7QUFFQSxRQUFJTSxPQUFKOztBQUNBLFFBQUksS0FBS3pCLElBQUwsR0FBWVUsSUFBWixLQUFxQixTQUF6QixFQUFvQztBQUNsQ2UsTUFBQUEsT0FBTyxHQUFHLEtBQUtDLEtBQUwsRUFBVjtBQUNELEtBRkQsTUFFTztBQUNMRCxNQUFBQSxPQUFPLEdBQUcsS0FBS0csTUFBTCxFQUFWO0FBQ0Q7O0FBRUQsV0FBTztBQUNMbEIsTUFBQUEsSUFBSSxFQUFFLFVBREQ7QUFFTFMsTUFBQUEsS0FBSyxFQUFFQSxLQUFLLENBQUNZLFFBQU4sRUFGRjtBQUdMTixNQUFBQSxPQUFPLEVBQUVBO0FBSEosS0FBUDtBQUtEOztBQUVEQyxFQUFBQSxLQUFLLEdBQVE7QUFDWDtBQUVBLHVCQUFNLGFBQU47QUFFQSxTQUFLNUIsR0FBTCxDQUFTLFNBQVQ7O0FBQ0EsUUFBSyxLQUFLUixhQUFOLENBQXFDMEMsSUFBckMsS0FBOEMsSUFBbEQsRUFBd0Q7QUFDdEQsV0FBSy9CLEtBQUwsQ0FBVyxvQ0FBb0MsS0FBS1gsYUFBcEQ7QUFDRDs7QUFFRCxRQUFJbUMsT0FBTyxHQUFHLEtBQUtYLElBQUwsRUFBZDtBQUVBLFNBQUtoQixHQUFMLENBQVMsU0FBVDs7QUFDQSxRQUFLLEtBQUtSLGFBQU4sQ0FBcUMwQyxJQUFyQyxLQUE4QyxLQUFsRCxFQUF5RDtBQUN2RCxXQUFLL0IsS0FBTCxDQUFXLG9DQUFvQyxLQUFLWCxhQUFwRDtBQUNEOztBQUVELHVCQUFNLFdBQU47QUFFQSxXQUFPbUMsT0FBUDtBQUNEOztBQUVEVCxFQUFBQSxRQUFRLEdBQVE7QUFDZDtBQUNBLHVCQUFNLGVBQU47QUFDQSxRQUFJSCxHQUFHLEdBQUcsS0FBS29CLGlCQUFMLEVBQVY7QUFDQSxRQUFJQyxFQUFFLEdBQUcsS0FBS2xDLElBQUwsRUFBVDs7QUFFQSxRQUFJa0MsRUFBRSxDQUFDeEIsSUFBSCxLQUFZLFVBQVosSUFBMkJ3QixFQUFFLENBQUNmLEtBQUgsS0FBYSxNQUFiLElBQXVCZSxFQUFFLENBQUNmLEtBQUgsS0FBYSxPQUFuRSxFQUE2RTtBQUMzRSx5QkFBTSx5QkFBTjtBQUNBLGFBQU9OLEdBQVA7QUFDRCxLQVRhLENBV2Q7OztBQUNBLFNBQUtkLFVBQUw7QUFFQSx1QkFBTSxnQkFBTjtBQUNBLFFBQUlnQixHQUFHLEdBQUcsS0FBS0MsUUFBTCxFQUFWO0FBRUEsV0FBTztBQUNMTixNQUFBQSxJQUFJLEVBQUUsVUFERDtBQUVMTSxNQUFBQSxRQUFRLEVBQUVrQixFQUFFLENBQUNmLEtBRlI7QUFHTE4sTUFBQUEsR0FISztBQUlMRSxNQUFBQTtBQUpLLEtBQVA7QUFNRDs7QUFFRGtCLEVBQUFBLGlCQUFpQixHQUFRO0FBQ3ZCO0FBRUEsdUJBQU0sYUFBTjtBQUVBLFFBQUlwQixHQUFHLEdBQUcsS0FBS3NCLGVBQUwsRUFBVjtBQUVBLFFBQUlELEVBQUUsR0FBRyxLQUFLbEMsSUFBTCxFQUFUOztBQUVBLFFBQ0VrQyxFQUFFLENBQUN4QixJQUFILEtBQVksUUFBWixJQUNBd0IsRUFBRSxDQUFDeEIsSUFBSCxLQUFZLFVBRFosSUFFQXdCLEVBQUUsQ0FBQ3hCLElBQUgsS0FBWSxTQUZaLElBR0N3QixFQUFFLENBQUN4QixJQUFILEtBQVksU0FBWixJQUF5QndCLEVBQUUsQ0FBQ2YsS0FBSCxLQUFhLEdBSnpDLEVBS0U7QUFDQWUsTUFBQUEsRUFBRSxHQUFHO0FBQ0h4QixRQUFBQSxJQUFJLEVBQUUsVUFESDtBQUVIUyxRQUFBQSxLQUFLLEVBQUU7QUFGSixPQUFMO0FBSUQsS0FWRCxNQVVPLElBQ0xlLEVBQUUsQ0FBQ3hCLElBQUgsS0FBWSxVQUFaLElBQ0N3QixFQUFFLENBQUNmLEtBQUgsS0FBYSxVQUFiLElBQTJCZSxFQUFFLENBQUNmLEtBQUgsS0FBYSxRQUZwQyxFQUdMO0FBQ0EseUJBQU0scUJBQU47QUFDQSxhQUFPTixHQUFQO0FBQ0QsS0FOTSxNQU1BO0FBQ0w7QUFDQSxXQUFLZCxVQUFMO0FBQ0Q7O0FBRUQsdUJBQU0sY0FBTjtBQUVBLFFBQUlnQixHQUFHLEdBQUcsS0FBS2tCLGlCQUFMLEVBQVY7QUFFQSxXQUFPO0FBQ0x2QixNQUFBQSxJQUFJLEVBQUUsVUFERDtBQUVMTSxNQUFBQSxRQUFRLEVBQUVrQixFQUFFLENBQUNmLEtBRlI7QUFHTE4sTUFBQUEsR0FISztBQUlMRSxNQUFBQTtBQUpLLEtBQVA7QUFNRDs7QUFFRG9CLEVBQUFBLGVBQWUsR0FBUTtBQUNyQjtBQUVBLHVCQUFNLGlCQUFOO0FBRUEsUUFBSXRCLEdBQUcsR0FBRyxLQUFLdUIsWUFBTCxFQUFWO0FBRUEsVUFBTUMsWUFBWSxHQUFHLEtBQUtDLHFCQUFMLENBQTJCekIsR0FBM0IsQ0FBckI7QUFFQSxXQUFPd0IsWUFBUDtBQUNEOztBQUVEQyxFQUFBQSxxQkFBcUIsQ0FBQ3pCLEdBQUQsRUFBZ0I7QUFDbkM7QUFFQSxRQUFJcUIsRUFBRSxHQUFHLEtBQUtsQyxJQUFMLEVBQVQ7O0FBRUEsUUFBSWtDLEVBQUUsQ0FBQ3hCLElBQUgsS0FBWSxVQUFaLElBQTBCd0IsRUFBRSxDQUFDZixLQUFILEtBQWEsUUFBM0MsRUFBcUQ7QUFDbkQseUJBQU0saUNBQU47QUFDQSxhQUFPTixHQUFQO0FBQ0QsS0FIRCxNQUdPO0FBQ0w7QUFDQSxXQUFLZCxVQUFMO0FBQ0Q7O0FBRUQsdUJBQU0sdUNBQU47QUFFQSxRQUFJZ0IsR0FBRyxHQUFHLEtBQUtxQixZQUFMLEVBQVY7QUFFQSxXQUFPLEtBQUtFLHFCQUFMLENBQTJCO0FBQ2hDNUIsTUFBQUEsSUFBSSxFQUFFLFVBRDBCO0FBRWhDTSxNQUFBQSxRQUFRLEVBQUUsUUFGc0I7QUFHaENILE1BQUFBLEdBSGdDO0FBSWhDRSxNQUFBQTtBQUpnQyxLQUEzQixDQUFQO0FBTUQ7O0FBRURxQixFQUFBQSxZQUFZLEdBQVE7QUFDbEI7QUFFQSx1QkFBTSxjQUFOO0FBRUEsUUFBSXZCLEdBQUcsR0FBRyxLQUFLMEIsWUFBTCxFQUFWO0FBQ0EsUUFBSUwsRUFBRSxHQUFHLEtBQUtsQyxJQUFMLEVBQVQ7O0FBRUEsUUFBSWtDLEVBQUUsQ0FBQ3hCLElBQUgsS0FBWSxVQUFaLElBQTBCd0IsRUFBRSxDQUFDZixLQUFILEtBQWEsU0FBM0MsRUFBc0Q7QUFDcEQseUJBQU0sd0JBQU47QUFDQSxhQUFPTixHQUFQO0FBQ0QsS0FIRCxNQUdPO0FBQ0w7QUFDQSxXQUFLZCxVQUFMO0FBQ0Q7O0FBRUQsdUJBQU0sZUFBTjtBQUVBLFFBQUlnQixHQUFHLEdBQUcsS0FBS3FCLFlBQUwsRUFBVjtBQUVBLFdBQU87QUFDTDFCLE1BQUFBLElBQUksRUFBRSxVQUREO0FBRUxNLE1BQUFBLFFBQVEsRUFBRSxTQUZMO0FBR0xILE1BQUFBLEdBSEs7QUFJTEUsTUFBQUE7QUFKSyxLQUFQO0FBTUQ7O0FBRUR3QixFQUFBQSxZQUFZLEdBQVE7QUFDbEI7QUFFQSxRQUFJMUIsR0FBRyxHQUFHLEtBQUsyQixTQUFMLEVBQVY7QUFDQSxRQUFJTixFQUFFLEdBQUcsS0FBS2xDLElBQUwsRUFBVDs7QUFFQSxRQUFJa0MsRUFBRSxDQUFDeEIsSUFBSCxLQUFZLFVBQVosSUFBMEJ3QixFQUFFLENBQUNmLEtBQUgsS0FBYSxVQUEzQyxFQUF1RDtBQUNyRCx5QkFBTSx3QkFBTjtBQUNBLGFBQU9OLEdBQVA7QUFDRCxLQUhELE1BR087QUFDTDtBQUNBLFdBQUtkLFVBQUw7QUFDRDs7QUFFRCxRQUFJZ0IsR0FBRyxHQUFHLEtBQUt3QixZQUFMLEVBQVY7QUFFQSxXQUFPO0FBQ0w3QixNQUFBQSxJQUFJLEVBQUUsVUFERDtBQUVMTSxNQUFBQSxRQUFRLEVBQUUsVUFGTDtBQUdMSCxNQUFBQSxHQUhLO0FBSUxFLE1BQUFBO0FBSkssS0FBUDtBQU1EOztBQUVEMEIsRUFBQUEsUUFBUSxHQUFRO0FBQ2QsU0FBSzNDLEdBQUwsQ0FBUyxVQUFUO0FBRUEsV0FBTztBQUNMWSxNQUFBQSxJQUFJLEVBQUUsVUFERDtBQUVMUyxNQUFBQSxLQUFLLEVBQUcsS0FBSzdCLGFBQU4sQ0FBaUM2QixLQUFqQyxDQUF1Q1ksUUFBdkM7QUFGRixLQUFQO0FBSUQ7O0FBRURTLEVBQUFBLFNBQVMsR0FBUTtBQUNmO0FBQ0EsVUFBTUUsUUFBUSxHQUFHLEtBQUtkLE1BQUwsRUFBakI7O0FBRUEsUUFBSSxLQUFLNUIsSUFBTCxHQUFZVSxJQUFaLEtBQXFCLFlBQXpCLEVBQXVDO0FBQ3JDLFdBQUtaLEdBQUwsQ0FBUyxZQUFUO0FBRUEsWUFBTTZDLFNBQVMsR0FBRyxLQUFLSCxTQUFMLEVBQWxCO0FBRUEsYUFBTztBQUNMOUIsUUFBQUEsSUFBSSxFQUFFLFdBREQ7QUFFTGlCLFFBQUFBLElBQUksRUFBRWUsUUFGRDtBQUdMRixRQUFBQSxTQUFTLEVBQUVHO0FBSE4sT0FBUDtBQUtEOztBQUVELFdBQU9ELFFBQVA7QUFDRDs7QUFFRGQsRUFBQUEsTUFBTSxHQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsdUJBQU0sUUFBTjtBQUVBLFNBQUs1QixJQUFMOztBQUVBLFFBQUksS0FBS1QsVUFBTCxDQUFpQm1CLElBQWpCLEtBQTBCLFFBQTlCLEVBQXdDO0FBQ3RDLFdBQUtYLFVBQUw7QUFDQSxhQUFPO0FBQ0xXLFFBQUFBLElBQUksRUFBRSxRQUREO0FBRUxTLFFBQUFBLEtBQUssRUFBRyxLQUFLN0IsYUFBTixDQUFpQzZCO0FBRm5DLE9BQVA7QUFJRDs7QUFFRCxRQUFJLEtBQUs1QixVQUFMLENBQWlCbUIsSUFBakIsS0FBMEIsVUFBOUIsRUFBMEM7QUFDeEMsYUFBTyxLQUFLa0MsWUFBTCxFQUFQO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLckQsVUFBTCxDQUFpQm1CLElBQWpCLEtBQTBCLFVBQTlCLEVBQTBDO0FBQ3hDLGFBQU8sS0FBSytCLFFBQUwsRUFBUDtBQUNEOztBQUVELFFBQUksS0FBS2xELFVBQUwsQ0FBaUJtQixJQUFqQixLQUEwQixTQUE5QixFQUF5QztBQUN2QyxhQUFPLEtBQUtPLE9BQUwsRUFBUDtBQUNEOztBQUVELFFBQUksS0FBSzFCLFVBQUwsQ0FBaUJtQixJQUFqQixLQUEwQixTQUE5QixFQUF5QztBQUN2QyxhQUFPLEtBQUtnQixLQUFMLEVBQVA7QUFDRDs7QUFFRCxTQUFLM0IsVUFBTDtBQUNBLFNBQUtFLEtBQUwsQ0FDRSw4REFDQVUsSUFBSSxDQUFDQyxTQUFMLENBQWUsS0FBS3RCLGFBQXBCLENBRkY7QUFJRDs7QUFFRHNELEVBQUFBLFlBQVksR0FBNkI7QUFDdkMsU0FBSzlDLEdBQUwsQ0FBUyxVQUFUOztBQUNBLFFBQUssS0FBS1IsYUFBTixDQUFpQzZCLEtBQWpDLEtBQTJDLE1BQTNDLElBQ0QsS0FBSzdCLGFBQU4sQ0FBaUM2QixLQUFqQyxLQUEyQyxPQUQ3QyxFQUNzRDtBQUNwRCxVQUFJMEIsTUFBTSxHQUFJLEtBQUt2RCxhQUFOLENBQWlDNkIsS0FBOUM7QUFDQSxVQUFJQSxLQUFLLEdBQUcsS0FBS1MsTUFBTCxFQUFaOztBQUVBLFVBQUlULEtBQUssQ0FBQ1QsSUFBTixLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLGVBQU87QUFDTEEsVUFBQUEsSUFBSSxFQUFFLFFBREQ7QUFFTFMsVUFBQUEsS0FBSyxFQUFFMEIsTUFBTSxLQUFLLE9BQVgsR0FBcUIsQ0FBQzFCLEtBQUssQ0FBQ0EsS0FBNUIsR0FBb0NBLEtBQUssQ0FBQ0E7QUFGNUMsU0FBUDtBQUlEOztBQUVELGFBQU87QUFDTFQsUUFBQUEsSUFBSSxFQUFFLGNBREQ7QUFFTE0sUUFBQUEsUUFBUSxFQUFFNkIsTUFGTDtBQUdMMUIsUUFBQUE7QUFISyxPQUFQO0FBS0QsS0FqQkQsTUFpQk87QUFDTCxXQUFLbEIsS0FBTCxDQUFXLDBCQUFYO0FBQ0Q7QUFDRjs7QUEzaUI4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmdW5jdGlvbnMgZnJvbSAnLi9tb2RlbHMvZnVuY3Rpb25zJ1xyXG5pbXBvcnQgeyBkZWJ1ZyB9IGZyb20gJy4vbG9nZ2VyJ1xyXG5pbXBvcnQgTGV4ZXIgZnJvbSAnLi9sZXhlcnMvTGV4ZXInXHJcbmltcG9ydCBBU1QsIHsgTnVtYmVyTm9kZSwgT3BlcmF0b3JUeXBlLCBVbmlPcGVyTm9kZSB9IGZyb20gJy4vZm9ybWF0dGVycy9BU1QnXHJcbmltcG9ydCBUb2tlbiwgeyBCcmFja2V0VG9rZW4sIFZhbFRva2VuIH0gZnJvbSAnLi9sZXhlcnMvVG9rZW4nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzZXJMYXRleCB7XHJcbiAgbGV4ZXI6IExleGVyXHJcbiAgb3B0aW9uczoge31cclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybiBgbnVsbGA6IHBhcnNlciBlcnJvclxyXG4gICAqIEByZXR1cm4gJyc6IGVtcHR5IGlucHV0XHJcbiAgICogQHJldHVybiBgQVNUYDogbm9ybWFsXHJcbiAgICovXHJcbiAgYXN0OiBBU1QgfCBudWxsIHwgJydcclxuICBjdXJyZW50X3Rva2VuOiBUb2tlbiB8IG51bGxcclxuICBwZWVrX3Rva2VuOiBUb2tlbiB8IG51bGxcclxuICBmdW5jdGlvbnM6IHN0cmluZ1tdXHJcblxyXG4gIGNvbnN0cnVjdG9yKGxhdGV4OiBzdHJpbmcsIExleGVyOiBhbnksIG9wdGlvbnM6IGFueSA9IHt9KSB7XHJcbiAgICAvLyBpZiAoIShMZXhlciBpbnN0YW5jZW9mIExleGVyQ2xhc3MpKSB7XHJcbiAgICAvLyAgIHRocm93IEVycm9yKCdQbGVhc2UgcGFyc2UgYSB2YWxpZCBsZXhlciBhcyBzZWNvbmQgYXJndW1lbnQnKVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHRoaXMubGV4ZXIgPSBuZXcgTGV4ZXIobGF0ZXgpXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcbiAgICB0aGlzLmFzdCA9IG51bGxcclxuICAgIHRoaXMuY3VycmVudF90b2tlbiA9IG51bGxcclxuICAgIHRoaXMucGVla190b2tlbiA9IG51bGxcclxuICAgIHRoaXMuZnVuY3Rpb25zID0gZnVuY3Rpb25zLmNvbmNhdChvcHRpb25zPy5mdW5jdGlvbnMgfHwgW10pXHJcbiAgfVxyXG5cclxuICBwYXJzZSgpIHtcclxuICAgIGRlYnVnKCdcXG5MYXRleCBwYXJzZXIgLnBhcnNlKCknKVxyXG4gICAgaWYgKHRoaXMubGV4ZXIudGV4dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5hc3QgPSAnJztcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hc3QgPSB0aGlzLmVxdWF0aW9uKClcclxuXHJcbiAgICAgIHRoaXMuZWF0KCdFT0YnKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXN0XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBpbnZva2UgdGhpcyBtZXRob2QgdG8gdXBkYXRlIGB0aGlzLmN1cnJlbnRfdG9rZW5gLFxyXG4gICAqIHVwZGF0ZSBgdGhpcy5jdXJyZW50X3Rva2VuYCBtZWFucyB0aGF0IG1ldGhvZCBpcyByZWFkeSB0byBoYW5kbGUgXHJcbiAgICogY3VycmVudCB0b2tlblxyXG4gICAqL1xyXG4gIG5leHRfdG9rZW4oKSB7XHJcbiAgICBpZiAodGhpcy5wZWVrX3Rva2VuICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudF90b2tlbiA9IHRoaXMucGVla190b2tlblxyXG4gICAgICB0aGlzLnBlZWtfdG9rZW4gPSBudWxsXHJcbiAgICAgIGRlYnVnKCduZXh0IHRva2VuIGZyb20gcGVlaycsIHRoaXMuY3VycmVudF90b2tlbilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudF90b2tlbiA9IHRoaXMubGV4ZXIubmV4dF90b2tlbigpXHJcbiAgICAgIGRlYnVnKCduZXh0IHRva2VuJywgdGhpcy5jdXJyZW50X3Rva2VuKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudF90b2tlblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdXBkYXRlIGB0aGlzLnBlZWtfdG9rZW5gIGlmIGl0J3Mgbm90IG51bGwsXHJcbiAgICogbWV0aG9kIHVzdWFsbHkgdXNlIGB0aGlzLnBlZWtfdG9rZW5gIHRvIHNlZSBpZiBpdCBjYW4gaGFuZGxlIG5leHQgdG9rZW4sXHJcbiAgICogaWYgbWV0aG9kIGNhbiBoYW5kbGUgbmV4dCB0b2tlbiwgaXQgd2lsbCBpbnZva2UgYHRoaXMubmV4dF90b2tlbigpYCB0byBcclxuICAgKiB1cGRhdGUgY3VycmVudCB0b2tlbiBhbmQgaGFuZGxlIGl0XHJcbiAgICovXHJcbiAgcGVlaygpIHtcclxuICAgIGlmICh0aGlzLnBlZWtfdG9rZW4gPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5wZWVrX3Rva2VuID0gdGhpcy5sZXhlci5uZXh0X3Rva2VuKClcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZygnbmV4dCB0b2tlbiBmcm9tIHBlZWsnLCB0aGlzLnBlZWtfdG9rZW4pXHJcbiAgICByZXR1cm4gdGhpcy5wZWVrX3Rva2VuXHJcbiAgfVxyXG5cclxuICBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBuZXZlciB7XHJcbiAgICBsZXQgbGluZSA9IHRoaXMubGV4ZXIudGV4dC5zcGxpdCgnXFxuJylbdGhpcy5sZXhlci5saW5lXVxyXG4gICAgbGV0IHNwYWNpbmcgPSAnJ1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZXhlci5jb2w7IGkrKykge1xyXG4gICAgICBzcGFjaW5nICs9ICcgJ1xyXG4gICAgfVxyXG5cclxuICAgIHRocm93IEVycm9yKFxyXG4gICAgICBgUGFyc2VyIGVycm9yXFxuJHtsaW5lfVxcbiR7c3BhY2luZ31eXFxuRXJyb3IgYXQgbGluZTogJHt0aGlzLmxleGVyLmxpbmUgKyAxXHJcbiAgICAgIH0gY29sOiAke3RoaXMubGV4ZXIuY29sICsgMX1cXG4ke21lc3NhZ2V9YFxyXG4gICAgKVxyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHNpbWlsYXIgdG8gYHRoaXMubmV4dF90b2tlbigpYCwgYnV0IGl0IGFzc2VydCB0aGUgdHlwZSBvZlxyXG4gICAqIG5leHQgdG9rZW5cclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRva2VuX3R5cGVcclxuICAgKi9cclxuICBlYXQodG9rZW5fdHlwZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5uZXh0X3Rva2VuKCkudHlwZSAhPT0gdG9rZW5fdHlwZSkge1xyXG4gICAgICB0aGlzLmVycm9yKFxyXG4gICAgICAgIGBFeHBlY3RlZCAke3Rva2VuX3R5cGV9IGZvdW5kICR7SlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW50X3Rva2VuKX1gXHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVxdWF0aW9uKCk6IEFTVCB7XHJcbiAgICAvLyBlcXVhdGlvbiA6IGV4cHIgKCBFUVVBTCBleHByICk/XHJcbiAgICBsZXQgbGhzID0gdGhpcy5leHByKClcclxuXHJcbiAgICBpZiAodGhpcy5wZWVrKCkudHlwZSAhPT0gJ2VxdWFsJykge1xyXG4gICAgICByZXR1cm4gbGhzXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5leHRfdG9rZW4oKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCByaHMgPSB0aGlzLmV4cHIoKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdlcXVhdGlvbicsXHJcbiAgICAgIGxocyxcclxuICAgICAgcmhzLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwcigpOiBBU1Qge1xyXG4gICAgLy8gZXhwciA6IG9wZXJhdG9yXHJcblxyXG4gICAgZGVidWcoJ2V4cHInKVxyXG5cclxuICAgIHRoaXMucGVlaygpXHJcblxyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICdudW1iZXInIHx8XHJcbiAgICAgIHRoaXMucGVla190b2tlbiEudHlwZSA9PT0gJ29wZXJhdG9yJyB8fFxyXG4gICAgICB0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICd2YXJpYWJsZScgfHxcclxuICAgICAgLy8gdGhpcy5wZWVrX3Rva2VuLnR5cGUgPT09ICdmdW5jdGlvbicgfHxcclxuICAgICAgdGhpcy5wZWVrX3Rva2VuIS50eXBlID09PSAna2V5d29yZCcgfHxcclxuICAgICAgdGhpcy5wZWVrX3Rva2VuIS50eXBlID09PSAnYnJhY2tldCdcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcGVyYXRvcigpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgKHRoaXMucGVla190b2tlbi50eXBlID09PSAnYnJhY2tldCcgJiYgdGhpcy5wZWVrX3Rva2VuLm9wZW4gPT09IGZhbHNlKSB7XHJcbiAgICAvLyAgIHJldHVybiBudWxsXHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gaWYgKHRoaXMucGVla190b2tlbiEudHlwZSA9PT0gJ0VPRicpIHtcclxuICAgIC8vICAgdGhpcy5uZXh0X3Rva2VuKClcclxuICAgIC8vICAgcmV0dXJuIG51bGxcclxuICAgIC8vIH1cclxuXHJcbiAgICB0aGlzLm5leHRfdG9rZW4oKVxyXG4gICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCB0b2tlbjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmN1cnJlbnRfdG9rZW4pfWApXHJcbiAgfVxyXG5cclxuICBrZXl3b3JkKCk6IEFTVCB7XHJcbiAgICAvLyBrZXl3b3JkIDogS0VZV09SRFxyXG4gICAgLy8gICAgICAgICB8IGZyYWN0aW9uXHJcbiAgICAvLyAgICAgICAgIHwgZnVuY3Rpb25cclxuXHJcbiAgICBkZWJ1Zygna2V5d29yZCcpXHJcblxyXG4gICAgaWYgKHRoaXMucGVlaygpLnR5cGUgIT09ICdrZXl3b3JkJykge1xyXG4gICAgICB0aHJvdyBFcnJvcignRXhwZWN0ZWQga2V5d29yZCBmb3VuZCAnICsgSlNPTi5zdHJpbmdpZnkodGhpcy5wZWVrX3Rva2VuKSlcclxuICAgIH1cclxuXHJcbiAgICAvKiB0aGlzLnBlZWtfdG9rZW4udHlwZSA9PT0gXCJrZXl3b3JkXCIgKi9cclxuICAgIGxldCBrd2QgPSAodGhpcy5wZWVrX3Rva2VuIGFzIFZhbFRva2VuKS52YWx1ZVxyXG4gICAga3dkID0gKGt3ZCBhcyBzdHJpbmcpLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICBkZWJ1Zygna2V5d29yZCAtJywga3dkKVxyXG5cclxuICAgIGlmIChrd2QgPT09ICdmcmFjJykge1xyXG4gICAgICByZXR1cm4gdGhpcy5mcmFjdGlvbigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGt3ZCA9PT0gJ3NxcnQnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNxcnQoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmZ1bmN0aW9ucy5pbmNsdWRlcyhrd2QudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZnVuY3Rpb24oKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWF0KCdrZXl3b3JkJylcclxuICAgIHRoaXMuZXJyb3IoJ1Vua25vdyBrZXl3b3JkOicgKyAodGhpcy5jdXJyZW50X3Rva2VuIGFzIFZhbFRva2VuKS52YWx1ZSlcclxuICB9XHJcblxyXG4gIHNxcnQoKTogQVNUIHtcclxuICAgIC8vIHNxcnQgOiBTUVJUIChMX1NRVUFSRV9CUkFDIE5VTUJFUiBSX1NRVUFSRV9CUkFDKT8gR1JPVVBcclxuICAgIGRlYnVnKCdzcXJ0JylcclxuXHJcbiAgICB0aGlzLmVhdCgna2V5d29yZCcpXHJcblxyXG4gICAgaWYgKCh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlICE9PSAnc3FydCcpIHtcclxuICAgICAgdGhpcy5lcnJvcignRXhwZWN0ZWQgc3FydCBmb3VuZCAnICsgSlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW50X3Rva2VuKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoKHRoaXMucGVlaygpIGFzIFZhbFRva2VuIHwgQnJhY2tldFRva2VuKS52YWx1ZSAhPT0gJ1snKSB7XHJcbiAgICAgIGxldCBjb250ZW50ID0gdGhpcy5ncm91cCgpXHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdmdW5jdGlvbicsXHJcbiAgICAgICAgdmFsdWU6ICdzcXJ0JyxcclxuICAgICAgICBjb250ZW50LFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lYXQoJ2JyYWNrZXQnKVxyXG4gICAgaWYgKCh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgQnJhY2tldFRva2VuKS52YWx1ZSAhPT0gJ1snKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoXHJcbiAgICAgICAgJ0V4cGVjdGVkIFwiW1wiIGJyYWNrZXQsIGZvdW5kICcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmN1cnJlbnRfdG9rZW4pXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYmFzZSA9IHRoaXMubnVtYmVyKClcclxuXHJcbiAgICB0aGlzLmVhdCgnYnJhY2tldCcpXHJcbiAgICBpZiAoKHRoaXMuY3VycmVudF90b2tlbiBhcyBCcmFja2V0VG9rZW4pLnZhbHVlICE9PSAnXScpIHtcclxuICAgICAgdGhpcy5lcnJvcihcclxuICAgICAgICAnRXhwZWN0ZWQgXCJdXCIgYnJhY2tldCwgZm91bmQgJyArIEpTT04uc3RyaW5naWZ5KHRoaXMuY3VycmVudF90b2tlbilcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ3JvdXAoKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgIG9wZXJhdG9yOiAnZXhwb25lbnQnLFxyXG4gICAgICBsaHM6IHZhbHVlLFxyXG4gICAgICByaHM6IHtcclxuICAgICAgICB0eXBlOiAnb3BlcmF0b3InLFxyXG4gICAgICAgIG9wZXJhdG9yOiAnZGl2aWRlJyxcclxuICAgICAgICBsaHM6IHtcclxuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxyXG4gICAgICAgICAgdmFsdWU6IDEsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByaHM6IGJhc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmcmFjdGlvbigpOiBBU1Qge1xyXG4gICAgLy8gZnJhY3Rpb24gOiBGUkFDIGdyb3VwIGdyb3VwXHJcblxyXG4gICAgZGVidWcoJ2ZyYWN0aW9uJylcclxuXHJcbiAgICB0aGlzLmVhdCgna2V5d29yZCcpXHJcblxyXG4gICAgaWYgKCh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlICE9PSAnZnJhYycpIHtcclxuICAgICAgdGhpcy5lcnJvcihcclxuICAgICAgICAnRXhwZWN0ZWQgZnJhY3Rpb24gZm91bmQgJyArIEpTT04uc3RyaW5naWZ5KHRoaXMuY3VycmVudF90b2tlbilcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBub21pbmF0b3IgPSB0aGlzLmdyb3VwKClcclxuICAgIGxldCBkZW5vbWluYXRvciA9IHRoaXMuZ3JvdXAoKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgIG9wZXJhdG9yOiAnZGl2aWRlJyxcclxuICAgICAgbGhzOiBub21pbmF0b3IsXHJcbiAgICAgIHJoczogZGVub21pbmF0b3IsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbigpOiBBU1Qge1xyXG4gICAgLy8gZnVuY3Rpb24gOiBGVU5DVElPTiAoIGdyb3VwIHwgbnVtYmVyIClcclxuXHJcbiAgICBkZWJ1ZygnZnVuY3Rpb24nKVxyXG5cclxuICAgIHRoaXMuZWF0KCdrZXl3b3JkJylcclxuICAgIGxldCB2YWx1ZSA9ICh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlXHJcblxyXG4gICAgbGV0IGNvbnRlbnRcclxuICAgIGlmICh0aGlzLnBlZWsoKS50eXBlID09PSAnYnJhY2tldCcpIHtcclxuICAgICAgY29udGVudCA9IHRoaXMuZ3JvdXAoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29udGVudCA9IHRoaXMubnVtYmVyKClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnZnVuY3Rpb24nLFxyXG4gICAgICB2YWx1ZTogdmFsdWUudG9TdHJpbmcoKSxcclxuICAgICAgY29udGVudDogY29udGVudCxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdyb3VwKCk6IEFTVCB7XHJcbiAgICAvLyBncm91cCA6IExCUkFDS0VUIGV4cHIgUkJSQUNLRVRcclxuXHJcbiAgICBkZWJ1Zygnc3RhcnQgZ3JvdXAnKVxyXG5cclxuICAgIHRoaXMuZWF0KCdicmFja2V0JylcclxuICAgIGlmICgodGhpcy5jdXJyZW50X3Rva2VuIGFzIEJyYWNrZXRUb2tlbikub3BlbiAhPT0gdHJ1ZSkge1xyXG4gICAgICB0aGlzLmVycm9yKCdFeHBlY3RlZCBvcGVuaW5nIGJyYWNrZXQgZm91bmQgJyArIHRoaXMuY3VycmVudF90b2tlbilcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY29udGVudCA9IHRoaXMuZXhwcigpXHJcblxyXG4gICAgdGhpcy5lYXQoJ2JyYWNrZXQnKVxyXG4gICAgaWYgKCh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgQnJhY2tldFRva2VuKS5vcGVuICE9PSBmYWxzZSkge1xyXG4gICAgICB0aGlzLmVycm9yKCdFeHBlY3RlZCBjbG9zaW5nIGJyYWNrZXQgZm91bmQgJyArIHRoaXMuY3VycmVudF90b2tlbilcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZygnZW5kIGdyb3VwJylcclxuXHJcbiAgICByZXR1cm4gY29udGVudFxyXG4gIH1cclxuXHJcbiAgb3BlcmF0b3IoKTogQVNUIHtcclxuICAgIC8vIG9wZXJhdG9yIDogb3BlcmF0b3JfdGVybSAoKFBMVVMgfCBNSU5VUykgb3BlcmF0b3IpP1xyXG4gICAgZGVidWcoJ29wZXJhdG9yIGxlZnQnKVxyXG4gICAgbGV0IGxocyA9IHRoaXMub3BlcmF0b3JfbXVsdGlwbHkoKVxyXG4gICAgbGV0IG9wID0gdGhpcy5wZWVrKClcclxuXHJcbiAgICBpZiAob3AudHlwZSAhPT0gJ29wZXJhdG9yJyB8fCAob3AudmFsdWUgIT09ICdwbHVzJyAmJiBvcC52YWx1ZSAhPT0gJ21pbnVzJykpIHtcclxuICAgICAgZGVidWcoJ29wZXJhdG9yIG9ubHkgbGVmdCBzaWRlJylcclxuICAgICAgcmV0dXJuIGxoc1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZXJhdG9yIHRva2VuXHJcbiAgICB0aGlzLm5leHRfdG9rZW4oKVxyXG5cclxuICAgIGRlYnVnKCdvcGVyYXRvciByaWdodCcpXHJcbiAgICBsZXQgcmhzID0gdGhpcy5vcGVyYXRvcigpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ29wZXJhdG9yJyxcclxuICAgICAgb3BlcmF0b3I6IG9wLnZhbHVlLFxyXG4gICAgICBsaHMsXHJcbiAgICAgIHJocyxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZXJhdG9yX211bHRpcGx5KCk6IEFTVCB7XHJcbiAgICAvLyBvcGVyYXRvcl9tdWx0aXBseSA6IChvcGVyYXRvcl9kaXZpZGUgfCBHUk9VUCkgKCAoTVVMVElQTFkgb3BlcmF0b3JfbXVsdGlwbHkpIHwgbnVtYmVyICk/XHJcblxyXG4gICAgZGVidWcoJ29wIG11bCBsZWZ0JylcclxuXHJcbiAgICBsZXQgbGhzID0gdGhpcy5vcGVyYXRvcl9kaXZpZGUoKVxyXG5cclxuICAgIGxldCBvcCA9IHRoaXMucGVlaygpXHJcblxyXG4gICAgaWYgKFxyXG4gICAgICBvcC50eXBlID09PSAnbnVtYmVyJyB8fFxyXG4gICAgICBvcC50eXBlID09PSAndmFyaWFibGUnIHx8XHJcbiAgICAgIG9wLnR5cGUgPT09ICdrZXl3b3JkJyB8fFxyXG4gICAgICAob3AudHlwZSA9PT0gJ2JyYWNrZXQnICYmIG9wLnZhbHVlID09PSAnKCcpXHJcbiAgICApIHtcclxuICAgICAgb3AgPSB7XHJcbiAgICAgICAgdHlwZTogJ29wZXJhdG9yJyxcclxuICAgICAgICB2YWx1ZTogJ211bHRpcGx5JyxcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChcclxuICAgICAgb3AudHlwZSAhPT0gJ29wZXJhdG9yJyB8fFxyXG4gICAgICAob3AudmFsdWUgIT09ICdtdWx0aXBseScgJiYgb3AudmFsdWUgIT09ICdkaXZpZGUnKVxyXG4gICAgKSB7XHJcbiAgICAgIGRlYnVnKCd0ZXJtIG9ubHkgbGVmdCBzaWRlJylcclxuICAgICAgcmV0dXJuIGxoc1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gT3BlcmF0b3IgdG9rZW5cclxuICAgICAgdGhpcy5uZXh0X3Rva2VuKClcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1Zygnb3AgbXVsIHJpZ2h0JylcclxuXHJcbiAgICBsZXQgcmhzID0gdGhpcy5vcGVyYXRvcl9tdWx0aXBseSgpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ29wZXJhdG9yJyxcclxuICAgICAgb3BlcmF0b3I6IG9wLnZhbHVlIGFzIE9wZXJhdG9yVHlwZSxcclxuICAgICAgbGhzLFxyXG4gICAgICByaHMsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvcGVyYXRvcl9kaXZpZGUoKTogQVNUIHtcclxuICAgIC8vIG9wZXJhdG9yX2RpdmlkZSA6IG9wZXJhdG9yX21vZCBvcGVyYXRvcl9kaXZpZGVfcHJpbWVcclxuXHJcbiAgICBkZWJ1Zygnb3BlcmF0b3JfZGl2aWRlJylcclxuXHJcbiAgICBsZXQgbGhzID0gdGhpcy5vcGVyYXRvcl9tb2QoKVxyXG5cclxuICAgIGNvbnN0IGRpdmlkZVJlc3VsdCA9IHRoaXMub3BlcmF0b3JfZGl2aWRlX3ByaW1lKGxocylcclxuXHJcbiAgICByZXR1cm4gZGl2aWRlUmVzdWx0XHJcbiAgfVxyXG5cclxuICBvcGVyYXRvcl9kaXZpZGVfcHJpbWUobGhzOiBBU1QpOiBBU1Qge1xyXG4gICAgLy8gb3BlcmF0b3JfZGl2aWRlX3ByaW1lIDogZXBzaWxvbiB8IERJVklERSBvcGVyYXRvcl9tb2Qgb3BlcmF0b3JfZGl2aWRlX3ByaW1lXHJcblxyXG4gICAgbGV0IG9wID0gdGhpcy5wZWVrKClcclxuXHJcbiAgICBpZiAob3AudHlwZSAhPT0gJ29wZXJhdG9yJyB8fCBvcC52YWx1ZSAhPT0gJ2RpdmlkZScpIHtcclxuICAgICAgZGVidWcoJ29wZXJhdG9yX2RpdmlkZV9wcmltZSAtIGVwc2lsb24nKVxyXG4gICAgICByZXR1cm4gbGhzXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBPcGVyYXRvciB0b2tlblxyXG4gICAgICB0aGlzLm5leHRfdG9rZW4oKVxyXG4gICAgfVxyXG5cclxuICAgIGRlYnVnKCdvcGVyYXRvcl9kaXZpZGVfcHJpbWUgLSBuZXh0IG9wZXJhdG9yJylcclxuXHJcbiAgICBsZXQgcmhzID0gdGhpcy5vcGVyYXRvcl9tb2QoKVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wZXJhdG9yX2RpdmlkZV9wcmltZSh7XHJcbiAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgIG9wZXJhdG9yOiAnZGl2aWRlJyxcclxuICAgICAgbGhzLFxyXG4gICAgICByaHMsXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgb3BlcmF0b3JfbW9kKCk6IEFTVCB7XHJcbiAgICAvLyBvcGVyYXRvcl9tb2QgOiBvcGVyYXRvcl9leHAgKCBNT0RVTFVTIG9wZXJhdG9yX21vZCApP1xyXG5cclxuICAgIGRlYnVnKCdtb2R1bHVzIGxlZnQnKVxyXG5cclxuICAgIGxldCBsaHMgPSB0aGlzLm9wZXJhdG9yX2V4cCgpXHJcbiAgICBsZXQgb3AgPSB0aGlzLnBlZWsoKVxyXG5cclxuICAgIGlmIChvcC50eXBlICE9PSAnb3BlcmF0b3InIHx8IG9wLnZhbHVlICE9PSAnbW9kdWx1cycpIHtcclxuICAgICAgZGVidWcoJ21vZHVsdXMgb25seSBsZWZ0IHNpZGUnKVxyXG4gICAgICByZXR1cm4gbGhzXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBPcGVyYXRvciB0b2tlblxyXG4gICAgICB0aGlzLm5leHRfdG9rZW4oKVxyXG4gICAgfVxyXG5cclxuICAgIGRlYnVnKCdtb2R1bHVzIHJpZ2h0JylcclxuXHJcbiAgICBsZXQgcmhzID0gdGhpcy5vcGVyYXRvcl9tb2QoKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgIG9wZXJhdG9yOiAnbW9kdWx1cycsXHJcbiAgICAgIGxocyxcclxuICAgICAgcmhzLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb3BlcmF0b3JfZXhwKCk6IEFTVCB7XHJcbiAgICAvLyBvcGVyYXRvcl9leHAgOiBzdWJzY3JpcHQgKCBFWFBPTkVOVCBvcGVyYXRvcl9leHAgKT9cclxuXHJcbiAgICBsZXQgbGhzID0gdGhpcy5zdWJzY3JpcHQoKVxyXG4gICAgbGV0IG9wID0gdGhpcy5wZWVrKClcclxuXHJcbiAgICBpZiAob3AudHlwZSAhPT0gJ29wZXJhdG9yJyB8fCBvcC52YWx1ZSAhPT0gJ2V4cG9uZW50Jykge1xyXG4gICAgICBkZWJ1ZygnbW9kdWx1cyBvbmx5IGxlZnQgc2lkZScpXHJcbiAgICAgIHJldHVybiBsaHNcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIE9wZXJhdG9yIHRva2VuXHJcbiAgICAgIHRoaXMubmV4dF90b2tlbigpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJocyA9IHRoaXMub3BlcmF0b3JfZXhwKClcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnb3BlcmF0b3InLFxyXG4gICAgICBvcGVyYXRvcjogJ2V4cG9uZW50JyxcclxuICAgICAgbGhzLFxyXG4gICAgICByaHMsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXJpYWJsZSgpOiBBU1Qge1xyXG4gICAgdGhpcy5lYXQoJ3ZhcmlhYmxlJylcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAndmFyaWFibGUnLFxyXG4gICAgICB2YWx1ZTogKHRoaXMuY3VycmVudF90b2tlbiBhcyBWYWxUb2tlbikudmFsdWUudG9TdHJpbmcoKSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmlwdCgpOiBBU1Qge1xyXG4gICAgLy8gc3Vic2NyaXB0IDogbnVtYmVyICggU1VCU0NSSVBUIHN1YnNjcmlwdCApP1xyXG4gICAgY29uc3QgYmFzZV9udW0gPSB0aGlzLm51bWJlcigpXHJcblxyXG4gICAgaWYgKHRoaXMucGVlaygpLnR5cGUgPT09ICd1bmRlcnNjb3JlJykge1xyXG4gICAgICB0aGlzLmVhdCgndW5kZXJzY29yZScpXHJcblxyXG4gICAgICBjb25zdCBzdWJfdmFsdWUgPSB0aGlzLnN1YnNjcmlwdCgpXHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdzdWJzY3JpcHQnLFxyXG4gICAgICAgIGJhc2U6IGJhc2VfbnVtLFxyXG4gICAgICAgIHN1YnNjcmlwdDogc3ViX3ZhbHVlLFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJhc2VfbnVtXHJcbiAgfVxyXG5cclxuICBudW1iZXIoKTogQVNUIHtcclxuICAgIC8vIG51bWJlciA6IE5VTUJFUlxyXG4gICAgLy8gICAgICAgIHwgdW5pX29wZXJhdG9yXHJcbiAgICAvLyAgICAgICAgfCB2YXJpYWJsZVxyXG4gICAgLy8gICAgICAgIHwga2V5d29yZFxyXG4gICAgLy8gICAgICAgIHwgc3ltYm9sXHJcbiAgICAvLyAgICAgICAgfCBncm91cFxyXG5cclxuICAgIGRlYnVnKCdudW1iZXInKVxyXG5cclxuICAgIHRoaXMucGVlaygpXHJcblxyXG4gICAgaWYgKHRoaXMucGVla190b2tlbiEudHlwZSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgdGhpcy5uZXh0X3Rva2VuKClcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICAgIHZhbHVlOiAodGhpcy5jdXJyZW50X3Rva2VuIGFzIFZhbFRva2VuKS52YWx1ZSBhcyBudW1iZXIsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5wZWVrX3Rva2VuIS50eXBlID09PSAnb3BlcmF0b3InKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnVuaV9vcGVyYXRvcigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGVla190b2tlbiEudHlwZSA9PT0gJ3ZhcmlhYmxlJykge1xyXG4gICAgICByZXR1cm4gdGhpcy52YXJpYWJsZSgpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGVla190b2tlbiEudHlwZSA9PT0gJ2tleXdvcmQnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmtleXdvcmQoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICdicmFja2V0Jykge1xyXG4gICAgICByZXR1cm4gdGhpcy5ncm91cCgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5uZXh0X3Rva2VuKClcclxuICAgIHRoaXMuZXJyb3IoXHJcbiAgICAgICdFeHBlY3RlZCBudW1iZXIsIHZhcmlhYmxlLCBmdW5jdGlvbiwgZ3JvdXAsIG9yICsgLSBmb3VuZCAnICtcclxuICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW50X3Rva2VuKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgdW5pX29wZXJhdG9yKCk6IE51bWJlck5vZGUgfCBVbmlPcGVyTm9kZSB7XHJcbiAgICB0aGlzLmVhdCgnb3BlcmF0b3InKVxyXG4gICAgaWYgKCh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlID09PSAncGx1cycgfHxcclxuICAgICAgKHRoaXMuY3VycmVudF90b2tlbiBhcyBWYWxUb2tlbikudmFsdWUgPT09ICdtaW51cycpIHtcclxuICAgICAgbGV0IHByZWZpeCA9ICh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlIGFzIChcInBsdXNcIiB8IFwibWludXNcIilcclxuICAgICAgbGV0IHZhbHVlID0gdGhpcy5udW1iZXIoKVxyXG5cclxuICAgICAgaWYgKHZhbHVlLnR5cGUgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxyXG4gICAgICAgICAgdmFsdWU6IHByZWZpeCA9PT0gJ21pbnVzJyA/IC12YWx1ZS52YWx1ZSA6IHZhbHVlLnZhbHVlLFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAndW5pLW9wZXJhdG9yJyxcclxuICAgICAgICBvcGVyYXRvcjogcHJlZml4LFxyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVycm9yKCdVbnN1cHBvcnRlZCB1bmktb3BlcmF0b3InKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=