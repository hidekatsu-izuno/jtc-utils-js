import { CharRangeOptions } from "./CharRangeOption.js"

export default function isUnicode(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[^\uD800-\uDFFF\p{Cn}]+$/u.test(value)
  if (result && options) {
    if (options.control === false && /[\p{Cc}\p{Cf}]/u.test(value)) {
      return false
    }
    if (options.tab === false && /\t/.test(value)) {
      return false
    }
    if (options.linebreak === false && /[\r\n]/.test(value)) {
      return false
    }
    if (options.space === false && /\p{Zs}/u.test(value)) {
      return false
    }
    if (options.privateUse === false && /\p{Co}/u.test(value)) {
      return false
    }
    if (options.supplementary === false && /\p{Cs}/u.test(value)) {
      return false
    }
  }
  return result
}
