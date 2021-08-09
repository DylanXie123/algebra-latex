import { TokenType } from "../lexers/Token";

export type operatorType = "plus" | "minus" | "multiply" | "divide" | "exponent" | "modulus"

export default interface AST {
  type: TokenType,
  operator?: operatorType,
  lhs?: AST,
  rhs?: AST,
  content?: AST,
  base?: AST,
  subscript?: AST,
  value?: number | string | AST,
}