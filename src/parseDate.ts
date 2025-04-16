import { isValid, parse, parseISO } from "date-fns";
import { JapaneseEra } from "./JapaneseEra.ts";
import { type Locale, enUS, ja } from "./locale/index.ts";
import { DateFormat } from "./util/DateFormat.ts";
import { getLocale } from "./util/getLocale.ts";
import { getTimeZone } from "./util/getTimeZone.ts";
import { getTimeZoneOffset } from "./util/getTimeZoneOffset.ts";

declare type ParseDateOptions = {
  locale?: Locale;
  timeZone?: string;
};

export function parseDate(
  str: string,
  format?: string,
  options?: ParseDateOptions,
): Date;
export function parseDate(
  str: null | undefined,
  format?: string,
  options?: ParseDateOptions,
): undefined;
export function parseDate(
  str: string | null | undefined,
  format?: string,
  options?: ParseDateOptions,
) {
  if (str == null) {
    return undefined;
  }

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS);
  const timeZone = options?.timeZone;

  try {
    let dDate: Date;
    if (!format) {
      dDate = parseISO(str);
      if (!isValid(dDate)) {
        return null;
      }

      if (
        timeZone &&
        timeZone !== getTimeZone() &&
        !/(Z|[+-][0-9]{2}(:?[0-9]{2})?)$/.test(str)
      ) {
        dDate = new Date(dDate.getTime() + getTimeZoneOffset(dDate, timeZone));
      }
    } else {
      const parseOptions: Parameters<typeof parse>[3] = { locale };
      let era: JapaneseEra | undefined;
      if (locale.code && /^ja-JP-u-ca-japanese$/i.test(locale.code)) {
        parseOptions.locale = {
          ...locale,
          match: {
            ...locale.match,
            era(dateString: string, options: Record<string, unknown>) {
              let m: RegExpExecArray | null;
              if (
                (m = /^([MTSHR]|明治?|大正?|昭和?|平成?|令和?)/.exec(
                  dateString,
                )) != null
              ) {
                era = JapaneseEra.from(m[0], { locale: "ja" });
                return {
                  value: 1,
                  rest: dateString.substring(m[0].length),
                };
              } else {
                return locale.match?.era(dateString, options);
              }
            },
          },
        } as Locale;
      }
      dDate = parse(str, format, new Date(), parseOptions);
      if (!isValid(dDate)) {
        return null;
      }

      if (era) {
        dDate.setFullYear(dDate.getFullYear() + era.start.getFullYear() - 1);
      }

      if (
        timeZone &&
        timeZone !== getTimeZone() &&
        !DateFormat.get(format).parts.some(
          (part) => part.type === "pattern" && /^[xX]/.test(part.text),
        )
      ) {
        dDate = new Date(dDate.getTime() + getTimeZoneOffset(dDate, timeZone));
      }
    }
    return dDate;
  } catch (err) {
    if (err instanceof RangeError) {
      return null;
    } else {
      throw err;
    }
  }
}
