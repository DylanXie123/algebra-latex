export declare type OperatorType = "plus" | "minus" | "multiply" | "divide" | "exponent" | "modulus";
export default AST;
declare type AST = BinaryNode | UniNode | ValueNode;
export declare type BinaryNode = OperatorNode | EquationNode;
export interface OperatorNode {
    type: "operator";
    operator: OperatorType;
    lhs: AST;
    rhs: AST;
}
export interface EquationNode {
    type: "equation";
    lhs: AST;
    rhs: AST;
}
export declare type UniNode = UniOperNode | FunctionNode | SubscriptNode;
export interface FunctionNode {
    type: "function";
    value: string;
    content: AST;
}
export interface SubscriptNode {
    type: "subscript";
    base: AST;
    subscript: AST;
}
export interface UniOperNode {
    type: "uni-operator";
    operator: "minus" | "plus";
    value: AST;
}
export declare type ValueNode = NumberNode | VariableNode;
export interface NumberNode {
    type: "number";
    value: number;
}
export interface VariableNode {
    type: "variable";
    value: string;
}