import { getLocale } from "../util/getLocale.js"
import { escapeRegExp } from "./escapeRegExp.js"

export class Week {
  static SUNDAY = new Week("SUNDAY", { en: ["Sunday", "Sun"], ja: ["日曜日", "日"] })
  static MONDAY = new Week("MONDAY", { en: ["Monday", "Mon"], ja: ["月曜日", "月"] })
  static TUESDAY = new Week("TUESDAY", { en: ["Tuesday", "Tue"], ja: ["火曜日", "火"] })
  static WEDNESDAY = new Week("WEDNESDAY", { en: ["Wednesday", "Wed"], ja: ["水曜日", "水"] })
  static THURSDAY = new Week("THURSDAY", { en: ["Thursday", "Thu"], ja: ["木曜日", "木"] })
  static FRIDAY = new Week("FRIDAY", { en: ["Friday", "Fri"], ja: ["金曜日", "金"] })
  static SATURDAY = new Week("SATURDAY", { en: ["Saturday", "Sat"], ja: ["土曜日", "土"] })

  static values() {
    return [
      Week.SUNDAY,
      Week.MONDAY,
      Week.TUESDAY,
      Week.WEDNESDAY,
      Week.THURSDAY,
      Week.FRIDAY,
      Week.SATURDAY,
    ]
  }

  static from(key: string | number) {
    if (typeof key === "number") {
      switch (key) {
        case 0: return Week.SUNDAY
        case 1: return Week.MONDAY
        case 2: return Week.TUESDAY
        case 3: return Week.WEDNESDAY
        case 4: return Week.THURSDAY
        case 5: return Week.FRIDAY
        case 6: return Week.SATURDAY
      }
    } else {
      const keyRE = new RegExp("^" + escapeRegExp(key) + "$", "i")
      for (const value of Week.values()) {
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
  ) {
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
