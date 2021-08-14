import Lexer from './Lexer';
import Token, { ValToken } from './Token';
export default class LatexLexer extends Lexer {
    constructor(latex: string);
    next_token(): Token;
    keyword(): Token;
    variable(): ValToken;
}
