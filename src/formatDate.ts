import {
  parseISO,
  isValid,
  format as _format,
} from "date-fns"
import ja from "date-fns/locale/ja"
import { utcToZonedTime, formatInTimeZone, OptionsWithTZ } from "date-fns-tz"
import { getTimeZone } from "./getTimeZone.js"
import { JapaneseEra } from "./JapaneseEra.js"
import { DateFormat } from "./util/DateFormat.js"

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
  let calendar = options?.calendar
  if (options?.locale && /^ja(-|$)/i.test(options.locale)) {
    dfOptions.locale = ja
    if (/^ja-jp-u-ca-japanese$/i.test(options.locale)) {
      calendar = "japanese"
    }
  }

  if (calendar === "japanese") {
    const target = date
    const era = JapaneseEra.of(target)
    if (era) {
      const dFormat = DateFormat.get(format)
      const parts = [...dFormat.parts]
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (part.type === "pattern") {
          if (part.text.startsWith("G")) {
            if (part.text.length <= 3) {
              parts[i] = { type: "quoted", text: `'${era.toLocaleString(options?.locale, { style: "short" })}'` }
            } else if (part.text.length === 4) {
              parts[i] = { type: "quoted", text: `'${era.toLocaleString(options?.locale, { style: "long" })}'` }
            } else {
              parts[i] = { type: "quoted", text: `'${era.toLocaleString(options?.locale, { style: "narrow" })}'` }
            }
          } else if (part.text.startsWith("y")) {
            const gYear = target.getFullYear() - era.start.getFullYear() + 1
            if (part.text.length === 1) {
              parts[i] = { type: "quoted", text:  `'${gYear}'` }
            } else if (part.text.endsWith("o")) {
              parts[i] = { type: "quoted", text:  `'${gYear}年'` }
            } else {
              parts[i] = { type: "quoted", text:  `'${"0".repeat(part.text.length - gYear.toString().length)}${gYear}'` }
            }
          }
        }
      }
      format = new DateFormat(parts).toString()
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
