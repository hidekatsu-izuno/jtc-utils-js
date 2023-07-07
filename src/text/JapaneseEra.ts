import { parseDate } from "./parseDate.js"

export class JapaneseEra {
  static MEIJI = new JapaneseEra(
    "MEIJI",
    "明治",
    parseDate("1868-10-23", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("1912-07-30", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static TAISHO = new JapaneseEra(
    "TAISHO",
    "大正",
    parseDate("1912-07-30", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("1926-12-26", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static SHOWA = new JapaneseEra(
    "SHOWA",
    "昭和",
    parseDate("1926-12-26", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("1989-01-08", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static HEISEI = new JapaneseEra(
    "HEISEI",
    "平成",
    parseDate("1989-01-08", "uuuu-MM-dd", "Asia/Tokyo"),
    parseDate("2019-05-01", "uuuu-MM-dd", "Asia/Tokyo"),
  )
  static REIWA = new JapaneseEra(
    "REIWA",
    "令和",
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

  static get(keyword: string) {
    return JapaneseEra.map.get(keyword)
  }

  private static map = new Map<string, JapaneseEra>()

  static {
    for (const value of JapaneseEra.values()) {
      this.map.set(value.name, value)
      this.map.set(value.formalName, value)
      this.map.set(value.name.charAt(0), value)
      this.map.set(value.formalName.charAt(0), value)
    }
  }

  constructor(
    public readonly name: string,
    public readonly formalName: string,
    public readonly start: Date,
    public readonly end?: Date,
  ) {

  }
}
