export type TokenType = Pick<NoValToken, "type"> | Pick<ValToken, "type"> | Pick<BracketToken, "type">;

export default Token

export type Token = BracketToken | NoValToken | ValToken;

export interface BracketToken {
  type: "bracket",
  open: boolean,
  value: string,
}

export interface NoValToken {
  type: "EOF" | "equal" | "underscore",
}

export interface ValToken {
  type: "operator" | "keyword" | "variable" | "number";
  value: string | number,
}