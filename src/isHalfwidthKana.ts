import { CharRangeOptions } from "./CharRangeOption.js"

export default function isHalfwidthKana(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\t\r\n\x20-\x7E\uFF61-\uFF9F]+$/.test(value)
  if (result) {
    // Default excludes
    if (options?.linebreak !== true && /[\r\n]/.test(value)) {
      return false
    }

    // Default includes
    if (options?.punct === false && /[!-/:-@[-`{-~\uFF61-\uFF65]/u.test(value)) {
      return false
    }
    if (options?.space === false && /[\t\x20]/.test(value)) {
      return false
    }
  }
  return result
}
