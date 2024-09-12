import { parseISO } from "date-fns";
import { escapeRegExp } from "./util/escapeRegExp.ts";
import { getLocale } from "./util/getLocale.ts";

export class JapaneseEra {
	static MEIJI = new JapaneseEra(
		"MEIJI",
		{
			ja: { long: "明治", short: "明", narrow: "M" },
			en: { long: "Meiji", short: "Mei", narrow: "M" },
		},
		parseISO("1868-10-23T00:00:00+09:00"),
		parseISO("1912-07-30T00:00:00+09:00"),
	);
	static TAISHO = new JapaneseEra(
		"TAISHO",
		{
			ja: { long: "大正", short: "大", narrow: "T" },
			en: { long: "Taisho", short: "Tai", narrow: "T" },
		},
		parseISO("1912-07-30T00:00:00+09:00"),
		parseISO("1926-12-26T00:00:00+09:00"),
	);
	static SHOWA = new JapaneseEra(
		"SHOWA",
		{
			ja: { long: "昭和", short: "昭", narrow: "S" },
			en: { long: "Showa", short: "Sho", narrow: "S" },
		},
		parseISO("1926-12-26T00:00:00+09:00"),
		parseISO("1989-01-08T00:00:00+09:00"),
	);
	static HEISEI = new JapaneseEra(
		"HEISEI",
		{
			ja: { long: "平成", short: "平", narrow: "H" },
			en: { long: "Heisei", short: "Hei", narrow: "H" },
		},
		parseISO("1989-01-08T00:00:00+09:00"),
		parseISO("2019-05-01T00:00:00+09:00"),
	);
	static REIWA = new JapaneseEra(
		"REIWA",
		{
			ja: { long: "令和", short: "令", narrow: "R" },
			en: { long: "Reiwa", short: "Rei", narrow: "R" },
		},
		parseISO("2019-05-01T00:00:00+09:00"),
	);

	static values() {
		return [
			JapaneseEra.MEIJI,
			JapaneseEra.TAISHO,
			JapaneseEra.SHOWA,
			JapaneseEra.HEISEI,
			JapaneseEra.REIWA,
		];
	}

	static of(date: Date) {
		for (const value of JapaneseEra.values()) {
			if (value.includes(date)) {
				return value;
			}
		}
	}

	static from(name: string, options?: { locale?: string }) {
		const locale = options?.locale ?? getLocale();
		const keyRE = new RegExp("^" + escapeRegExp(name) + "$", "i");
		for (const value of JapaneseEra.values()) {
			if (keyRE.test(value.name)) {
				return value;
			}
			const localNames = value.localeNames[locale] ?? value.localeNames["en"];
			for (const key in localNames) {
				if (keyRE.test(localNames[key])) {
					return value;
				}
			}
		}
	}

	constructor(
		public readonly name: string,
		public readonly localeNames: Record<string, Record<string, string>>,
		public readonly start: Date,
		public readonly end?: Date,
	) {}

	includes(date: Date) {
		return this.start <= date && (this.end == null || this.end > date);
	}

	toLocaleString(
		locale?: string,
		options?: {
			style?: "long" | "short" | "narrow";
		},
	) {
		const target = (locale ?? getLocale()).split(/-/g)[0];
		const style = options?.style || "long";
		const names = this.localeNames[target];
		if (names) {
			return names[style];
		}
		return this.localeNames["en"][style];
	}

	toString() {
		return this.name;
	}
}
