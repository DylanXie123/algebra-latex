import Token from "./lexers/Token"

let stackLevelRef: number | null = null

export const debug = (...msg: (string | Token)[]) => {
  if (typeof process === 'object') {
    if (process.env.TEX_DEBUG) {
      let stackLevel = new Error().stack!.split('\n').length
      if (stackLevelRef === null) {
        stackLevelRef = stackLevel
      }
      stackLevel -= stackLevelRef

      let stackSpacing = ''

      for (let i = 0; i < stackLevel; i++) {
        stackSpacing += '-'
      }

      console.log(stackSpacing, ...msg)
    }
  }
}
