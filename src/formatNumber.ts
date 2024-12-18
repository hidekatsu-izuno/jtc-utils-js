import { type Locale, enUS, ja } from "./locale/index.ts";
import { parseNumber } from "./parseNumber.ts";
import { NumberFormat } from "./util/NumberFormat.ts";
import { getLocale } from "./util/getLocale.ts";

declare type FormatNumberOptions = {
  locale?: Locale;
};

export function formatNumber(
  num: string | number | null | undefined,
  format?: string,
  options?: FormatNumberOptions,
) {
  let value: number;
  if (num == null) {
    return "";
  } else if (typeof num === "string") {
    const tmp = parseNumber(num);
    if (!tmp) {
      return num;
    }
    value = tmp as number;
  } else {
    value = num;
  }

  if (!format || !Number.isFinite(value)) {
    return toPlainString(value);
  }

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS);
  return NumberFormat.get(format, locale.code).format(value);
}

function toPlainString(num: number | string) {
  if (typeof num === "number" && (!Number.isFinite(num) || num === 0)) {
    return num.toString();
  }

  let str = num.toString();
  const sep = str.indexOf("e");
  if (sep === -1) {
    return str;
  }

  let minus = "";
  if (str.startsWith("-")) {
    str = str.substring(1);
    minus = "-";
  }

  const esign = str.charAt(sep + 1);

  const e = Number.parseInt(str.substring(sep + 2), 10);
  str = str.substring(0, sep);

  const index = str.indexOf(".");
  let scale = index === -1 ? 0 : str.length - index - 1;
  str = index === -1 ? str : str.substring(0, index) + str.substring(index + 1);
  if (esign === "+") {
    str = str + "0".repeat(e);
  } else {
    scale = scale + e;
  }

  str = str.replace(/^0+/, "");
  if (scale === 0) {
    return minus + str;
  }

  const ipart =
    str.length > scale ? minus + str.substring(0, str.length - scale) : "0";
  const fpart = (
    str.length > scale
      ? str.substring(str.length - scale)
      : "0".repeat(scale - str.length) + str
  ).replace(/0+$/, "");
  return ipart + (fpart ? `.${fpart}` : "");
}
