// import greekLetters from '../models/greek-letters'
import AST, { EquationNode, FunctionNode, NumberNode, OperatorNode, UniOperNode, VariableNode } from './AST'
import nerdamer, { Expression } from 'nerdamer'
require('nerdamer/all')

export default class NerdamerFormatter {
  ast: AST
  private parser: any
  private Symbol: any

  constructor(ast: AST) {
    this.ast = ast
    this.parser = nerdamer.getCore().PARSER
    this.Symbol = nerdamer.getCore().Symbol
  }

  getExpression() {
    const symbol = this.format();
    const Expression = nerdamer.getCore().Expression;
    return (new Expression(symbol) as Expression)
  }

  format(root = this.ast): any {
    if (root === null) {
      return ''
    }

    switch (root.type) {
      case 'operator':
        return this.operator(root)
      case 'number':
        return this.number(root)
      case 'function':
        return this.function(root)
      case 'variable':
        return this.variable(root)
      case 'equation':
        return this.equation(root)
      case 'subscript':
        return this.subscript()
      case 'uni-operator':
        return this.uni_operator(root)
      default:
        throw Error('Unexpected type: ' + root)
    }
  }

  operator(root: OperatorNode) {
    // const op: string = root.operator

    const lhs = this.format(root.lhs)
    const rhs = this.format(root.rhs)

    switch (root.operator) {
      case 'plus':
        return this.parser.add(lhs, rhs)
      case 'minus':
        return this.parser.subtract(lhs, rhs)
      case 'multiply':
        return this.parser.multiply(lhs, rhs)
      case 'divide':
        return this.parser.divide(lhs, rhs)
      case 'modulus':
        return this.parser.mod(lhs, rhs)
      case 'exponent':
        return this.parser.pow(lhs, rhs)
      default:
        throw Error('Unknow operator' + root.operator)
    }

    // switch (op) {
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
  }

  // fragment(root: OperatorNode) {
  //   let lhs = this.format(root.lhs)
  //   let rhs = this.format(root.rhs)

  //   return `\\frac{${lhs}}{${rhs}}`
  // }

  number(root: NumberNode) {
    return new this.Symbol(root.value)
  }

  function(root: FunctionNode) {
    // if (root.value === 'sqrt') {
    //   return `\\${root.value}{${this.format(root.content)}}`
    // }
    // return `\\${root.value}\\left(${this.format(root.content)}\\right)`
    return this.parser.callfunction(root.value, this.format(root.content))
  }

  variable(root: VariableNode) {
    // if (greekLetters.map(l => l.name).includes((root.value as string).toLowerCase())) {
    //   return `\\${root.value}`
    // }
    // return `${root.value}`
    return this.Symbol(root.value)
  }

  equation(root: EquationNode) {
    // return `${this.format(root.lhs)}=${this.format(root.rhs)}`
    const Equation = nerdamer.getCore().Equation;
    return new Equation(this.format(root.lhs), this.format(root.rhs))
  }

  subscript(): never {
    throw Error('subscript not implemented')
    // if (root.subscript.type === 'variable' && (root.subscript.value as string).length === 1) {
    //   return `${this.format(root.base)}_${this.format(root.subscript)}`
    // }

    // return `${this.format(root.base)}_{${this.format(root.subscript)}}`
  }

  uni_operator(root: UniOperNode) {
    if (root.operator === 'minus') {
      // return `-${this.format(root.value as AST)}`
      return this.parser.subtract(new this.Symbol(0), this.format(root.value as AST))
    }

    return this.format(root.value as AST)
  }
}
