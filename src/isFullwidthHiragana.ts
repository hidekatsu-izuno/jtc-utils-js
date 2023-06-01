export function isFullwidthHiragana(value: any, options?: {
  linebreak?: boolean,
  space?: boolean,
  punct?: boolean,
}) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\r\n\u3000\u30A0\u30FB\u30FC\u3041-\u3094]+$/.test(value)
  if (result && options) {
    if (options.linebreak === false && /[\r\n]/.test(value)) {
      return false
    }
    if (options.punct === false && /[\u30A0\u30FB]/u.test(value)) {
      return false
    }
    if (options.space === false && /[\u3000]/u.test(value)) {
      return false
    }
  }
  return result
}
