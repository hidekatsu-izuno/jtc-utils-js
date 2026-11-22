import { tz } from "@date-fns/tz";
import { isValid, parse, parseISO, type ParseOptions } from "date-fns";
import { longFormatters, parsers } from "date-fns/parse";

import { JapaneseEra } from "./JapaneseEra.ts";
import { enUS, ja, type Locale } from "./locale/index.ts";
import { getLocale } from "./util/getLocale.ts";

declare type ParseDateOptions = {
  locale?: Locale;
  timeZone?: string;
};

export function parseDate(
  str: string,
  format?: string,
  options?: ParseDateOptions,
): Date;
export function parseDate(
  str: null | undefined,
  format?: string,
  options?: ParseDateOptions,
): undefined;
export function parseDate(
  str: string | null | undefined,
  format?: string,
  options?: ParseDateOptions,
) {
  if (str == null) {
    return undefined;
  }

  const locale = options?.locale ?? (/^ja(-|$)/i.test(getLocale()) ? ja : enUS);
  const timeZone = options?.timeZone;

  try {
    const context = timeZone ? tz(timeZone) : undefined;
    const parseOptions = { locale, in: context };
    let date: Date;
    if (!format) {
      date = parseISO(str, parseOptions);
    } else if (/^ja-JP-u-ca-japanese$/i.test(locale.code)) {
      date = parseJapaneseDate(str, format, locale, parseOptions);
    } else {
      date = parse(str, format, new Date(), parseOptions);
    }
    return isValid(date) ? new Date(date.getTime()) : null;
  } catch (err) {
    if (err instanceof RangeError) {
      return null;
    } else {
      throw err;
    }
  }
}

function parseJapaneseDate(
  str: string,
  format: string,
  locale: Locale,
  options: ParseOptions,
): Date {
  // Expand localized formats before looking for era and year fields.
  const expanded = format.replace(
    /''|'(?:''|[^'])*(?:'|$)|P+p*|p+/g,
    (token) => longFormatters[token[0]]?.(token, locale.formatLong) ?? token,
  );
  const tokens =
    expanded.match(
      /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(?:''|[^'])*(?:'|$)|./g,
    ) ?? [];
  const eraIndex = tokens.findIndex((token) => token.startsWith("G"));
  if (eraIndex < 0) return parse(str, format, new Date(), options);

  const yearIndex = tokens.findIndex((token) => /^[yY]/.test(token));
  const parserOptions = {
    locale,
    weekStartsOn: locale.options?.weekStartsOn ?? 0,
    firstWeekContainsDate: locale.options?.firstWeekContainsDate ?? 1,
  };
  const fields: string[] = [];
  let rest = str;
  let era: JapaneseEra | undefined;
  let eraYear = 1;

  // Let date-fns consume adjacent numeric fields and localized names at their
  // original widths. Only the era and year need to change for the final parse.
  for (let i = 0; i <= Math.max(eraIndex, yearIndex); i++) {
    const token = tokens[i];
    let field: string;
    if (i === eraIndex) {
      const name = /^([MTSHR]|明治?|大正?|昭和?|平成?|令和?)/.exec(rest)?.[0];
      if (!name) return parse(str, format, new Date(), options);
      era = JapaneseEra.from(name, { locale: "ja" });
      field = name;
    } else if (parsers[token[0]]) {
      const match = parsers[token[0]].run(
        rest,
        token,
        locale.match,
        parserOptions,
      );
      if (!match) return new Date(NaN);
      field = rest.slice(0, rest.length - match.rest.length);
      if (i === yearIndex) {
        eraYear = token.endsWith("o")
          ? locale.match.ordinalNumber(field, { unit: "year" })!.value
          : Number(field);
        if (eraYear === 0 && (token === "yy" || token === "YY")) eraYear = 100;
        if (eraYear < 1) return new Date(NaN);
      }
    } else {
      field =
        token === "''"
          ? "'"
          : token.replace(/^'|'$/g, "").replaceAll("''", "'");
      if (!rest.startsWith(field)) return new Date(NaN);
    }
    fields.push(field);
    rest = rest.slice(field.length);
  }

  // Replacing the era with a space skips its date-fns setter. Preserve the
  // original token conflicts and the protected week-year tokens.
  if (
    !era ||
    tokens.some((token, i) => i !== eraIndex && /^[GRutT]/.test(token)) ||
    tokens[yearIndex] === "YY" ||
    tokens[yearIndex] === "YYYY"
  ) {
    return new Date(NaN);
  }
  tokens[eraIndex] = fields[eraIndex] = " ";
  const startYear = era.start.getUTCFullYear();
  const reference = parseISO(`${startYear}-01-01`, options);
  if (yearIndex >= 0) {
    fields[yearIndex] = String(startYear + eraYear - 1);
    const unit = tokens[yearIndex][0];
    tokens[yearIndex] =
      unit === "Y" && fields[yearIndex].length === 4
        ? "Y"
        : unit.repeat(fields[yearIndex].length);
  }
  return parse(fields.join("") + rest, tokens.join(""), reference, options);
}
