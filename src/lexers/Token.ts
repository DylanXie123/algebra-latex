export type TokenType = "EOF" | "bracket" | "operator" | "equal" | "underscore" | "keyword" | "variable" | "number" | "function" | "equation" | "subscript" | "uni-operator";

export default interface Token {
  type: TokenType,
  open?: boolean,
  value?: string | number,
}