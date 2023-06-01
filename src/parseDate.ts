import {
  parse,
  parseISO,
  isValid,
} from "date-fns"
import { utcToZonedTime } from "date-fns-tz"

const current = Intl.DateTimeFormat().resolvedOptions().timeZone

export function parseDate(str: string | null | undefined, format?: string, timeZone?: string) {
  if (!str) {
    return null
  }

  try {
    if (format) {
      let tmp = parse(str, format, new Date())
      if (isValid(tmp)) {
        if (timeZone && timeZone !== current && !/[Xx]/.test(format)) {
          tmp = utcToZonedTime(tmp, timeZone)
        }
        return tmp
      } else {
        return null
      }
    } else {
      let tmp = parseISO(str)
      if (isValid(tmp)) {
        if (timeZone && timeZone !== current && !/[+-]/.test(str)) {
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
