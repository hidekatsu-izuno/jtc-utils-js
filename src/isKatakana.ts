export default function isKatakana(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[\u3000\u30FB\u30FC\u30A1-\u30FA]+$/.test(value)
}
