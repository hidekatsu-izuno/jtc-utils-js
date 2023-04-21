import { CharRangeOptions } from "./CharRangeOption.js"

export function isZenginKana(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\r\n\x200-9A-Z()/.\\\uFF62\uFF63\uFF71-\uFF9F-]+$/.test(value)
  if (result) {
    // Default excludes
    if (options?.linebreak !== true && /[\r\n]/.test(value)) {
      return false
    }

    // Default includes
    if (options?.punct === false && /[!-/:-@[-`{-~\uFF61-\uFF65]/u.test(value)) {
      return false
    }
    if (options?.space === false && /[\x20]/.test(value)) {
      return false
    }
  }
  return result
}
