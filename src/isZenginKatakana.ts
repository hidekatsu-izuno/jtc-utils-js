export function isZenginKatakana(value: any, options?: {
  linebreak?: boolean,
  space?: boolean,
  punct?: boolean,
}) {
  if (!value || typeof value !== "string") {
    return false
  }

  const result = /^[\r\n\x200-9A-Z()/.\\\uFF62\uFF63\uFF71-\uFF9F-]+$/.test(value)
  if (result) {
    if (options?.linebreak === false && /[\r\n]/.test(value)) {
      return false
    }
    if (options?.punct === false && /[!-/:-@[-`{-~\uFF61-\uFF65]/u.test(value)) {
      return false
    }
    if (options?.space === false && /[\x20]/.test(value)) {
      return false
    }
  }
  return result
}
