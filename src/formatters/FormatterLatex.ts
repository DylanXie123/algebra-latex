import greekLetters from '../models/greek-letters'
import AST, { EquationNode, FunctionNode, NumberNode, OperatorNode, OperatorType, SubscriptNode, UniOperNode, VariableNode } from './AST'

export default class LatexFormatter {
  ast: AST

  constructor(ast: AST) {
    this.ast = ast
  }

  format(root = this.ast): string {
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
        return this.subscript(root)
      case 'uni-operator':
        return this.uni_operator(root)
      default:
        throw Error('Unexpected type: ' + root.type)
    }
  }

  operator(root: OperatorNode): string {
    let op: string = root.operator

    switch (op) {
      case 'plus':
        op = '+'
        break
      case 'minus':
        op = '-'
        break
      case 'multiply':
        op = '\\cdot '
        break
      case 'divide':
        return this.fragment(root)
      case 'modulus':
        op = '%'
        break
      case 'exponent':
        op = '^'
        break
      default:
    }

    let lhs = this.format(root.lhs)
    let rhs = this.format(root.rhs)

    const precedensOrder = [
      ['modulus'],
      ['exponent'],
      ['multiply'],
      ['plus', 'minus'],
    ]

    const higherPrecedens = (a: string, b: string) => {
      const depth = (op: string) => precedensOrder.findIndex(val => val.includes(op))

      return depth(b) > depth(a)
    }

    const shouldHaveParenthesis = (child: AST) =>
      child.type === 'operator' && higherPrecedens(root.operator, child.operator)

    let lhsParen = shouldHaveParenthesis(root.lhs)
    let rhsParen = shouldHaveParenthesis(root.rhs)

    lhs = lhsParen ? `\\left(${lhs}\\right)` : lhs

    if (root.operator === 'exponent') {
      rhsParen = true
      rhs = rhsParen ? `{${rhs}}` : rhs
    } else {
      rhs = rhsParen ? `\\left(${rhs}\\right)` : rhs
    }

    return `${lhs}${op}${rhs}`
  }

  fragment(root: OperatorNode): string {
    let lhs = this.format(root.lhs)
    let rhs = this.format(root.rhs)

    return `\\frac{${lhs}}{${rhs}}`
  }

  number(root: NumberNode): string {
    return `${root.value}`
  }

  function(root: FunctionNode): string {
    if (root.value === 'sqrt') {
      return `\\${root.value}{${this.format(root.content)}}`
    }
    return `\\${root.value}\\left(${this.format(root.content)}\\right)`
  }

  variable(root: VariableNode): string {
    if (greekLetters.map(l => l.name).includes((root.value as string).toLowerCase())) {
      return `\\${root.value}`
    }
    return `${root.value}`
  }

  equation(root: EquationNode): string {
    return `${this.format(root.lhs)}=${this.format(root.rhs)}`
  }

  subscript(root: SubscriptNode): string {
    if (root.subscript.type === 'variable' && (root.subscript.value as string).length === 1) {
      return `${this.format(root.base)}_${this.format(root.subscript)}`
    }

    return `${this.format(root.base)}_{${this.format(root.subscript)}}`
  }

  uni_operator(root: UniOperNode): string {
    if (root.operator === 'minus') {
      return `-${this.format(root.value as AST)}`
    }

    return this.format(root.value as AST)
  }
}
