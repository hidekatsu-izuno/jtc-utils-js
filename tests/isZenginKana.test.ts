import { describe, expect, test } from "vitest";
import { isZenginKana } from "../src/isZenginKana.js";

describe("isZenginKana", () => {
	test("test empty", () => {
		expect(isZenginKana(undefined)).toBe(false);
		expect(isZenginKana(null)).toBe(false);
		expect(isZenginKana("")).toBe(false);
	});

	test("test basic sequcence", () => {
		expect(isZenginKana("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ.-ABC")).toBe(true);
		expect(isZenginKana("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ")).toBe(false);
		expect(isZenginKana("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ")).toBe(false);
	});

	test("test ascii", () => {
		expect(isZenginKana("\0")).toBe(false);
		expect(isZenginKana("\t")).toBe(false);
		expect(isZenginKana("\r")).toBe(false);
		expect(isZenginKana("\n")).toBe(false);
		expect(isZenginKana(" ")).toBe(true);
		expect(isZenginKana("A")).toBe(true);
		expect(isZenginKana("Z")).toBe(true);
		expect(isZenginKana("a")).toBe(false);
		expect(isZenginKana("z")).toBe(false);
		expect(isZenginKana("0")).toBe(true);
		expect(isZenginKana("9")).toBe(true);
		expect(isZenginKana("-")).toBe(true);
		expect(isZenginKana(",")).toBe(false);
		expect(isZenginKana(".")).toBe(true);
		expect(isZenginKana("@")).toBe(false);
		expect(isZenginKana("\\")).toBe(true);
		expect(isZenginKana("(")).toBe(true);
		expect(isZenginKana(")")).toBe(true);
		expect(isZenginKana("[")).toBe(false);
		expect(isZenginKana("]")).toBe(false);
		expect(isZenginKana("{")).toBe(false);
		expect(isZenginKana("}")).toBe(false);
		expect(isZenginKana("\x7F")).toBe(false);
	});

	test("test fullwidth symbol", () => {
		expect(isZenginKana("　")).toBe(false);
		expect(isZenginKana("゠")).toBe(false);
		expect(isZenginKana("・")).toBe(false);
		expect(isZenginKana("ー")).toBe(false);
		expect(isZenginKana("「")).toBe(false);
		expect(isZenginKana("」")).toBe(false);
		expect(isZenginKana("、")).toBe(false);
		expect(isZenginKana("。")).toBe(false);
		expect(isZenginKana("￠")).toBe(false);
		expect(isZenginKana("￦")).toBe(false);
		expect(isZenginKana("｟")).toBe(false);
		expect(isZenginKana("｠")).toBe(false);
	});

	test("test fullwidth hiragana", () => {
		expect(isZenginKana("あ")).toBe(false);
		expect(isZenginKana("ぁ")).toBe(false);
		expect(isZenginKana("が")).toBe(false);
		expect(isZenginKana("ぱ")).toBe(false);
		expect(isZenginKana("ゐ")).toBe(false);
		expect(isZenginKana("ゑ")).toBe(false);
		expect(isZenginKana("ん")).toBe(false);
		expect(isZenginKana("ゔ")).toBe(false);
		expect(isZenginKana("ゕ")).toBe(false);
		expect(isZenginKana("ゖ")).toBe(false);
		expect(isZenginKana("ゝ")).toBe(false);
		expect(isZenginKana("ゞ")).toBe(false);
		expect(isZenginKana("ゟ")).toBe(false);
	});

	test("test fullwidth katakana", () => {
		expect(isZenginKana("ア")).toBe(false);
		expect(isZenginKana("ァ")).toBe(false);
		expect(isZenginKana("ガ")).toBe(false);
		expect(isZenginKana("パ")).toBe(false);
		expect(isZenginKana("ヰ")).toBe(false);
		expect(isZenginKana("ヱ")).toBe(false);
		expect(isZenginKana("ン")).toBe(false);
		expect(isZenginKana("ヷ")).toBe(false);
		expect(isZenginKana("ヸ")).toBe(false);
		expect(isZenginKana("ヴ")).toBe(false);
		expect(isZenginKana("ヺ")).toBe(false);
		expect(isZenginKana("ヹ")).toBe(false);
		expect(isZenginKana("ヵ")).toBe(false);
		expect(isZenginKana("ヶ")).toBe(false);
		expect(isZenginKana("ヽ")).toBe(false);
		expect(isZenginKana("ヾ")).toBe(false);
		expect(isZenginKana("ヿ")).toBe(false);
	});

	test("test halfwidth symbol", () => {
		expect(isZenginKana("｡")).toBe(false);
		expect(isZenginKana("｢")).toBe(true);
		expect(isZenginKana("｣")).toBe(true);
		expect(isZenginKana("､")).toBe(false);
		expect(isZenginKana("･")).toBe(false);
		expect(isZenginKana("ｰ")).toBe(false);
		expect(isZenginKana("ﾞ")).toBe(true);
		expect(isZenginKana("ﾟ")).toBe(true);
		expect(isZenginKana("¢")).toBe(false);
		expect(isZenginKana("€")).toBe(false);
		expect(isZenginKana("₩")).toBe(false);
	});

	test("test halfwidth katakana", () => {
		expect(isZenginKana("ｱ")).toBe(true);
		expect(isZenginKana("ｧ")).toBe(false);
		expect(isZenginKana("ｶﾞ")).toBe(true);
		expect(isZenginKana("ﾊﾟ")).toBe(true);
		expect(isZenginKana("ｳﾞ")).toBe(true);
		expect(isZenginKana("ｦ")).toBe(false);
		expect(isZenginKana("ﾝ")).toBe(true);
	});

	test("test fullwidth kanji", () => {
		expect(isZenginKana("亜")).toBe(false);
		expect(isZenginKana("腕")).toBe(false);
		expect(isZenginKana("黑")).toBe(false);
		expect(isZenginKana("𠮟")).toBe(false);
	});
});
