import { CharRangeOptions } from "./CharRangeOption.js"

export function isFullwidthKatakana(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\r\n\u3000\u30FB\u30FC\u30A1-\u30FA]+$/.test(value)
  if (result) {
    // Default excludes
    if (options?.linebreak !== true && /[\r\n]/.test(value)) {
      return false
    }

    // Default includes
    if (options?.punct === false && /[\u30FB]/u.test(value)) {
      return false
    }
    if (options?.space === false && /[\u3000]/u.test(value)) {
      return false
    }
  }
  return result
}
