import { CharRangeOptions } from "./CharRangeOption.js"

export function isSafeUnicode(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[^\p{Cn}\p{Cc}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF&&[\t\r\n]]+$/u.test(value)
  if (result) {
    // Default excludes
    if (options?.linebreak !== true && /[\r\n]/.test(value)) {
      return false
    }
    if (options?.privateUse !== true && /\p{Co}/u.test(value)) {
      return false
    }
    if (options?.variation !== true && /[\uFE00-\uFE0F\u{E0100}-\u{E01EF}]/u.test(value)) {
      return false
    }

    // Default includes
    if (options?.punct === false && /[\p{P}\p{S}]/u.test(value)) {
      return false
    }
    if (options?.space === false && /[\t\p{Zs}]/u.test(value)) {
      return false
    }
    if (options?.supplementary === false && /\p{Cs}/u.test(value)) {
      return false
    }
  }
  return result
}
