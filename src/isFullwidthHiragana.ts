export function isFullwidthHiragana(value: any) {
  if (value == null || typeof value !== "string") {
    return false
  }

  return /^[\u3000\u3041-\u3094\u30FC]*$/.test(value)
}
