import {
  parseISO,
  isValid,
  format as _format,
} from "date-fns"
import { utcToZonedTime, formatInTimeZone } from "date-fns-tz"
import { getTimeZone } from "../util/getTimeZone.js"

export function formatDate(date: Date | number | string | null | undefined, format: string, timeZone?: string) {
  if (!date) {
    return ""
  }

  if (date instanceof Date) {
    if (timeZone && timeZone !== getTimeZone()) {
      date = utcToZonedTime(date, timeZone)
    }
  } else if (typeof date === "number") {
    if (timeZone && timeZone !== getTimeZone()) {
      date = utcToZonedTime(new Date(date), timeZone)
    }
  } else if (typeof date === "string") {
    try {
      const tmp = parseISO(date)
      if (isValid(tmp)) {
        if (timeZone && timeZone !== getTimeZone() && !/[+-]/.test(date)) {
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
    if (timeZone && timeZone !== getTimeZone()) {
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
