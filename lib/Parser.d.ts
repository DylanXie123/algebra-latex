import Lexer from './lexers/Lexer';
import AST, { NumberNode, UniOperNode } from './formatters/AST';
import Token from './lexers/Token';
export default class ParserLatex {
    lexer: Lexer;
    options: {};
    /**
     * @return `null`: parser error
     * @return '': empty input
     * @return `AST`: normal
     */
    ast: AST | null | '';
    current_token: Token | null;
    peek_token: Token | null;
    functions: string[];
    constructor(latex: string, Lexer: any, options?: any);
    parse(): "" | AST;
    /**
     * invoke this method to update `this.current_token`,
     * update `this.current_token` means that method is ready to handle
     * current token
     */
    next_token(): Token;
    /**
     * update `this.peek_token` if it's not null,
     * method usually use `this.peek_token` to see if it can handle next token,
     * if method can handle next token, it will invoke `this.next_token()` to
     * update current token and handle it
     */
    peek(): Token;
    error(message: string): never;
    /**
     * similar to `this.next_token()`, but it assert the type of
     * next token
     * @param  {string} token_type
     */
    eat(token_type: string): void;
    equation(): AST;
    expr(): AST;
    keyword(): AST;
    sqrt(): AST;
    fraction(): AST;
    function(): AST;
    group(): AST;
    operator(): AST;
    operator_multiply(): AST;
    operator_divide(): AST;
    operator_divide_prime(lhs: AST): AST;
    operator_mod(): AST;
    operator_exp(): AST;
    variable(): AST;
    subscript(): AST;
    number(): AST;
    uni_operator(): NumberNode | UniOperNode;
}
