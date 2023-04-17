export default function isHiragana(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[\u3000\u30FB\u30FC\u3041-\u3094]+$/.test(value)
}
