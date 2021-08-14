import assert from 'assert'
import nerdamer from 'nerdamer'
import AST from '../../src/formatters/AST'
import NerdamerFormatter from '../../src/formatters/FormatterNerdamer'

describe('formatter latex', () => {
  let getExp = (ast: AST) => {
    let formatter = new NerdamerFormatter(ast)
    return formatter.getExpression()
  }

  it('operator plus', () => {
    const ast: AST = {
      type: 'operator',
      operator: 'plus',
      lhs: {
        type: 'number',
        value: 1,
      },
      rhs: {
        type: 'number',
        value: 3,
      },
    }
    assert.deepEqual(getExp(ast), nerdamer('1+3'))
  })

  it('operator minus', () => {
    const ast: AST = {
      type: 'operator',
      operator: 'minus',
      lhs: {
        type: 'number',
        value: 1,
      },
      rhs: {
        type: 'number',
        value: 3,
      },
    }
    assert.deepEqual(getExp(ast), nerdamer('1-3'))
  })

  it('operator multiply', () => {
    const ast: AST = {
      type: 'operator',
      operator: 'multiply',
      lhs: {
        type: 'number',
        value: 1,
      },
      rhs: {
        type: 'number',
        value: 3,
      },
    }
    assert.deepEqual(getExp(ast), nerdamer('1*3'))
  })

  it('operator divide', () => {
    const ast: AST = {
      type: 'operator',
      operator: 'divide',
      lhs: {
        type: 'number',
        value: 1,
      },
      rhs: {
        type: 'number',
        value: 3,
      },
    }
    assert.deepEqual(getExp(ast), nerdamer('1/3'))
  })

  it('operator modulus', () => {
    const ast: AST = {
      type: 'operator',
      operator: 'modulus',
      lhs: {
        type: 'number',
        value: 1,
      },
      rhs: {
        type: 'number',
        value: 3,
      },
    }
    assert.deepEqual(getExp(ast), nerdamer('1%3'))
  })

  it('operator exponent', () => {
    const ast: AST = {
      type: 'operator',
      operator: 'exponent',
      lhs: {
        type: 'number',
        value: 1,
      },
      rhs: {
        type: 'number',
        value: 3,
      },
    }
    assert.deepEqual(getExp(ast), nerdamer('1^3'))
  })

  it('number', () => {
    const ast: AST = {
      type: 'number',
      value: 2,
    }
    assert.deepEqual(getExp(ast), nerdamer('2'))
  })

  it('function', () => {
    const ast: AST = {
      type: 'function',
      value: 'sin',
      content: {
        type: 'number',
        value: 2,
      },
    }
    assert.deepEqual(getExp(ast), nerdamer('sin(2)'))
  })

  it('variable', () => {
    const ast: AST = {
      type: 'variable',
      value: 'y',
    }
    assert.deepEqual(getExp(ast), nerdamer('y'))
  })

  it('equation', () => {
    const ast: AST = {
      type: 'equation',
      lhs: {
        type: 'variable',
        value: 'y',
      },
      rhs: {
        type: 'number',
        value: 2,
      }
    }
    assert.deepEqual(getExp(ast), nerdamer('y=2'))
  })

  it('uni-operator', () => {
    const ast: AST = {
      type: 'number',
      value: -2,
    }
    assert.deepEqual(getExp(ast), nerdamer('-2'))
  })

})
