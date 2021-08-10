import assert from 'assert'
import AlgebraLatex from './src'
import LatexLexer from './src/lexers/LexerLatex'
import Parser from './src/Parser'

describe('latex parser', () => {

  it('parse simple expression', () => {
    const a = new AlgebraLatex();
    a.parseLatex('')
    assert.equal(a.toMath(), '')
  })

})
