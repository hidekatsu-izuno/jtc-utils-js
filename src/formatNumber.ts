import { NumberFormat } from "./NumberFormat.js"
import { parseNumber } from "./parseNumber.js"

export function formatNumber(num: string | number | null | undefined, format?: string) {
  if (num == null) {
    return ""
  } else if (typeof num === "string") {
    const tmp = parseNumber(num)
    if (tmp) {
      num = tmp as number
    } else {
      return num
    }
  }

  if (!format || !Number.isFinite(num)) {
    return toPlainString(num)
  }

  return NumberFormat.get(format).format(num)
}

function toPlainString(num: number | string) {
  if (typeof num === "number" && (!Number.isFinite(num) || num === 0)) {
    return num.toString()
  }

  let str = num.toString()
  const sep = str.indexOf("e")
  if (sep === -1) {
    return str
  }

  let minus = ""
  if (str.startsWith("-")) {
    str = str.substring(1)
    minus = "-"
  }

  let esign = str.charAt(sep + 1)

  const e = Number.parseInt(str.substring(sep + 2), 10)
  str = str.substring(0, sep)

  const index = str.indexOf(".")
  let scale = (index === -1) ? 0 : str.length - index - 1
  str = (index === -1) ? str : (str.substring(0, index) + str.substring(index + 1))
  if (esign === "+") {
    str = str + "0".repeat(e)
  } else {
    scale = scale + e
  }

  str = str.replace(/^0+/, "")
  if (scale === 0) {
    return minus + str
  }

  const ipart = (str.length > scale) ? minus + str.substring(0, str.length - scale) : "0"
  const fpart = ((str.length > scale) ? str.substring(str.length - scale) : ("0".repeat(scale - str.length) + str)).replace(/0+$/, "")
  return  ipart + (fpart ? ("." + fpart) : "")
}
