import { parseDate } from "./text/parseDate.js"
import { getLocale } from "./getLocale.js"
import { escapeRegExp } from "./util/escapeRegExp.js"

export class JapaneseEra {
  static MEIJI = new JapaneseEra(
    "MEIJI",
    { en: ["Meiji", "M"], ja: ["明治", "明"] },
    parseDate("1868-10-23", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("1912-07-30", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static TAISHO = new JapaneseEra(
    "TAISHO",
    { en: ["Taisho", "T"], ja: ["大正", "大"] },
    parseDate("1912-07-30", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("1926-12-26", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static SHOWA = new JapaneseEra(
    "SHOWA",
    { en: ["Showa", "S"], ja: ["昭和", "昭"] },
    parseDate("1926-12-26", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("1989-01-08", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static HEISEI = new JapaneseEra(
    "HEISEI",
    { en: ["Heisei", "H"], ja: ["平成", "平"] },
    parseDate("1989-01-08", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("2019-05-01", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static REIWA = new JapaneseEra(
    "REIWA",
    { en: ["Reiwa", "R"], ja: ["令和", "令"] },
    parseDate("2019-05-01", "uuuu-MM-dd", "Asia/Tokyo"),
  )

  static values() {
    return [
      JapaneseEra.MEIJI,
      JapaneseEra.TAISHO,
      JapaneseEra.SHOWA,
      JapaneseEra.HEISEI,
      JapaneseEra.REIWA,
    ]
  }

  static from(key: string | Date) {
    if (key instanceof Date) {
      for (const value of JapaneseEra.values()) {
        if (value.includes(key)) {
          return value
        }
      }
    } else {
      const keyRE = new RegExp("^" + escapeRegExp(key) + "$", "i")
      for (const value of JapaneseEra.values()) {
        if (keyRE.test(value.name)) {
          return value
        }
        for (const key in value.localeNames) {
          for (const name of value.localeNames[key]) {
            if (keyRE.test(name)) {
              return value
            }
          }
        }
      }
    }
  }

  constructor(
    public readonly name: string,
    public readonly localeNames: Record<string, string[]>,
    public readonly start: Date,
    public readonly end?: Date,
  ) {

  }

  includes(date: Date) {
    return this.start <= date && (this.end == null || this.end > date)
  }

  toLocaleShortString(locale?: string) {
    const current = (locale ?? getLocale()).split(/-/g)[0]
    if (current === "ja") {
      return this.localeNames["ja"][1]
    }
    return this.localeNames["en"][1]
  }

  toLocaleString(locale?: string) {
    const current = (locale ?? getLocale()).split(/-/g)[0]
    if (current === "ja") {
      return this.localeNames["ja"][0]
    }
    return this.localeNames["en"][0]
  }

  toString() {
    return this.name
  }
}
