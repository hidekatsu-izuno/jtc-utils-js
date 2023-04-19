import { CharRangeOptions } from "./CharRangeOption.js"

export default function isUsAscii(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\u0000-\u007F]+$/.test(value)
  if (result && options) {
    if (options.control === false && /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
      return false
    }
    if (options.tab === false && /\t/.test(value)) {
      return false
    }
    if (options.linebreak === false && /[\r\n]/.test(value)) {
      return false
    }
    if (options.space === false && / /.test(value)) {
      return false
    }
  }
  return result
}
