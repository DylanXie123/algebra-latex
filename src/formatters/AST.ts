export default interface AST {
  type: string,
  operator?: string,
  lhs?: AST,
  rhs?: AST,
  content?: AST,
  base?: AST,
  subscript?: AST,
  value?: number | string | AST,
}