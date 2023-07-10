import {
  parse,
  parseISO,
  isValid,
} from "date-fns"
import { OptionsWithTZ, utcToZonedTime } from "date-fns-tz"
import ja from "date-fns/locale/ja"
import { getTimeZone } from "../getTimeZone.js"

declare type ParseDateOptions = {
  locale?: string,
  timeZone?: string,
}

export function parseDate(str: string, format?: string, options?: ParseDateOptions): Date;
export function parseDate(str: null | undefined, format?: string, options?: ParseDateOptions): undefined;
export function parseDate(str: string | null | undefined, format?: string, options?: ParseDateOptions) {
  if (str == null) {
    return undefined
  }

  const timeZone = options?.timeZone

  const dfOptions: OptionsWithTZ = {}
  if (options?.locale === "ja") {
    dfOptions.locale = ja
  }

  try {
    if (format) {
      let tmp = parse(str, format, new Date(), dfOptions)
      if (isValid(tmp)) {
        if (timeZone && timeZone !== getTimeZone() && !/[Xx]/.test(format)) {
          tmp = utcToZonedTime(tmp, timeZone)
        }
        return tmp
      } else {
        return null
      }
    } else {
      let tmp = parseISO(str)
      if (isValid(tmp)) {
        if (timeZone && timeZone !== getTimeZone() && !/[+-]/.test(str)) {
          tmp = utcToZonedTime(tmp, timeZone)
        }
        return tmp
      } else {
        return null
      }
    }
  } catch (err) {
    if (err instanceof RangeError) {
      return null
    } else {
      throw err
    }
  }
}
