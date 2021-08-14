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
      return this.operator_plus();
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

  operator_plus() {
    // // operator : operator_term ((PLUS | MINUS) operator)?
    // debug('operator left')
    let lhs = this.operator_minus();
    let op = this.peek();

    if (op.type !== 'operator' || op.value !== 'plus') {
      (0, _logger.debug)('operator only left side');
      return lhs;
    } // Operator token


    this.next_token();
    (0, _logger.debug)('operator right');
    let rhs = this.operator_plus();
    return {
      type: 'operator',
      operator: op.value,
      lhs,
      rhs
    };
  }

  operator_minus() {
    // debug('op mul left')
    let lhs = this.operator_multiply();
    return this.operator_minus_prime(lhs);
  }

  operator_minus_prime(lhs) {
    // debug('op mul left')
    let op = this.peek();

    if (op.type !== 'operator' || op.value !== 'minus') {
      // debug('term only left side')
      return lhs;
    } else {
      // Operator token
      this.next_token();
    } // debug('op mul right')


    let rhs = this.operator_multiply();
    return this.operator_divide_prime({
      type: 'operator',
      operator: op.value,
      lhs,
      rhs
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyTGF0ZXgiLCJjb25zdHJ1Y3RvciIsImxhdGV4IiwiTGV4ZXIiLCJvcHRpb25zIiwibGV4ZXIiLCJhc3QiLCJjdXJyZW50X3Rva2VuIiwicGVla190b2tlbiIsImZ1bmN0aW9ucyIsImNvbmNhdCIsInBhcnNlIiwidGV4dCIsImxlbmd0aCIsImVxdWF0aW9uIiwiZWF0IiwibmV4dF90b2tlbiIsInBlZWsiLCJlcnJvciIsIm1lc3NhZ2UiLCJsaW5lIiwic3BsaXQiLCJzcGFjaW5nIiwiaSIsImNvbCIsIkVycm9yIiwidG9rZW5fdHlwZSIsInR5cGUiLCJKU09OIiwic3RyaW5naWZ5IiwibGhzIiwiZXhwciIsInJocyIsIm9wZXJhdG9yX3BsdXMiLCJrZXl3b3JkIiwia3dkIiwidmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImZyYWN0aW9uIiwic3FydCIsImluY2x1ZGVzIiwiZnVuY3Rpb24iLCJjb250ZW50IiwiZ3JvdXAiLCJiYXNlIiwibnVtYmVyIiwib3BlcmF0b3IiLCJub21pbmF0b3IiLCJkZW5vbWluYXRvciIsInRvU3RyaW5nIiwib3BlbiIsIm9wZXJhdG9yX21pbnVzIiwib3AiLCJvcGVyYXRvcl9tdWx0aXBseSIsIm9wZXJhdG9yX21pbnVzX3ByaW1lIiwib3BlcmF0b3JfZGl2aWRlX3ByaW1lIiwib3BlcmF0b3JfZGl2aWRlIiwib3BlcmF0b3JfbW9kIiwiZGl2aWRlUmVzdWx0Iiwib3BlcmF0b3JfZXhwIiwic3Vic2NyaXB0IiwidmFyaWFibGUiLCJiYXNlX251bSIsInN1Yl92YWx1ZSIsInVuaV9vcGVyYXRvciIsInByZWZpeCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFLZSxNQUFNQSxXQUFOLENBQWtCO0FBSS9CO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFNRUMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQWdCQyxLQUFoQixFQUE0QkMsT0FBWSxHQUFHLEVB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Q0EsUUFBSyxLQUFLUixhQUFOLENBQWlDNkIsS0FBakMsS0FBMkMsTUFBM0MsSUFDRCxLQUFLN0IsYUFBTixDQUFpQzZCLEtBQWpDLEtBQTJDLE9BRDdDLEVBQ3NEO0FBQ3BELFVBQUk2QixNQUFNLEdBQUksS0FBSzFELGFBQU4sQ0FBaUM2QixLQUE5QztBQUNBLFVBQUlBLEtBQUssR0FBRyxLQUFLUyxNQUFMLEVBQVo7O0FBRUEsVUFBSVQsS0FBSyxDQUFDVCxJQUFOLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0IsZUFBTztBQUNMQSxVQUFBQSxJQUFJLEVBQUUsUUFERDtBQUVMUyxVQUFBQSxLQUFLLEVBQUU2QixNQUFNLEtBQUssT0FBWCxHQUFxQixDQUFDN0IsS0FBSyxDQUFDQSxLQUE1QixHQUFvQ0EsS0FBSyxDQUFDQTtBQUY1QyxTQUFQO0FBSUQ7O0FBRUQsYUFBTztBQUNMVCxRQUFBQSxJQUFJLEVBQUUsY0FERDtBQUVMbUIsUUFBQUEsUUFBUSxFQUFFbUIsTUFGTDtBQUdMN0IsUUFBQUE7QUFISyxPQUFQO0FBS0QsS0FqQkQsTUFpQk87QUFDTCxXQUFLbEIsS0FBTCxDQUFXLDBCQUFYO0FBQ0Q7QUFDRjs7QUE1a0I4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmdW5jdGlvbnMgZnJvbSAnLi9tb2RlbHMvZnVuY3Rpb25zJ1xyXG5pbXBvcnQgeyBkZWJ1ZyB9IGZyb20gJy4vbG9nZ2VyJ1xyXG5pbXBvcnQgTGV4ZXIgZnJvbSAnLi9sZXhlcnMvTGV4ZXInXHJcbmltcG9ydCBBU1QsIHsgTnVtYmVyTm9kZSwgT3BlcmF0b3JUeXBlLCBVbmlPcGVyTm9kZSB9IGZyb20gJy4vZm9ybWF0dGVycy9BU1QnXHJcbmltcG9ydCBUb2tlbiwgeyBCcmFja2V0VG9rZW4sIFZhbFRva2VuIH0gZnJvbSAnLi9sZXhlcnMvVG9rZW4nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzZXJMYXRleCB7XHJcbiAgbGV4ZXI6IExleGVyXHJcbiAgb3B0aW9uczoge31cclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybiBgbnVsbGA6IHBhcnNlciBlcnJvclxyXG4gICAqIEByZXR1cm4gJyc6IGVtcHR5IGlucHV0XHJcbiAgICogQHJldHVybiBgQVNUYDogbm9ybWFsXHJcbiAgICovXHJcbiAgYXN0OiBBU1QgfCBudWxsIHwgJydcclxuICBjdXJyZW50X3Rva2VuOiBUb2tlbiB8IG51bGxcclxuICBwZWVrX3Rva2VuOiBUb2tlbiB8IG51bGxcclxuICBmdW5jdGlvbnM6IHN0cmluZ1tdXHJcblxyXG4gIGNvbnN0cnVjdG9yKGxhdGV4OiBzdHJpbmcsIExleGVyOiBhbnksIG9wdGlvbnM6IGFueSA9IHt9KSB7XHJcbiAgICAvLyBpZiAoIShMZXhlciBpbnN0YW5jZW9mIExleGVyQ2xhc3MpKSB7XHJcbiAgICAvLyAgIHRocm93IEVycm9yKCdQbGVhc2UgcGFyc2UgYSB2YWxpZCBsZXhlciBhcyBzZWNvbmQgYXJndW1lbnQnKVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHRoaXMubGV4ZXIgPSBuZXcgTGV4ZXIobGF0ZXgpXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcbiAgICB0aGlzLmFzdCA9IG51bGxcclxuICAgIHRoaXMuY3VycmVudF90b2tlbiA9IG51bGxcclxuICAgIHRoaXMucGVla190b2tlbiA9IG51bGxcclxuICAgIHRoaXMuZnVuY3Rpb25zID0gZnVuY3Rpb25zLmNvbmNhdChvcHRpb25zPy5mdW5jdGlvbnMgfHwgW10pXHJcbiAgfVxyXG5cclxuICBwYXJzZSgpIHtcclxuICAgIGRlYnVnKCdcXG5MYXRleCBwYXJzZXIgLnBhcnNlKCknKVxyXG4gICAgaWYgKHRoaXMubGV4ZXIudGV4dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5hc3QgPSAnJztcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hc3QgPSB0aGlzLmVxdWF0aW9uKClcclxuXHJcbiAgICAgIHRoaXMuZWF0KCdFT0YnKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXN0XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBpbnZva2UgdGhpcyBtZXRob2QgdG8gdXBkYXRlIGB0aGlzLmN1cnJlbnRfdG9rZW5gLFxyXG4gICAqIHVwZGF0ZSBgdGhpcy5jdXJyZW50X3Rva2VuYCBtZWFucyB0aGF0IG1ldGhvZCBpcyByZWFkeSB0byBoYW5kbGUgXHJcbiAgICogY3VycmVudCB0b2tlblxyXG4gICAqL1xyXG4gIG5leHRfdG9rZW4oKSB7XHJcbiAgICBpZiAodGhpcy5wZWVrX3Rva2VuICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudF90b2tlbiA9IHRoaXMucGVla190b2tlblxyXG4gICAgICB0aGlzLnBlZWtfdG9rZW4gPSBudWxsXHJcbiAgICAgIGRlYnVnKCduZXh0IHRva2VuIGZyb20gcGVlaycsIHRoaXMuY3VycmVudF90b2tlbilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudF90b2tlbiA9IHRoaXMubGV4ZXIubmV4dF90b2tlbigpXHJcbiAgICAgIGRlYnVnKCduZXh0IHRva2VuJywgdGhpcy5jdXJyZW50X3Rva2VuKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudF90b2tlblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdXBkYXRlIGB0aGlzLnBlZWtfdG9rZW5gIGlmIGl0J3Mgbm90IG51bGwsXHJcbiAgICogbWV0aG9kIHVzdWFsbHkgdXNlIGB0aGlzLnBlZWtfdG9rZW5gIHRvIHNlZSBpZiBpdCBjYW4gaGFuZGxlIG5leHQgdG9rZW4sXHJcbiAgICogaWYgbWV0aG9kIGNhbiBoYW5kbGUgbmV4dCB0b2tlbiwgaXQgd2lsbCBpbnZva2UgYHRoaXMubmV4dF90b2tlbigpYCB0byBcclxuICAgKiB1cGRhdGUgY3VycmVudCB0b2tlbiBhbmQgaGFuZGxlIGl0XHJcbiAgICovXHJcbiAgcGVlaygpIHtcclxuICAgIGlmICh0aGlzLnBlZWtfdG9rZW4gPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5wZWVrX3Rva2VuID0gdGhpcy5sZXhlci5uZXh0X3Rva2VuKClcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZygnbmV4dCB0b2tlbiBmcm9tIHBlZWsnLCB0aGlzLnBlZWtfdG9rZW4pXHJcbiAgICByZXR1cm4gdGhpcy5wZWVrX3Rva2VuXHJcbiAgfVxyXG5cclxuICBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBuZXZlciB7XHJcbiAgICBsZXQgbGluZSA9IHRoaXMubGV4ZXIudGV4dC5zcGxpdCgnXFxuJylbdGhpcy5sZXhlci5saW5lXVxyXG4gICAgbGV0IHNwYWNpbmcgPSAnJ1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZXhlci5jb2w7IGkrKykge1xyXG4gICAgICBzcGFjaW5nICs9ICcgJ1xyXG4gICAgfVxyXG5cclxuICAgIHRocm93IEVycm9yKFxyXG4gICAgICBgUGFyc2VyIGVycm9yXFxuJHtsaW5lfVxcbiR7c3BhY2luZ31eXFxuRXJyb3IgYXQgbGluZTogJHt0aGlzLmxleGVyLmxpbmUgKyAxXHJcbiAgICAgIH0gY29sOiAke3RoaXMubGV4ZXIuY29sICsgMX1cXG4ke21lc3NhZ2V9YFxyXG4gICAgKVxyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHNpbWlsYXIgdG8gYHRoaXMubmV4dF90b2tlbigpYCwgYnV0IGl0IGFzc2VydCB0aGUgdHlwZSBvZlxyXG4gICAqIG5leHQgdG9rZW5cclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRva2VuX3R5cGVcclxuICAgKi9cclxuICBlYXQodG9rZW5fdHlwZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5uZXh0X3Rva2VuKCkudHlwZSAhPT0gdG9rZW5fdHlwZSkge1xyXG4gICAgICB0aGlzLmVycm9yKFxyXG4gICAgICAgIGBFeHBlY3RlZCAke3Rva2VuX3R5cGV9IGZvdW5kICR7SlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW50X3Rva2VuKX1gXHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVxdWF0aW9uKCk6IEFTVCB7XHJcbiAgICAvLyBlcXVhdGlvbiA6IGV4cHIgKCBFUVVBTCBleHByICk/XHJcbiAgICBsZXQgbGhzID0gdGhpcy5leHByKClcclxuXHJcbiAgICBpZiAodGhpcy5wZWVrKCkudHlwZSAhPT0gJ2VxdWFsJykge1xyXG4gICAgICByZXR1cm4gbGhzXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5leHRfdG9rZW4oKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCByaHMgPSB0aGlzLmV4cHIoKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdlcXVhdGlvbicsXHJcbiAgICAgIGxocyxcclxuICAgICAgcmhzLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwcigpOiBBU1Qge1xyXG4gICAgLy8gZXhwciA6IG9wZXJhdG9yXHJcblxyXG4gICAgZGVidWcoJ2V4cHInKVxyXG5cclxuICAgIHRoaXMucGVlaygpXHJcblxyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICdudW1iZXInIHx8XHJcbiAgICAgIHRoaXMucGVla190b2tlbiEudHlwZSA9PT0gJ29wZXJhdG9yJyB8fFxyXG4gICAgICB0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICd2YXJpYWJsZScgfHxcclxuICAgICAgLy8gdGhpcy5wZWVrX3Rva2VuLnR5cGUgPT09ICdmdW5jdGlvbicgfHxcclxuICAgICAgdGhpcy5wZWVrX3Rva2VuIS50eXBlID09PSAna2V5d29yZCcgfHxcclxuICAgICAgdGhpcy5wZWVrX3Rva2VuIS50eXBlID09PSAnYnJhY2tldCdcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcGVyYXRvcl9wbHVzKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiAodGhpcy5wZWVrX3Rva2VuLnR5cGUgPT09ICdicmFja2V0JyAmJiB0aGlzLnBlZWtfdG9rZW4ub3BlbiA9PT0gZmFsc2UpIHtcclxuICAgIC8vICAgcmV0dXJuIG51bGxcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBpZiAodGhpcy5wZWVrX3Rva2VuIS50eXBlID09PSAnRU9GJykge1xyXG4gICAgLy8gICB0aGlzLm5leHRfdG9rZW4oKVxyXG4gICAgLy8gICByZXR1cm4gbnVsbFxyXG4gICAgLy8gfVxyXG5cclxuICAgIHRoaXMubmV4dF90b2tlbigpXHJcbiAgICB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIHRva2VuOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuY3VycmVudF90b2tlbil9YClcclxuICB9XHJcblxyXG4gIGtleXdvcmQoKTogQVNUIHtcclxuICAgIC8vIGtleXdvcmQgOiBLRVlXT1JEXHJcbiAgICAvLyAgICAgICAgIHwgZnJhY3Rpb25cclxuICAgIC8vICAgICAgICAgfCBmdW5jdGlvblxyXG5cclxuICAgIGRlYnVnKCdrZXl3b3JkJylcclxuXHJcbiAgICBpZiAodGhpcy5wZWVrKCkudHlwZSAhPT0gJ2tleXdvcmQnKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdFeHBlY3RlZCBrZXl3b3JkIGZvdW5kICcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnBlZWtfdG9rZW4pKVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRoaXMucGVla190b2tlbi50eXBlID09PSBcImtleXdvcmRcIiAqL1xyXG4gICAgbGV0IGt3ZCA9ICh0aGlzLnBlZWtfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlXHJcbiAgICBrd2QgPSAoa3dkIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKVxyXG5cclxuICAgIGRlYnVnKCdrZXl3b3JkIC0nLCBrd2QpXHJcblxyXG4gICAgaWYgKGt3ZCA9PT0gJ2ZyYWMnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZyYWN0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoa3dkID09PSAnc3FydCcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3FydCgpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZnVuY3Rpb25zLmluY2x1ZGVzKGt3ZC50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5mdW5jdGlvbigpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lYXQoJ2tleXdvcmQnKVxyXG4gICAgdGhpcy5lcnJvcignVW5rbm93IGtleXdvcmQ6JyArICh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlKVxyXG4gIH1cclxuXHJcbiAgc3FydCgpOiBBU1Qge1xyXG4gICAgLy8gc3FydCA6IFNRUlQgKExfU1FVQVJFX0JSQUMgTlVNQkVSIFJfU1FVQVJFX0JSQUMpPyBHUk9VUFxyXG4gICAgZGVidWcoJ3NxcnQnKVxyXG5cclxuICAgIHRoaXMuZWF0KCdrZXl3b3JkJylcclxuXHJcbiAgICBpZiAoKHRoaXMuY3VycmVudF90b2tlbiBhcyBWYWxUb2tlbikudmFsdWUgIT09ICdzcXJ0Jykge1xyXG4gICAgICB0aGlzLmVycm9yKCdFeHBlY3RlZCBzcXJ0IGZvdW5kICcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmN1cnJlbnRfdG9rZW4pKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICgodGhpcy5wZWVrKCkgYXMgVmFsVG9rZW4gfCBCcmFja2V0VG9rZW4pLnZhbHVlICE9PSAnWycpIHtcclxuICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLmdyb3VwKClcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogJ2Z1bmN0aW9uJyxcclxuICAgICAgICB2YWx1ZTogJ3NxcnQnLFxyXG4gICAgICAgIGNvbnRlbnQsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVhdCgnYnJhY2tldCcpXHJcbiAgICBpZiAoKHRoaXMuY3VycmVudF90b2tlbiBhcyBCcmFja2V0VG9rZW4pLnZhbHVlICE9PSAnWycpIHtcclxuICAgICAgdGhpcy5lcnJvcihcclxuICAgICAgICAnRXhwZWN0ZWQgXCJbXCIgYnJhY2tldCwgZm91bmQgJyArIEpTT04uc3RyaW5naWZ5KHRoaXMuY3VycmVudF90b2tlbilcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBiYXNlID0gdGhpcy5udW1iZXIoKVxyXG5cclxuICAgIHRoaXMuZWF0KCdicmFja2V0JylcclxuICAgIGlmICgodGhpcy5jdXJyZW50X3Rva2VuIGFzIEJyYWNrZXRUb2tlbikudmFsdWUgIT09ICddJykge1xyXG4gICAgICB0aGlzLmVycm9yKFxyXG4gICAgICAgICdFeHBlY3RlZCBcIl1cIiBicmFja2V0LCBmb3VuZCAnICsgSlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW50X3Rva2VuKVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHZhbHVlID0gdGhpcy5ncm91cCgpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ29wZXJhdG9yJyxcclxuICAgICAgb3BlcmF0b3I6ICdleHBvbmVudCcsXHJcbiAgICAgIGxoczogdmFsdWUsXHJcbiAgICAgIHJoczoge1xyXG4gICAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgICAgb3BlcmF0b3I6ICdkaXZpZGUnLFxyXG4gICAgICAgIGxoczoge1xyXG4gICAgICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgICAgICB2YWx1ZTogMSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJoczogYmFzZSxcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZyYWN0aW9uKCk6IEFTVCB7XHJcbiAgICAvLyBmcmFjdGlvbiA6IEZSQUMgZ3JvdXAgZ3JvdXBcclxuXHJcbiAgICBkZWJ1ZygnZnJhY3Rpb24nKVxyXG5cclxuICAgIHRoaXMuZWF0KCdrZXl3b3JkJylcclxuXHJcbiAgICBpZiAoKHRoaXMuY3VycmVudF90b2tlbiBhcyBWYWxUb2tlbikudmFsdWUgIT09ICdmcmFjJykge1xyXG4gICAgICB0aGlzLmVycm9yKFxyXG4gICAgICAgICdFeHBlY3RlZCBmcmFjdGlvbiBmb3VuZCAnICsgSlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW50X3Rva2VuKVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5vbWluYXRvciA9IHRoaXMuZ3JvdXAoKVxyXG4gICAgbGV0IGRlbm9taW5hdG9yID0gdGhpcy5ncm91cCgpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ29wZXJhdG9yJyxcclxuICAgICAgb3BlcmF0b3I6ICdkaXZpZGUnLFxyXG4gICAgICBsaHM6IG5vbWluYXRvcixcclxuICAgICAgcmhzOiBkZW5vbWluYXRvcixcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uKCk6IEFTVCB7XHJcbiAgICAvLyBmdW5jdGlvbiA6IEZVTkNUSU9OICggZ3JvdXAgfCBudW1iZXIgKVxyXG5cclxuICAgIGRlYnVnKCdmdW5jdGlvbicpXHJcblxyXG4gICAgdGhpcy5lYXQoJ2tleXdvcmQnKVxyXG4gICAgbGV0IHZhbHVlID0gKHRoaXMuY3VycmVudF90b2tlbiBhcyBWYWxUb2tlbikudmFsdWVcclxuXHJcbiAgICBsZXQgY29udGVudFxyXG4gICAgaWYgKHRoaXMucGVlaygpLnR5cGUgPT09ICdicmFja2V0Jykge1xyXG4gICAgICBjb250ZW50ID0gdGhpcy5ncm91cCgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb250ZW50ID0gdGhpcy5udW1iZXIoKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdmdW5jdGlvbicsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZS50b1N0cmluZygpLFxyXG4gICAgICBjb250ZW50OiBjb250ZW50LFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ3JvdXAoKTogQVNUIHtcclxuICAgIC8vIGdyb3VwIDogTEJSQUNLRVQgZXhwciBSQlJBQ0tFVFxyXG5cclxuICAgIGRlYnVnKCdzdGFydCBncm91cCcpXHJcblxyXG4gICAgdGhpcy5lYXQoJ2JyYWNrZXQnKVxyXG4gICAgaWYgKCh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgQnJhY2tldFRva2VuKS5vcGVuICE9PSB0cnVlKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoJ0V4cGVjdGVkIG9wZW5pbmcgYnJhY2tldCBmb3VuZCAnICsgdGhpcy5jdXJyZW50X3Rva2VuKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjb250ZW50ID0gdGhpcy5leHByKClcclxuXHJcbiAgICB0aGlzLmVhdCgnYnJhY2tldCcpXHJcbiAgICBpZiAoKHRoaXMuY3VycmVudF90b2tlbiBhcyBCcmFja2V0VG9rZW4pLm9wZW4gIT09IGZhbHNlKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoJ0V4cGVjdGVkIGNsb3NpbmcgYnJhY2tldCBmb3VuZCAnICsgdGhpcy5jdXJyZW50X3Rva2VuKVxyXG4gICAgfVxyXG5cclxuICAgIGRlYnVnKCdlbmQgZ3JvdXAnKVxyXG5cclxuICAgIHJldHVybiBjb250ZW50XHJcbiAgfVxyXG5cclxuICBvcGVyYXRvcl9wbHVzKCk6IEFTVCB7XHJcbiAgICAvLyAvLyBvcGVyYXRvciA6IG9wZXJhdG9yX3Rlcm0gKChQTFVTIHwgTUlOVVMpIG9wZXJhdG9yKT9cclxuICAgIC8vIGRlYnVnKCdvcGVyYXRvciBsZWZ0JylcclxuICAgIGxldCBsaHMgPSB0aGlzLm9wZXJhdG9yX21pbnVzKClcclxuICAgIGxldCBvcCA9IHRoaXMucGVlaygpXHJcblxyXG4gICAgaWYgKG9wLnR5cGUgIT09ICdvcGVyYXRvcicgfHwgb3AudmFsdWUgIT09ICdwbHVzJykge1xyXG4gICAgICBkZWJ1Zygnb3BlcmF0b3Igb25seSBsZWZ0IHNpZGUnKVxyXG4gICAgICByZXR1cm4gbGhzXHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3BlcmF0b3IgdG9rZW5cclxuICAgIHRoaXMubmV4dF90b2tlbigpXHJcblxyXG4gICAgZGVidWcoJ29wZXJhdG9yIHJpZ2h0JylcclxuICAgIGxldCByaHMgPSB0aGlzLm9wZXJhdG9yX3BsdXMoKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgIG9wZXJhdG9yOiBvcC52YWx1ZSxcclxuICAgICAgbGhzLFxyXG4gICAgICByaHMsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvcGVyYXRvcl9taW51cygpOiBBU1Qge1xyXG4gICAgLy8gZGVidWcoJ29wIG11bCBsZWZ0JylcclxuXHJcbiAgICBsZXQgbGhzID0gdGhpcy5vcGVyYXRvcl9tdWx0aXBseSgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3BlcmF0b3JfbWludXNfcHJpbWUobGhzKVxyXG4gIH1cclxuXHJcbiAgb3BlcmF0b3JfbWludXNfcHJpbWUobGhzOiBBU1QpOiBBU1Qge1xyXG4gICAgLy8gZGVidWcoJ29wIG11bCBsZWZ0JylcclxuXHJcbiAgICBsZXQgb3AgPSB0aGlzLnBlZWsoKVxyXG5cclxuICAgIGlmIChvcC50eXBlICE9PSAnb3BlcmF0b3InIHx8IG9wLnZhbHVlICE9PSAnbWludXMnKSB7XHJcbiAgICAgIC8vIGRlYnVnKCd0ZXJtIG9ubHkgbGVmdCBzaWRlJylcclxuICAgICAgcmV0dXJuIGxoc1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gT3BlcmF0b3IgdG9rZW5cclxuICAgICAgdGhpcy5uZXh0X3Rva2VuKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBkZWJ1Zygnb3AgbXVsIHJpZ2h0JylcclxuXHJcbiAgICBsZXQgcmhzID0gdGhpcy5vcGVyYXRvcl9tdWx0aXBseSgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3BlcmF0b3JfZGl2aWRlX3ByaW1lKHtcclxuICAgICAgdHlwZTogJ29wZXJhdG9yJyxcclxuICAgICAgb3BlcmF0b3I6IG9wLnZhbHVlLFxyXG4gICAgICBsaHMsXHJcbiAgICAgIHJocyxcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvcGVyYXRvcl9tdWx0aXBseSgpOiBBU1Qge1xyXG4gICAgLy8gb3BlcmF0b3JfbXVsdGlwbHkgOiAob3BlcmF0b3JfZGl2aWRlIHwgR1JPVVApICggKE1VTFRJUExZIG9wZXJhdG9yX211bHRpcGx5KSB8IG51bWJlciApP1xyXG5cclxuICAgIGRlYnVnKCdvcCBtdWwgbGVmdCcpXHJcblxyXG4gICAgbGV0IGxocyA9IHRoaXMub3BlcmF0b3JfZGl2aWRlKClcclxuXHJcbiAgICBsZXQgb3AgPSB0aGlzLnBlZWsoKVxyXG5cclxuICAgIGlmIChcclxuICAgICAgb3AudHlwZSA9PT0gJ251bWJlcicgfHxcclxuICAgICAgb3AudHlwZSA9PT0gJ3ZhcmlhYmxlJyB8fFxyXG4gICAgICBvcC50eXBlID09PSAna2V5d29yZCcgfHxcclxuICAgICAgKG9wLnR5cGUgPT09ICdicmFja2V0JyAmJiBvcC52YWx1ZSA9PT0gJygnKVxyXG4gICAgKSB7XHJcbiAgICAgIG9wID0ge1xyXG4gICAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgICAgdmFsdWU6ICdtdWx0aXBseScsXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgIG9wLnR5cGUgIT09ICdvcGVyYXRvcicgfHxcclxuICAgICAgKG9wLnZhbHVlICE9PSAnbXVsdGlwbHknICYmIG9wLnZhbHVlICE9PSAnZGl2aWRlJylcclxuICAgICkge1xyXG4gICAgICBkZWJ1ZygndGVybSBvbmx5IGxlZnQgc2lkZScpXHJcbiAgICAgIHJldHVybiBsaHNcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIE9wZXJhdG9yIHRva2VuXHJcbiAgICAgIHRoaXMubmV4dF90b2tlbigpXHJcbiAgICB9XHJcblxyXG4gICAgZGVidWcoJ29wIG11bCByaWdodCcpXHJcblxyXG4gICAgbGV0IHJocyA9IHRoaXMub3BlcmF0b3JfbXVsdGlwbHkoKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdvcGVyYXRvcicsXHJcbiAgICAgIG9wZXJhdG9yOiBvcC52YWx1ZSBhcyBPcGVyYXRvclR5cGUsXHJcbiAgICAgIGxocyxcclxuICAgICAgcmhzLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb3BlcmF0b3JfZGl2aWRlKCk6IEFTVCB7XHJcbiAgICAvLyBvcGVyYXRvcl9kaXZpZGUgOiBvcGVyYXRvcl9tb2Qgb3BlcmF0b3JfZGl2aWRlX3ByaW1lXHJcblxyXG4gICAgZGVidWcoJ29wZXJhdG9yX2RpdmlkZScpXHJcblxyXG4gICAgbGV0IGxocyA9IHRoaXMub3BlcmF0b3JfbW9kKClcclxuXHJcbiAgICBjb25zdCBkaXZpZGVSZXN1bHQgPSB0aGlzLm9wZXJhdG9yX2RpdmlkZV9wcmltZShsaHMpXHJcblxyXG4gICAgcmV0dXJuIGRpdmlkZVJlc3VsdFxyXG4gIH1cclxuXHJcbiAgb3BlcmF0b3JfZGl2aWRlX3ByaW1lKGxoczogQVNUKTogQVNUIHtcclxuICAgIC8vIG9wZXJhdG9yX2RpdmlkZV9wcmltZSA6IGVwc2lsb24gfCBESVZJREUgb3BlcmF0b3JfbW9kIG9wZXJhdG9yX2RpdmlkZV9wcmltZVxyXG5cclxuICAgIGxldCBvcCA9IHRoaXMucGVlaygpXHJcblxyXG4gICAgaWYgKG9wLnR5cGUgIT09ICdvcGVyYXRvcicgfHwgb3AudmFsdWUgIT09ICdkaXZpZGUnKSB7XHJcbiAgICAgIGRlYnVnKCdvcGVyYXRvcl9kaXZpZGVfcHJpbWUgLSBlcHNpbG9uJylcclxuICAgICAgcmV0dXJuIGxoc1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gT3BlcmF0b3IgdG9rZW5cclxuICAgICAgdGhpcy5uZXh0X3Rva2VuKClcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1Zygnb3BlcmF0b3JfZGl2aWRlX3ByaW1lIC0gbmV4dCBvcGVyYXRvcicpXHJcblxyXG4gICAgbGV0IHJocyA9IHRoaXMub3BlcmF0b3JfbW9kKClcclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcGVyYXRvcl9kaXZpZGVfcHJpbWUoe1xyXG4gICAgICB0eXBlOiAnb3BlcmF0b3InLFxyXG4gICAgICBvcGVyYXRvcjogJ2RpdmlkZScsXHJcbiAgICAgIGxocyxcclxuICAgICAgcmhzLFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIG9wZXJhdG9yX21vZCgpOiBBU1Qge1xyXG4gICAgLy8gb3BlcmF0b3JfbW9kIDogb3BlcmF0b3JfZXhwICggTU9EVUxVUyBvcGVyYXRvcl9tb2QgKT9cclxuXHJcbiAgICBkZWJ1ZygnbW9kdWx1cyBsZWZ0JylcclxuXHJcbiAgICBsZXQgbGhzID0gdGhpcy5vcGVyYXRvcl9leHAoKVxyXG4gICAgbGV0IG9wID0gdGhpcy5wZWVrKClcclxuXHJcbiAgICBpZiAob3AudHlwZSAhPT0gJ29wZXJhdG9yJyB8fCBvcC52YWx1ZSAhPT0gJ21vZHVsdXMnKSB7XHJcbiAgICAgIGRlYnVnKCdtb2R1bHVzIG9ubHkgbGVmdCBzaWRlJylcclxuICAgICAgcmV0dXJuIGxoc1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gT3BlcmF0b3IgdG9rZW5cclxuICAgICAgdGhpcy5uZXh0X3Rva2VuKClcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZygnbW9kdWx1cyByaWdodCcpXHJcblxyXG4gICAgbGV0IHJocyA9IHRoaXMub3BlcmF0b3JfbW9kKClcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnb3BlcmF0b3InLFxyXG4gICAgICBvcGVyYXRvcjogJ21vZHVsdXMnLFxyXG4gICAgICBsaHMsXHJcbiAgICAgIHJocyxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZXJhdG9yX2V4cCgpOiBBU1Qge1xyXG4gICAgLy8gb3BlcmF0b3JfZXhwIDogc3Vic2NyaXB0ICggRVhQT05FTlQgb3BlcmF0b3JfZXhwICk/XHJcblxyXG4gICAgbGV0IGxocyA9IHRoaXMuc3Vic2NyaXB0KClcclxuICAgIGxldCBvcCA9IHRoaXMucGVlaygpXHJcblxyXG4gICAgaWYgKG9wLnR5cGUgIT09ICdvcGVyYXRvcicgfHwgb3AudmFsdWUgIT09ICdleHBvbmVudCcpIHtcclxuICAgICAgZGVidWcoJ21vZHVsdXMgb25seSBsZWZ0IHNpZGUnKVxyXG4gICAgICByZXR1cm4gbGhzXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBPcGVyYXRvciB0b2tlblxyXG4gICAgICB0aGlzLm5leHRfdG9rZW4oKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCByaHMgPSB0aGlzLm9wZXJhdG9yX2V4cCgpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ29wZXJhdG9yJyxcclxuICAgICAgb3BlcmF0b3I6ICdleHBvbmVudCcsXHJcbiAgICAgIGxocyxcclxuICAgICAgcmhzLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyaWFibGUoKTogQVNUIHtcclxuICAgIHRoaXMuZWF0KCd2YXJpYWJsZScpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ3ZhcmlhYmxlJyxcclxuICAgICAgdmFsdWU6ICh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlLnRvU3RyaW5nKCksXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJzY3JpcHQoKTogQVNUIHtcclxuICAgIC8vIHN1YnNjcmlwdCA6IG51bWJlciAoIFNVQlNDUklQVCBzdWJzY3JpcHQgKT9cclxuICAgIGNvbnN0IGJhc2VfbnVtID0gdGhpcy5udW1iZXIoKVxyXG5cclxuICAgIGlmICh0aGlzLnBlZWsoKS50eXBlID09PSAndW5kZXJzY29yZScpIHtcclxuICAgICAgdGhpcy5lYXQoJ3VuZGVyc2NvcmUnKVxyXG5cclxuICAgICAgY29uc3Qgc3ViX3ZhbHVlID0gdGhpcy5zdWJzY3JpcHQoKVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAnc3Vic2NyaXB0JyxcclxuICAgICAgICBiYXNlOiBiYXNlX251bSxcclxuICAgICAgICBzdWJzY3JpcHQ6IHN1Yl92YWx1ZSxcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBiYXNlX251bVxyXG4gIH1cclxuXHJcbiAgbnVtYmVyKCk6IEFTVCB7XHJcbiAgICAvLyBudW1iZXIgOiBOVU1CRVJcclxuICAgIC8vICAgICAgICB8IHVuaV9vcGVyYXRvclxyXG4gICAgLy8gICAgICAgIHwgdmFyaWFibGVcclxuICAgIC8vICAgICAgICB8IGtleXdvcmRcclxuICAgIC8vICAgICAgICB8IHN5bWJvbFxyXG4gICAgLy8gICAgICAgIHwgZ3JvdXBcclxuXHJcbiAgICBkZWJ1ZygnbnVtYmVyJylcclxuXHJcbiAgICB0aGlzLnBlZWsoKVxyXG5cclxuICAgIGlmICh0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIHRoaXMubmV4dF90b2tlbigpXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgICB2YWx1ZTogKHRoaXMuY3VycmVudF90b2tlbiBhcyBWYWxUb2tlbikudmFsdWUgYXMgbnVtYmVyLFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGVla190b2tlbiEudHlwZSA9PT0gJ29wZXJhdG9yJykge1xyXG4gICAgICByZXR1cm4gdGhpcy51bmlfb3BlcmF0b3IoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICd2YXJpYWJsZScpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGUoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBlZWtfdG9rZW4hLnR5cGUgPT09ICdrZXl3b3JkJykge1xyXG4gICAgICByZXR1cm4gdGhpcy5rZXl3b3JkKClcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5wZWVrX3Rva2VuIS50eXBlID09PSAnYnJhY2tldCcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ3JvdXAoKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubmV4dF90b2tlbigpXHJcbiAgICB0aGlzLmVycm9yKFxyXG4gICAgICAnRXhwZWN0ZWQgbnVtYmVyLCB2YXJpYWJsZSwgZnVuY3Rpb24sIGdyb3VwLCBvciArIC0gZm91bmQgJyArXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuY3VycmVudF90b2tlbilcclxuICAgIClcclxuICB9XHJcblxyXG4gIHVuaV9vcGVyYXRvcigpOiBOdW1iZXJOb2RlIHwgVW5pT3Blck5vZGUge1xyXG4gICAgdGhpcy5lYXQoJ29wZXJhdG9yJylcclxuICAgIGlmICgodGhpcy5jdXJyZW50X3Rva2VuIGFzIFZhbFRva2VuKS52YWx1ZSA9PT0gJ3BsdXMnIHx8XHJcbiAgICAgICh0aGlzLmN1cnJlbnRfdG9rZW4gYXMgVmFsVG9rZW4pLnZhbHVlID09PSAnbWludXMnKSB7XHJcbiAgICAgIGxldCBwcmVmaXggPSAodGhpcy5jdXJyZW50X3Rva2VuIGFzIFZhbFRva2VuKS52YWx1ZSBhcyAoXCJwbHVzXCIgfCBcIm1pbnVzXCIpXHJcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMubnVtYmVyKClcclxuXHJcbiAgICAgIGlmICh2YWx1ZS50eXBlID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgICAgIHZhbHVlOiBwcmVmaXggPT09ICdtaW51cycgPyAtdmFsdWUudmFsdWUgOiB2YWx1ZS52YWx1ZSxcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogJ3VuaS1vcGVyYXRvcicsXHJcbiAgICAgICAgb3BlcmF0b3I6IHByZWZpeCxcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lcnJvcignVW5zdXBwb3J0ZWQgdW5pLW9wZXJhdG9yJylcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19