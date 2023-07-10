import {
  parse,
  parseISO,
  isValid,
} from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
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

  const dfOptions: Record<string, any> = {}
  if (options?.locale && /^ja(-|$)/i.test(options.locale)) {
    dfOptions.locale = ja
  }

  try {
    let tmp = format ? parse(str, format, new Date(), dfOptions) : parseISO(str)
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
