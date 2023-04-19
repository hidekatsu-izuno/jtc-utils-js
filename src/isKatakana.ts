import { CharRangeOptions } from "./CharRangeOption.js"

export default function isKatakana(value: any, options?: CharRangeOptions) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\u3000\u30FB\u30FC\u30A1-\u30FA]+$/.test(value)
  if (result && options) {
    if (options.space === false && /\p{Zs}/u.test(value)) {
      return false
    }
  }
  return result
}
