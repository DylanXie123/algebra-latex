import Token, { ValToken } from "./Token";
/**
 * An abstract class shared between lexers
 */
export default abstract class Lexer {
    text: string;
    pos: number;
    col: number;
    line: number;
    prev_col: number;
    prev_line: number;
    constructor(text: string);
    increment(amount?: number): void;
    error(message: string): Error;
    current_char(): string;
    eat(char: string): void;
    number(): ValToken;
    abstract next_token(): Token;
}
