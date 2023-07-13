import {
  parseISO,
  isValid,
  format as _format,
} from "date-fns"
import { utcToZonedTime, formatInTimeZone, OptionsWithTZ } from "date-fns-tz"
import { getTimeZone } from "./util/getTimeZone.js"
import { JapaneseEra } from "./JapaneseEra.js"
import { DateFormat } from "./util/DateFormat.js"
import { Locale, ja, enUS } from "./locale/index.js"
import { getLocale } from "./util/getLocale.js"

declare type FormatDateOptions = {
  locale?: Locale,
  timeZone?: string,
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

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS)
  if (locale.code && /^ja-JP-u-ca-japanese$/i.test(locale.code)) {
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
              parts[i] = { type: "quoted", text: `'${era.toLocaleString(locale.code, { style: "short" })}'` }
            } else if (part.text.length === 4) {
              parts[i] = { type: "quoted", text: `'${era.toLocaleString(locale.code, { style: "long" })}'` }
            } else {
              parts[i] = { type: "quoted", text: `'${era.toLocaleString(locale.code, { style: "narrow" })}'` }
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
    const formatOptions = { locale: locale as any }
    if (timeZone && timeZone !== getTimeZone()) {
      return formatInTimeZone(date, timeZone, format, { locale })
    } else {
      return _format(date, format, { locale })
    }
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString()
    } else {
      throw err
    }
  }
}
