import { NumberFormat } from "./NumberFormat.js"

export function parseNumber(str: string, format?: string, locale?: string): number;
export function parseNumber(str: null | undefined, format?: string, locale?: string): undefined;
export function parseNumber(str: string | null | undefined, format?: string, locale?: string) {
  if (str == null) {
    return undefined
  }

  let num
  if (format) {
    num = NumberFormat.get(format, locale).parse(str)
  } else {
    num = Number.parseFloat(str.replace(/^[^0-9,-]+/g, ""))
  }

  return Number.isFinite(num) ? num : undefined
}
