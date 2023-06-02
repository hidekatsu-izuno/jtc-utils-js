import { NumberFormat } from "./NumberFormat.js"

export function parseNumber(str: string, format?: string): number;
export function parseNumber(str: null | undefined, format?: string): undefined;
export function parseNumber(str: string | null | undefined, format?: string) {
  if (str == null) {
    return undefined
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

  str = str.replace(/^[^0-9-]+/, "").replaceAll(",", "")

  const num = Number.parseFloat(str)
  return Number.isFinite(num) ? num : undefined
}
