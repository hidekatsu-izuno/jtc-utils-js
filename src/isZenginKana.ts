export function isZenginKana(value: string | null | undefined) {
  if (!value) {
    return false
  }

  return /^[\x200-9A-Z()/.\\\uFF62\uFF63\uFF71-\uFF9F-]+$/.test(value)
}
