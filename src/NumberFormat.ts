const ReNumberFormat = /^((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*)(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?$/
const ReDecimalText = /("(""|[^"])*"|'(''|[^'])*')/g

declare type NumberFormatPattern = {
  prefix: string,
  suffix: string,
  groupingDigits: number,
  formatter: Intl.NumberFormat,
}

const NumberFormatCache = new Map<string, NumberFormat>()

export default class NumberFormat {
  static get(format: string, locale: string = "en-US") {
      const cached = NumberFormatCache.get(format)
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
          iFormat = iFormat.replaceAll(",", "")
          groupingDigits = iFormat.length - groupingPos
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

      const dformat = new NumberFormat(positive, negative, zero)
      NumberFormatCache.set(format, dformat)
      return dformat
  }

  private constructor(
    public positive: NumberFormatPattern,
    public negative: NumberFormatPattern,
    public zero: NumberFormatPattern
  ) {
  }

  format(value: number) {
    if (Number.isNaN(value)) {
      return ""
    }

    const format = value === 0 ? this.zero : (value < 0) ? this.negative: this.positive
    let formatted = Number.isFinite(value) ? format.formatter.format(Math.abs(value)) : Math.abs(value).toString()
    if (format.groupingDigits > 0) {
      const re = new RegExp("\\B(?=(\\d{" + format.groupingDigits + "})+(?!\\d))", "g")
      const sep = formatted.indexOf(".")
      formatted = formatted.substring(0, sep).replace(re, ",") + ((sep !== -1) ? formatted.substring(sep) : "")
    }
    return format.prefix + formatted + format.suffix
  }
}
