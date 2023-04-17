export default function toZenginKana(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return value.replace(/[\x200-9A-Z()/.\\\uFF62\uFF63\uFF71-\uFF9F-]/g, c => toZenginKanaChar(c))
}

function toZenginKanaChar(n: string) {

  return ""
}
