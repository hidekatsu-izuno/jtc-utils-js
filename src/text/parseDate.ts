import {
  parse,
  parseISO,
  isValid,
} from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { getTimeZone } from "../getTimeZone.js"

export function parseDate(str: string, format?: string, timeZone?: string): Date;
export function parseDate(str: null | undefined, format?: string, timeZone?: string): undefined;
export function parseDate(str: string | null | undefined, format?: string, timeZone?: string) {
  if (str == null) {
    return undefined
  }

  try {
    if (format) {
      let tmp = parse(str, format, new Date())
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
