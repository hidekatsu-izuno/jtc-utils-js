const DateFormatCache = new Map<string, DateFormat>()

declare type DateFormatPart = {
  type: "quoted" | "literal" | "pattern",
  text: string,
}

export class DateFormat {
  static get(format: string, locale: string = "en") {
    const cached = DateFormatCache.get(locale + " " + format)
    if (cached) {
      return cached
    }

    const re = /('(?:''|[^'])*')|(P+p+|(?:G+|y+|Y+|R+|u+|Q+|q+|M+|L+|w+|I+|d+|E+|i+|e+|c+|a+|b+|B+|h+|H+|K+|k+|m+|s+|S+|X+|x+|O+|z+|t+|T+|P+|p+)o?)|(.+?)/y
    const parts = new Array<DateFormatPart>()
    let m
    while (m = re.exec(format)) {
      if (m[1]) {
        parts.push({ type: "quoted", text: m[1] })
      } else if (m[2]) {
        parts.push({ type: "pattern", text: m[2] })
      } else {
        parts.push({ type: "literal", text: m[3] })
      }
    }

    if (DateFormatCache.size >= 32) {
      for (const entry of DateFormatCache) {
        DateFormatCache.delete(entry[0])
        break
      }
    }

    const dformat = new DateFormat(parts)
    DateFormatCache.set(locale + " " + format, dformat)
    return dformat
  }

  constructor(
    public parts: Array<DateFormatPart>,
  ) {
  }

  toString() {
    let str = ""
    let quoted = false
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i]
      if (part.type === "quoted") {
        if (!quoted) {
          str += "'"
          quoted = true
        }
        str += part.text.substring(1, part.text.length-1)
      } else {
        if (quoted) {
          str += "'"
          quoted = false
        }
        str += part.text
      }
    }
    if (quoted) {
      str += "'"
      quoted = false
    }
    return str
  }
}
