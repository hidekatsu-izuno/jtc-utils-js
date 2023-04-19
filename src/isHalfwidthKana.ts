import { CharRangeOptions } from "./CharRangeOption.js"

export default function isHalfwidthKana(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\u0000-\u007F\uFF61-\uFF9F]+$/.test(value)
  if (result && options) {
    if (options.space === false && / /.test(value)) {
      return false
    }
  }
  return result
}
