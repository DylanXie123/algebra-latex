import Parser from './Parser';
import AST from './formatters/AST';
/**
 * A class for parsing latex math
 */
declare class AlgebraLatex {
    options: {};
    input: string;
    parser: Parser;
    /**
     * Create an AlgebraLatex object, to be converted
     * The latex paremeter was removed as of v2.0, use parseLatex()
     * @param options the options to provide to the library
     * @return {AlgebraLatex} object to be converted
     */
    constructor(options?: {});
    parseLatex(latex: string): this;
    parseMath(math: string): this;
    getAst(): "" | AST;
    /**
     * Will return a serialized string eg. 2*(3+4)/(sqrt(5))-8
     * @return string The serialized string
     */
    toMath(): string;
    /**
     * Will return a formatted latex string eg. \frac{1}{\sqrt{2}}
     * @return string The formatted latex string
     */
    toLatex(): string;
    /**
     * Will return a nerdamer object
     * @return nerdamer object
     */
    toNerdamer(): any;
    /**
     * Wether or not the object is an equation or an expression
     * @return Boolean true if expression
     */
    isEquation(): boolean;
}
export default AlgebraLatex;
