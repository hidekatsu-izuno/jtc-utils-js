import { enUS, ja, type Locale } from "./locale/index.ts";
import { toHalfwidthAscii } from "./toHalfwidthAscii.ts";
import { getLocale } from "./util/getLocale.ts";
import { NumberFormat } from "./util/NumberFormat.ts";

declare type ParseNumberOptions = {
  locale?: Locale;
};

export function parseNumber(
  str: string,
  format?: string,
  options?: ParseNumberOptions,
): number;
export function parseNumber(
  str: null | undefined,
  format?: string,
  options?: ParseNumberOptions,
): undefined;
export function parseNumber(
  str: string | null | undefined,
  format?: string,
  options?: ParseNumberOptions,
) {
  if (str == null) {
    return undefined;
  }

  let num: number;
  if (format) {
    const locale =
      options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS);
    num = NumberFormat.get(format, locale.code).parse(str);
  } else {
    num = Number.parseFloat(toHalfwidthAscii(str.replace(/[^0-9.-]+/g, "")));
  }

  return Number.isFinite(num) ? num : undefined;
}
