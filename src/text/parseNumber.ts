import { NumberFormat } from "./NumberFormat.js"

declare type ParseNumberOptions = {
  locale?: string,
}

export function parseNumber(str: string, format?: string, options?: ParseNumberOptions): number;
export function parseNumber(str: null | undefined, format?: string, options?: ParseNumberOptions): undefined;
export function parseNumber(str: string | null | undefined, format?: string, options?: ParseNumberOptions) {
  if (str == null) {
    return undefined
  }

  let num
  if (format) {
    num = NumberFormat.get(format, options?.locale).parse(str)
  } else {
    num = Number.parseFloat(str.replace(/^[^0-9.-]+/g, ""))
  }

  return Number.isFinite(num) ? num : undefined
}
