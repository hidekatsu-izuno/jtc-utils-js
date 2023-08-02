import {
  parse,
  parseISO,
  isValid,
} from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { Locale, ja, enUS } from "./locale/index.ts"
import { getLocale } from "./util/getLocale.ts"
import { getTimeZone } from "./util/getTimeZone.ts"
import { JapaneseEra } from "./JapaneseEra.ts"

declare type ParseDateOptions = {
  locale?: Locale,
  timeZone?: string,
}

export function parseDate(str: string, format?: string, options?: ParseDateOptions): Date;
export function parseDate(str: null | undefined, format?: string, options?: ParseDateOptions): undefined;
export function parseDate(str: string | null | undefined, format?: string, options?: ParseDateOptions) {
  if (str == null) {
    return undefined
  }

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS)
  const timeZone = options?.timeZone

  try {
    let tmp
    if (!format) {
      tmp = parseISO(str)
    } else {
      const parseOptions: Parameters<typeof parse>[3] = { locale }
      let era: JapaneseEra | undefined
      if (locale.code && /^ja-JP-u-ca-japanese$/i.test(locale.code)) {
        parseOptions.locale = <Locale> {
          ...locale,
          match: {
            ...locale.match,
            era(dateString: string, options: Record<any, any>) {
              let m
              if ((m = /^([MTSHR]|明治?|大正?|昭和?|平成?|令和?)/.exec(dateString)) != null) {
                era = JapaneseEra.from(m[0], { locale: "ja" })
                return {
                  value: 1,
                  rest: dateString.substring(m[0].length),
                }
              } else {
                return locale.match?.era(dateString, options)
              }
            }
          }
        }
      }
      tmp = parse(str, format, new Date(), parseOptions)
      if (era) {
        tmp.setFullYear(tmp.getFullYear() + era.start.getFullYear() - 1)
      }
    }
    if (isValid(tmp)) {
      if (timeZone && timeZone !== getTimeZone() && !/[+-]/.test(str)) {
        tmp = utcToZonedTime(tmp, timeZone)
      }
      return tmp
    }
    return null
  } catch (err) {
    if (err instanceof RangeError) {
      return null
    } else {
      throw err
    }
  }
}
