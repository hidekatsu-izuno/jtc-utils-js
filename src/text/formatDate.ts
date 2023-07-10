import {
  parseISO,
  isValid,
  format as _format,
} from "date-fns"
import ja from "date-fns/locale/ja"
import { utcToZonedTime, formatInTimeZone, OptionsWithTZ } from "date-fns-tz"
import { getTimeZone } from "../getTimeZone.js"

declare type FormatDateOptions = {
  locale?: string,
  timeZone?: string,
  calendar?: string,
}

export function formatDate(date: Date | number | string | null | undefined, format: string, options?: FormatDateOptions) {
  if (!date) {
    return ""
  }

  const timeZone = options?.timeZone

  if (typeof date === "number") {
    date = new Date(date)
  }

  if (date instanceof Date) {
    if (timeZone && timeZone !== getTimeZone()) {
      date = utcToZonedTime(date, timeZone)
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

  const dfOptions: OptionsWithTZ = {}
  if (options?.locale && /^ja(-|$)/.test(options.locale)) {
    dfOptions.locale = ja
  }

  if (options?.calendar === "japanese") {
    const era = getJapaneseEra(date)
    if (era) {
      format = format.replace(/(?:'(?:''|[^'])*')|(G+)|(y+o?)/g, (m, g1, g2) => {
        if (g1) {
          if (g1.length <= 3) {
            return `'${era.short}'`
          } else if (g1.length === 4) {
            return `'${era.long}'`
          } else {
            return `'${era.narrow}'`
          }
        } else if (g2) {
          if (g2.length === 1) {
            return `'${era.year}'`
          } else if (g2.endsWih("o")) {
            return `'${era.year}年'`
          } else {
            return `'${"0".repeat(g2.length - era.year.toString().length)}${era.year}'`
          }
        } else {
          return m
        }
      })
    }
  }

  try {
    if (timeZone && timeZone !== getTimeZone()) {
      return formatInTimeZone(date, timeZone, format, dfOptions)
    } else {
      return _format(date, format, dfOptions)
    }
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString()
    } else {
      throw err
    }
  }
}

const REIWA_START = parseISO("2019-04-30T15:00:00Z")
const HEISEI_START = parseISO("1989-01-07T15:00:00Z")
const SHOWA_START = parseISO("1926-12-25T15:00:00Z")
const TAISHO_START = parseISO("1912-07-29T15:00:00Z")
const MEIJI_START = parseISO("1868-10-22T15:00:00Z")

function getJapaneseEra(date: Date) {
  if (date >= REIWA_START) {
    return {
      long: "令和", short: "令", narrow: "R",
      year: date.getFullYear() - REIWA_START.getFullYear() + 1
    }
  } else if (date >= HEISEI_START) {
    return {
      long: "平成", short: "平", narrow: "H",
      year: date.getFullYear() - HEISEI_START.getFullYear() + 1
    }
  } else if (date >= SHOWA_START) {
    return {
      long: "昭和", short: "昭", narrow: "S",
      year: date.getFullYear() - SHOWA_START.getFullYear() + 1
    }
  } else if (date >= TAISHO_START) {
    return {
      long: "大正", short: "大", narrow: "T",
      year: date.getFullYear() - TAISHO_START.getFullYear() + 1
    }
  } else if (date >= MEIJI_START) {
    return {
      long: "明治", short: "明", narrow: "M",
      year: date.getFullYear() - MEIJI_START.getFullYear() + 1
    }
  }
}
