export default function isZenginKana(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[ 0-9A-Zｱ-ﾝﾞﾟ()｢｣/.\\-]+$/.test(value)
}
