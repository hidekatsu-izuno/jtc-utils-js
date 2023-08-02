import { NumberFormat } from "./util/NumberFormat.ts"
import { ja, enUS, Locale } from "./locale/index.ts"
import { getLocale } from "./util/getLocale.ts"

declare type ParseNumberOptions = {
  locale?: Locale,
}

export function parseNumber(str: string, format?: string, options?: ParseNumberOptions): number;
export function parseNumber(str: null | undefined, format?: string, options?: ParseNumberOptions): undefined;
export function parseNumber(str: string | null | undefined, format?: string, options?: ParseNumberOptions) {
  if (str == null) {
    return undefined
  }

  let num
  if (format) {
    const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS)
    num = NumberFormat.get(format, locale.code).parse(str)
  } else {
    num = Number.parseFloat(str.replace(/[^0-9.-]+/g, ""))
  }

  return Number.isFinite(num) ? num : undefined
}
