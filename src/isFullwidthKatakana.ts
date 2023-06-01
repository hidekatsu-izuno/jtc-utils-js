export function isFullwidthKatakana(value: any, options?: {
  linebreak?: boolean,
  space?: boolean,
  punct?: boolean,
}) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\r\n\u3000\u30FB\u30FC\u30A1-\u30FA]+$/.test(value)
  if (result) {
    if (options?.linebreak === false && /[\r\n]/.test(value)) {
      return false
    }
    if (options?.punct === false && /[\u30A0\u30FB]/u.test(value)) {
      return false
    }
    if (options?.space === false && /[\u3000]/u.test(value)) {
      return false
    }
  }
  return result
}
