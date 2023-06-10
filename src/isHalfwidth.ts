export function isHalfwidth(value: any, options?: {
  linebreak?: boolean,
  space?: boolean,
  punct?: boolean,
  number?: boolean,
}) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\t\r\n\x20-\x7E\uFF61-\uFF9F]+$/.test(value)
  if (result && options) {
    if (options.linebreak === false && /[\r\n]/.test(value)) {
      return false
    }
    if (options.space === false && /[\t\x20]/.test(value)) {
      return false
    }
    if (options.punct === false && /[!-/:-@[-`{-~\uFF61-\uFF65]/u.test(value)) {
      return false
    }
    if (options.number === false && /[0-9]/.test(value)) {
      return false
    }
  }
  return result
}
