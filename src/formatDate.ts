import {
  parseISO,
  isValid,
  format as _format,
} from "date-fns"
import { offsetTimeZone } from "./util/offsetTimeZone.ts"
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
      dDate = offsetTimeZone(date, timeZone)
    } else {
      dDate = date
    }
  } else {
    const sDate = date.toString()
    try {
      dDate = parseISO(sDate)
      if (isValid(dDate)) {
        if (timeZone && timeZone !== getTimeZone() && !/[+-]/.test(sDate)) {
          dDate = offsetTimeZone(dDate, timeZone)
        }
      } else {
        return sDate
      }
    } catch (err) {
      return sDate
    }
  }

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS)
  if (locale.code && /^ja-JP-u-ca-japanese$/i.test(locale.code)) {
    const target = dDate
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
    if (timeZone && timeZone !== getTimeZone()) {
      return _format(offsetTimeZone(dDate, timeZone), format, { locale })
    } else {
      return _format(dDate, format, { locale })
    }
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString()
    } else {
      throw err
    }
  }
}
