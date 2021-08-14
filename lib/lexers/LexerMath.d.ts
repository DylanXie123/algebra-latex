import Lexer from './Lexer';
import Token from './Token';
export default class LatexLexer extends Lexer {
    constructor(mathString: string);
    next_token(): Token;
    alphabetic(): Token;
}
