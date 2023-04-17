export default function isJapaneseHalfwidth(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[\x20-\x7F\uFF61-\uFF9F]+$/.test(value)
}
