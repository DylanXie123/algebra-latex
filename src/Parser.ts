import functions from './models/functions'
import { debug } from './logger'
import Lexer from './lexers/Lexer'
import AST, { NumberNode, OperatorType, UniOperNode } from './formatters/AST'
import Token, { BracketToken, ValToken } from './lexers/Token'

export default class ParserLatex {
  lexer: Lexer
  options: {}

  /**
   * @return `null`: parser error
   * @return '': empty input
   * @return `AST`: normal
   */
  ast: AST | null | ''
  current_token: Token | null
  peek_token: Token | null
  functions: string[]

  constructor(latex: string, Lexer: any, options: any = {}) {
    // if (!(Lexer instanceof LexerClass)) {
    //   throw Error('Please parse a valid lexer as second argument')
    // }

    this.lexer = new Lexer(latex)
    this.options = options
    this.ast = null
    this.current_token = null
    this.peek_token = null
    this.functions = functions.concat(options?.functions || [])
  }

  parse() {
    debug('\nLatex parser .parse()')
    if (this.lexer.text.length === 0) {
      this.ast = '';
      return '';
    } else {
      this.ast = this.equation()

      this.eat('EOF')

      return this.ast
    }
  }

  /**
   * invoke this method to update `this.current_token`,
   * update `this.current_token` means that method is ready to handle 
   * current token
   */
  next_token() {
    if (this.peek_token !== null) {
      this.current_token = this.peek_token
      this.peek_token = null
      debug('next token from peek', this.current_token)
    } else {
      this.current_token = this.lexer.next_token()
      debug('next token', this.current_token)
    }
    return this.current_token
  }

  /**
   * update `this.peek_token` if it's not null,
   * method usually use `this.peek_token` to see if it can handle next token,
   * if method can handle next token, it will invoke `this.next_token()` to 
   * update current token and handle it
   */
  peek() {
    if (this.peek_token === null) {
      this.peek_token = this.lexer.next_token()
    }

    debug('next token from peek', this.peek_token)
    return this.peek_token
  }

  error(message: string): never {
    let line = this.lexer.text.split('\n')[this.lexer.line]
    let spacing = ''

    for (let i = 0; i < this.lexer.col; i++) {
      spacing += ' '
    }

    throw Error(
      `Parser error\n${line}\n${spacing}^\nError at line: ${this.lexer.line + 1
      } col: ${this.lexer.col + 1}\n${message}`
    )
  }


  /**
   * similar to `this.next_token()`, but it assert the type of
   * next token
   * @param  {string} token_type
   */
  eat(token_type: string) {
    if (this.next_token().type !== token_type) {
      this.error(
        `Expected ${token_type} found ${JSON.stringify(this.current_token)}`
      )
    }
  }

  equation(): AST {
    // equation : expr ( EQUAL expr )?
    let lhs = this.expr()

    if (this.peek().type !== 'equal') {
      return lhs
    } else {
      this.next_token()
    }

    let rhs = this.expr()

    return {
      type: 'equation',
      lhs,
      rhs,
    }
  }

  expr(): AST {
    // expr : operator

    debug('expr')

    this.peek()

    if (
      this.peek_token!.type === 'number' ||
      this.peek_token!.type === 'operator' ||
      this.peek_token!.type === 'variable' ||
      // this.peek_token.type === 'function' ||
      this.peek_token!.type === 'keyword' ||
      this.peek_token!.type === 'bracket'
    ) {
      return this.operator()
    }

    // if (this.peek_token.type === 'bracket' && this.peek_token.open === false) {
    //   return null
    // }

    // if (this.peek_token!.type === 'EOF') {
    //   this.next_token()
    //   return null
    // }

    this.next_token()
    this.error(`Unexpected token: ${JSON.stringify(this.current_token)}`)
  }

  keyword(): AST {
    // keyword : KEYWORD
    //         | fraction
    //         | function

    debug('keyword')

    if (this.peek().type !== 'keyword') {
      throw Error('Expected keyword found ' + JSON.stringify(this.peek_token))
    }

    /* this.peek_token.type === "keyword" */
    let kwd = (this.peek_token as ValToken).value
    kwd = (kwd as string).toLowerCase()

    debug('keyword -', kwd)

    if (kwd === 'frac') {
      return this.fraction()
    }

    if (kwd === 'sqrt') {
      return this.sqrt()
    }

    if (this.functions.includes(kwd.toLowerCase())) {
      return this.function()
    }

    this.eat('keyword')
    return {
      type: 'keyword',
      value: (this.current_token as ValToken).value,
    }
  }

  sqrt(): AST {
    // sqrt : SQRT (L_SQUARE_BRAC NUMBER R_SQUARE_BRAC)? GROUP
    debug('sqrt')

    this.eat('keyword')

    if ((this.current_token as ValToken).value !== 'sqrt') {
      this.error('Expected sqrt found ' + JSON.stringify(this.current_token))
    }

    if ((this.peek() as ValToken | BracketToken).value !== '[') {
      let content = this.group()

      return {
        type: 'function',
        value: 'sqrt',
        content,
      }
    }

    this.eat('bracket')
    if ((this.current_token as BracketToken).value !== '[') {
      this.error(
        'Expected "[" bracket, found ' + JSON.stringify(this.current_token)
      )
    }

    let base = this.number()

    this.eat('bracket')
    if ((this.current_token as BracketToken).value !== ']') {
      this.error(
        'Expected "]" bracket, found ' + JSON.stringify(this.current_token)
      )
    }

    let value = this.group()

    return {
      type: 'operator',
      operator: 'exponent',
      lhs: value,
      rhs: {
        type: 'operator',
        operator: 'divide',
        lhs: {
          type: 'number',
          value: 1,
        },
        rhs: base,
      },
    }
  }

  fraction(): AST {
    // fraction : FRAC group group

    debug('fraction')

    this.eat('keyword')

    if ((this.current_token as ValToken).value !== 'frac') {
      this.error(
        'Expected fraction found ' + JSON.stringify(this.current_token)
      )
    }

    let nominator = this.group()
    let denominator = this.group()

    return {
      type: 'operator',
      operator: 'divide',
      lhs: nominator,
      rhs: denominator,
    }
  }

  function(): AST {
    // function : FUNCTION ( group | number )

    debug('function')

    this.eat('keyword')
    let value = (this.current_token as ValToken).value

    let content
    if (this.peek().type === 'bracket') {
      content = this.group()
    } else {
      content = this.number()
    }

    return {
      type: 'function',
      value: value.toString(),
      content: content,
    }
  }

  group(): AST {
    // group : LBRACKET expr RBRACKET

    debug('start group')

    this.eat('bracket')
    if ((this.current_token as BracketToken).open !== true) {
      this.error('Expected opening bracket found ' + this.current_token)
    }

    let content = this.expr()

    this.eat('bracket')
    if ((this.current_token as BracketToken).open !== false) {
      this.error('Expected closing bracket found ' + this.current_token)
    }

    debug('end group')

    return content
  }

  operator(): AST {
    // operator : operator_term ((PLUS | MINUS) operator)?
    debug('operator left')
    let lhs = this.operator_multiply()
    let op = this.peek()

    if (op.type !== 'operator' || (op.value !== 'plus' && op.value !== 'minus')) {
      debug('operator only left side')
      return lhs
    }

    // Operator token
    this.next_token()

    debug('operator right')
    let rhs = this.operator()

    return {
      type: 'operator',
      operator: op.value,
      lhs,
      rhs,
    }
  }

  operator_multiply(): AST {
    // operator_multiply : (operator_divide | GROUP) ( (MULTIPLY operator_multiply) | number )?

    debug('op mul left')

    let lhs = this.operator_divide()

    let op = this.peek()

    if (
      op.type === 'number' ||
      op.type === 'variable' ||
      op.type === 'keyword' ||
      (op.type === 'bracket' && op.value === '(')
    ) {
      op = {
        type: 'operator',
        value: 'multiply',
      }
    } else if (
      op.type !== 'operator' ||
      (op.value !== 'multiply' && op.value !== 'divide')
    ) {
      debug('term only left side')
      return lhs
    } else {
      // Operator token
      this.next_token()
    }

    debug('op mul right')

    let rhs = this.operator_multiply()

    return {
      type: 'operator',
      operator: op.value as OperatorType,
      lhs,
      rhs,
    }
  }

  operator_divide(): AST {
    // operator_divide : operator_mod operator_divide_prime

    debug('operator_divide')

    let lhs = this.operator_mod()

    const divideResult = this.operator_divide_prime(lhs)

    return divideResult
  }

  operator_divide_prime(lhs: AST): AST {
    // operator_divide_prime : epsilon | DIVIDE operator_mod operator_divide_prime

    let op = this.peek()

    if (op.type !== 'operator' || op.value !== 'divide') {
      debug('operator_divide_prime - epsilon')
      return lhs
    } else {
      // Operator token
      this.next_token()
    }

    debug('operator_divide_prime - next operator')

    let rhs = this.operator_mod()

    return this.operator_divide_prime({
      type: 'operator',
      operator: 'divide',
      lhs,
      rhs,
    })
  }

  operator_mod(): AST {
    // operator_mod : operator_exp ( MODULUS operator_mod )?

    debug('modulus left')

    let lhs = this.operator_exp()
    let op = this.peek()

    if (op.type !== 'operator' || op.value !== 'modulus') {
      debug('modulus only left side')
      return lhs
    } else {
      // Operator token
      this.next_token()
    }

    debug('modulus right')

    let rhs = this.operator_mod()

    return {
      type: 'operator',
      operator: 'modulus',
      lhs,
      rhs,
    }
  }

  operator_exp(): AST {
    // operator_exp : subscript ( EXPONENT operator_exp )?

    let lhs = this.subscript()
    let op = this.peek()

    if (op.type !== 'operator' || op.value !== 'exponent') {
      debug('modulus only left side')
      return lhs
    } else {
      // Operator token
      this.next_token()
    }

    let rhs = this.operator_exp()

    return {
      type: 'operator',
      operator: 'exponent',
      lhs,
      rhs,
    }
  }

  variable(): AST {
    this.eat('variable')

    return {
      type: 'variable',
      value: (this.current_token as ValToken).value.toString(),
    }
  }

  subscript(): AST {
    // subscript : number ( SUBSCRIPT subscript )?
    const base_num = this.number()

    if (this.peek().type === 'underscore') {
      this.eat('underscore')

      const sub_value = this.subscript()

      return {
        type: 'subscript',
        base: base_num,
        subscript: sub_value,
      }
    }

    return base_num
  }

  number(): AST {
    // number : NUMBER
    //        | uni_operator
    //        | variable
    //        | keyword
    //        | symbol
    //        | group

    debug('number')

    this.peek()

    if (this.peek_token!.type === 'number') {
      this.next_token()
      return {
        type: "number",
        value: (this.current_token as ValToken).value as number,
      }
    }

    if (this.peek_token!.type === 'operator') {
      return this.uni_operator()
    }

    if (this.peek_token!.type === 'variable') {
      return this.variable()
    }

    if (this.peek_token!.type === 'keyword') {
      return this.keyword()
    }

    if (this.peek_token!.type === 'bracket') {
      return this.group()
    }

    this.next_token()
    this.error(
      'Expected number, variable, function, group, or + - found ' +
      JSON.stringify(this.current_token)
    )
  }

  uni_operator(): NumberNode | UniOperNode {
    this.eat('operator')
    if ((this.current_token as ValToken).value === 'plus' ||
      (this.current_token as ValToken).value === 'minus') {
      let prefix = (this.current_token as ValToken).value as ("plus" | "minus")
      let value = this.number()

      if (value.type === 'number') {
        return {
          type: 'number',
          value: prefix === 'minus' ? -value.value : value.value,
        }
      }

      return {
        type: 'uni-operator',
        operator: prefix,
        value,
      }
    } else {
      this.error('Unsupported uni-operator')
    }
  }
}
