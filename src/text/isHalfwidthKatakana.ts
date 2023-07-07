export function isHalfwidthKatakana(value: string | null | undefined) {
  if (!value) {
    return false
  }

  return /^[ \uFF66-\uFF9F]+$/.test(value)
}
