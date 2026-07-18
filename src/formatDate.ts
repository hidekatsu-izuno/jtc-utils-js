import { tz } from "@date-fns/tz";
import { format as _format, isValid, parseISO } from "date-fns";
import { JapaneseEra } from "./JapaneseEra.ts";
import { enUS, ja, type Locale } from "./locale/index.ts";
import { DateFormat } from "./util/DateFormat.ts";
import { getLocale } from "./util/getLocale.ts";

declare type FormatDateOptions = {
  locale?: Locale;
  timeZone?: string;
};

export function formatDate(
  date: Date | number | string | null | undefined,
  format: string,
  options?: FormatDateOptions,
) {
  const timeZone = options?.timeZone;

  let dDate: Date;
  if (!date) {
    return "";
  } else if (typeof date === "number") {
    dDate = new Date(date);
  } else if (date instanceof Date) {
    dDate = date;
  } else {
    const sDate = date.toString();
    dDate = parseISO(sDate);
    if (!isValid(dDate)) {
      return sDate;
    }
  }

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS);
  const context = timeZone ? tz(timeZone) : undefined;
  const targetDate = context ? context(dDate) : dDate;
  if (locale.code && /^ja-JP-u-ca-japanese$/i.test(locale.code)) {
    const era = JapaneseEra.of(targetDate);
    if (era) {
      const dFormat = DateFormat.get(format);
      const parts = [...dFormat.parts];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.type === "pattern") {
          if (part.text.startsWith("G")) {
            if (part.text.length <= 3) {
              parts[i] = {
                type: "quoted",
                text: `'${era.toLocaleString(locale.code, { style: "short" })}'`,
              };
            } else if (part.text.length === 4) {
              parts[i] = {
                type: "quoted",
                text: `'${era.toLocaleString(locale.code, { style: "long" })}'`,
              };
            } else {
              parts[i] = {
                type: "quoted",
                text: `'${era.toLocaleString(locale.code, { style: "narrow" })}'`,
              };
            }
          } else if (part.text.startsWith("y")) {
            const gYear =
              targetDate.getFullYear() - era.start.getFullYear() + 1;
            if (part.text.length === 1) {
              parts[i] = { type: "quoted", text: `'${gYear}'` };
            } else if (part.text.endsWith("o")) {
              parts[i] = { type: "quoted", text: `'${gYear}年'` };
            } else {
              parts[i] = {
                type: "quoted",
                text: `'${"0".repeat(part.text.length - gYear.toString().length)}${gYear}'`,
              };
            }
          }
        }
      }
      format = new DateFormat(parts).toString();
    }
  }

  try {
    return _format(dDate, format, { locale, in: context });
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString();
    } else {
      throw err;
    }
  }
}
