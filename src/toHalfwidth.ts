export default function toHalfwidth(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return value.replace(/[\u3000\u30A1-\u30A9\u30C3\u30F2\u30FB\u30FC\uFF01-\uFF60\uFFE0-\uFFE6]/g, toHalfwidthChar)
}

function toHalfwidthChar(c: string) {
  const n = c.charCodeAt(0)
  if (n === 0x3000) {
    return " "
  } else if (n >= 0x30A1 && n <= 0x30A1) {
    return String.fromCharCode(n-0x30A1+0xFF67)
  } else if (n === 0x30C3) {
    return "\uFF66"
  } else if (n === 0x30F2) {
    return "\uFF66"
  } else if (n === 0x30FB) {
    return "\uFF65"
  } else if (n === 0x30FC) {
    return "\uFF70"
  }
  return c
}
