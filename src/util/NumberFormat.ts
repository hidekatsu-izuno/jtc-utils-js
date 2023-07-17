import { escapeRegExp } from "./escapeRegExp.ts"

const ReNumberFormat = /^((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*)(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?$/
const ReDecimalText = /("(""|[^"])*"|'(''|[^'])*')/g

declare type NumberFormatPattern = {
  prefix: string,
  suffix: string,
  groupingDigits: number,
  formatter: Intl.NumberFormat,
}

const NumberFormatCache = new Map<string, NumberFormat>()

export class NumberFormat {
  static get(format: string, locale: string = "en-US") {
      const cached = NumberFormatCache.get(locale + " " + format)
      if (cached) {
        return cached
      }

      const m = ReNumberFormat.exec(format)
      if (!m || !m[2]) {
        throw new TypeError("Invalid format: " + format)
      }

      const patterns = new Array<NumberFormatPattern>()
      for (let i = 0; i < 3; i++) {
        let iFormat = m[i * 4 + 2] || ''
        let fFormat = m[i * 4 + 3] || ''
        if (!iFormat) {
          break
        }

        let prefix = (m[i * 4 + 1] || '').replace(ReDecimalText, m => {
          const sep = m.charAt(0)
          return m.substring(1, m.length - 1).replaceAll(sep + sep, sep)
        })
        let suffix = (m[i * 4 + 4] || '').replace(ReDecimalText, m => {
          const sep = m.charAt(0)
          return m.substring(1, m.length - 1).replaceAll(sep + sep, sep)
        })

        let minimumIntegerDigits = 1
        let minimumFractionDigits = 0
        let maximumFractionDigits = 0
        let groupingDigits = 0

        if (fFormat) {
          if (fFormat.length > 1) {
            maximumFractionDigits = fFormat.length - 1
            const zeroPos = fFormat.lastIndexOf("0")
            minimumFractionDigits = ((zeroPos !== -1) ? zeroPos : 0)
          } else {
            suffix = fFormat + suffix
          }
        }

        const groupingPos = iFormat.lastIndexOf(",")
        if (groupingPos !== -1) {
          groupingDigits = iFormat.length - groupingPos - 1
          iFormat = iFormat.replaceAll(",", "")
        }

        const zeroPos = iFormat.indexOf("0")
        if (zeroPos !== -1) {
          minimumIntegerDigits = Math.max(iFormat.length - zeroPos, 1)
        }

        patterns.push({
          prefix,
          suffix,
          groupingDigits: groupingDigits !== 3 ? groupingDigits : 0,
          formatter: new Intl.NumberFormat(locale, {
            minimumIntegerDigits,
            minimumFractionDigits,
            maximumFractionDigits,
            useGrouping: groupingDigits === 3
          }),
        })
      }

      const positive = patterns[0]
      const negative = patterns[1] || {
        ...patterns[0],
        prefix: patterns[0].prefix + "-"
      }
      const zero = patterns[2] || patterns[0]

      // https://observablehq.com/@mbostock/localized-number-parsing
      const map = new Map<string, string>()
      let n = 9
      for (const sc of new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)) {
        const dc = n.toString()
        if (sc !== dc) {
          map.set(sc, dc)
        }
        n--
      }

      const parts = new Intl.NumberFormat(locale, { useGrouping: true }).formatToParts(12345.6)
      const decimalSeparator = parts.find(d => d.type === "decimal")?.value ?? "."
      if (decimalSeparator && decimalSeparator !== ".") {
        map.set(decimalSeparator, ".")
      }
      const groupingSeparator = parts.find(d => d.type === "group")?.value ?? ""
      if (groupingSeparator) {
        map.set(groupingSeparator, "")
      }

      if (NumberFormatCache.size >= 32) {
        for (const entry of NumberFormatCache) {
          NumberFormatCache.delete(entry[0])
          break
        }
      }

      const dformat = new NumberFormat(positive, negative, zero, decimalSeparator, groupingSeparator, map)
      NumberFormatCache.set(locale + " " + format, dformat)
      return dformat
  }

  private constructor(
    public positive: NumberFormatPattern,
    public negative: NumberFormatPattern,
    public zero: NumberFormatPattern,
    public decimalSeparator: string,
    public groupingSeparator: string,
    public map: Map<string, string>,
  ) {
  }

  format(value: number) {
    if (Number.isNaN(value)) {
      return ""
    }

    const format = value === 0 ? this.zero : (value < 0) ? this.negative: this.positive
    let formatted = Number.isFinite(value) ? format.formatter.format(Math.abs(value)) : Math.abs(value).toString()
    if (format.groupingDigits > 0 && this.groupingSeparator) {
      const re = new RegExp("\\B(?=(\\d{" + format.groupingDigits + "})+(?!\\d))", "g")
      let sep = formatted.indexOf(this.decimalSeparator)
      if (sep !== -1) {
        formatted = formatted.substring(0, sep).replace(re, this.groupingSeparator) + ((sep !== -1) ? formatted.substring(sep) : "")
      } else {
        formatted = formatted.replace(re, this.groupingSeparator)
      }
    }
    return format.prefix + formatted + format.suffix
  }

  parse(value: string) {
    if (!value) {
      return Number.NaN
    }

    if ((this.positive.prefix.length > 0 || this.positive.suffix.length > 0)
      && this.positive.prefix.length + this.positive.suffix.length < value.length
      && value.startsWith(this.positive.prefix)
      && value.endsWith(this.positive.suffix)) {
        // skip
    } else if ((this.negative.prefix.length > 0 || this.negative.suffix.length > 0)
      && this.negative.prefix.length + this.negative.suffix.length < value.length
      && value.startsWith(this.negative.prefix)
      && value.endsWith(this.negative.suffix)) {
        value = "-" + value.substring(this.negative.prefix.length, value.length - this.negative.suffix.length)
    }

    if (this.map.size > 0) {
      let value2 = ""
      for (const c of value) {
        value2 += this.map.get(c) ?? c
      }
      value = value2
    }

    return Number.parseFloat(value)
  }
}
