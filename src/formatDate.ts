import {
  parseISO,
  isValid,
  format as _format,
} from "date-fns"
import { getTimeZoneOffset } from "./util/getTimeZoneOffset.ts"
import { getTimeZone } from "./util/getTimeZone.ts"
import { JapaneseEra } from "./JapaneseEra.ts"
import { DateFormat } from "./util/DateFormat.ts"
import { Locale, ja, enUS } from "./locale/index.ts"
import { getLocale } from "./util/getLocale.ts"

declare type FormatDateOptions = {
  locale?: Locale,
  timeZone?: string,
}

export function formatDate(date: Date | number | string | null | undefined, format: string, options?: FormatDateOptions) {
  const timeZone = options?.timeZone

  let dDate
  if (!date) {
    return ""
  } else if (typeof date === "number") {
    dDate = new Date(date)
  } else if (date instanceof Date) {
    if (timeZone && timeZone !== getTimeZone()) {
      dDate = new Date(date.getTime() - getTimeZoneOffset(date, timeZone))
    } else {
      dDate = date
    }
  } else {
    const sDate = date.toString()
    dDate = parseISO(sDate)
    if (!isValid(dDate)) {
      return sDate
    }

    if (timeZone && timeZone !== getTimeZone()) {
      dDate = new Date(dDate.getTime() - getTimeZoneOffset(dDate, timeZone))
    }
  }

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS)
  if (locale.code && /^ja-JP-u-ca-japanese$/i.test(locale.code)) {
    const era = JapaneseEra.of(dDate)
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
            const gYear = dDate.getFullYear() - era.start.getFullYear() + 1
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
    return _format(dDate, format, { locale })
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString()
    } else {
      throw err
    }
  }
}
