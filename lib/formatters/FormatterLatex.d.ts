import AST, { EquationNode, FunctionNode, NumberNode, OperatorNode, SubscriptNode, UniOperNode, VariableNode } from './AST';
export default class LatexFormatter {
    ast: AST;
    constructor(ast: AST);
    format(root?: AST): string;
    operator(root: OperatorNode): string;
    fragment(root: OperatorNode): string;
    number(root: NumberNode): string;
    function(root: FunctionNode): string;
    variable(root: VariableNode): string;
    equation(root: EquationNode): string;
    subscript(root: SubscriptNode): string;
    uni_operator(root: UniOperNode): string;
}
