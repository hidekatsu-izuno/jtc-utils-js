export function isFullwidthKatakana(value: any) {
  if (value == null || typeof value !== "string") {
    return false
  }

  return /^[\u3000\u30A0-\u30FA\u30FC]+$/.test(value)
}
