export function isHalfwidthKatakana(value: any) {
  if (value == null || typeof value !== "string") {
    return false
  }

  return /^[ \uFF66-\uFF9F]+$/.test(value)
}
