import {
  parseISO,
  isValid,
} from "date-fns"
import { utcToZonedTime, format as _format, formatInTimeZone } from "date-fns-tz"

const current = Intl.DateTimeFormat().resolvedOptions().timeZone

export function formatDate(date: Date | number | string | null | undefined, format: string, timeZone?: string) {
  if (!date) {
    return ""
  }

  if (date instanceof Date) {
    if (timeZone && timeZone !== current) {
      date = utcToZonedTime(date, timeZone)
    }
  } else if (typeof date === "number") {
    if (timeZone && timeZone !== current) {
      date = utcToZonedTime(new Date(date), timeZone)
    }
  } else if (typeof date === "string") {
    try {
      const tmp = parseISO(date)
      if (isValid(tmp)) {
        if (timeZone && timeZone !== current && !/[+-]/.test(date)) {
          date = utcToZonedTime(tmp, timeZone)
        } else {
          date = tmp
        }
      } else {
        return date as string
      }
    } catch (err) {
      return date as string
    }
  }

  try {
    if (timeZone && timeZone !== current) {
      return formatInTimeZone(date, timeZone, format)
    } else {
      return _format(date, format)
    }
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString()
    } else {
      throw err
    }
  }
}
