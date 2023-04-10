import NumberFormat from "./NumberFormat.js"

export default function parseNumber(str: string | null | undefined, format?: string) {
  if (!str) {
    return null
  }

  if (format) {
    const dformat = NumberFormat.get(format)
    if (dformat.positive.prefix.length + dformat.positive.suffix.length < str.length
      && str.startsWith(dformat.positive.prefix)
      && str.endsWith(dformat.positive.suffix)) {
        // skip
    } else if (dformat.negative.prefix.length + dformat.negative.suffix.length < str.length
      && str.startsWith(dformat.negative.prefix)
      && str.endsWith(dformat.negative.suffix)) {
      str = "-" + str.substring(dformat.negative.prefix.length, str.length - dformat.negative.suffix.length)
    }
  }

  const num = Number.parseFloat(str.replace(/^[^0-9-]+/, "").replaceAll(",", ""))
  return Number.isFinite(num) ? num : null
}
