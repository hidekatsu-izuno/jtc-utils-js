export default function isZenginKana(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[\x200-9A-Z()/.\\\uFF62\uFF63\uFF71-\uFF9F-]+$/.test(value)
}
