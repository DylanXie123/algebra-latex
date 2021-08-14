import AST, { EquationNode, FunctionNode, NumberNode, OperatorNode, UniOperNode, VariableNode } from './AST';
import nerdamer from 'nerdamer';
export default class NerdamerFormatter {
    ast: AST;
    private parser;
    private Symbol;
    constructor(ast: AST);
    getExpression(): nerdamer.Expression;
    format(root?: AST): any;
    operator(root: OperatorNode): any;
    number(root: NumberNode): any;
    function(root: FunctionNode): any;
    variable(root: VariableNode): any;
    equation(root: EquationNode): any;
    subscript(): never;
    uni_operator(root: UniOperNode): any;
}
