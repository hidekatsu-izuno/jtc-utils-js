import { describe, expect, test } from "vitest";
import { isHalfwidthKatakana } from "../src/isHalfwidthKatakana.js";

describe("isHalfwidthKatakana", () => {
  test("test empty", () => {
    expect(isHalfwidthKatakana(undefined)).toBe(false);
    expect(isHalfwidthKatakana(null)).toBe(false);
    expect(isHalfwidthKatakana("")).toBe(false);
  });

  test("test basic sequcence", () => {
    expect(isHalfwidthKatakana("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ･ｰ")).toBe(true);
    expect(isHalfwidthKatakana("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ")).toBe(false);
    expect(isHalfwidthKatakana("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ")).toBe(false);
  });

  test("test ascii", () => {
    expect(isHalfwidthKatakana("\0")).toBe(false);
    expect(isHalfwidthKatakana("\t")).toBe(false);
    expect(isHalfwidthKatakana("\r")).toBe(false);
    expect(isHalfwidthKatakana("\n")).toBe(false);
    expect(isHalfwidthKatakana(" ")).toBe(true);
    expect(isHalfwidthKatakana("a")).toBe(false);
    expect(isHalfwidthKatakana("0")).toBe(false);
    expect(isHalfwidthKatakana("@")).toBe(false);
    expect(isHalfwidthKatakana("\x7F")).toBe(false);
  });

  test("test fullwidth symbol", () => {
    expect(isHalfwidthKatakana("　")).toBe(false);
    expect(isHalfwidthKatakana("゠")).toBe(false);
    expect(isHalfwidthKatakana("・")).toBe(false);
    expect(isHalfwidthKatakana("ー")).toBe(false);
    expect(isHalfwidthKatakana("「")).toBe(false);
    expect(isHalfwidthKatakana("」")).toBe(false);
    expect(isHalfwidthKatakana("、")).toBe(false);
    expect(isHalfwidthKatakana("。")).toBe(false);
    expect(isHalfwidthKatakana("￠")).toBe(false);
    expect(isHalfwidthKatakana("￦")).toBe(false);
    expect(isHalfwidthKatakana("｟")).toBe(false);
    expect(isHalfwidthKatakana("｠")).toBe(false);
  });

  test("test fullwidth hiragana", () => {
    expect(isHalfwidthKatakana("あ")).toBe(false);
    expect(isHalfwidthKatakana("ぁ")).toBe(false);
    expect(isHalfwidthKatakana("が")).toBe(false);
    expect(isHalfwidthKatakana("ぱ")).toBe(false);
    expect(isHalfwidthKatakana("ゐ")).toBe(false);
    expect(isHalfwidthKatakana("ゑ")).toBe(false);
    expect(isHalfwidthKatakana("ん")).toBe(false);
    expect(isHalfwidthKatakana("ゔ")).toBe(false);
    expect(isHalfwidthKatakana("ゕ")).toBe(false);
    expect(isHalfwidthKatakana("ゖ")).toBe(false);
  });

  test("test fullwidth katakana", () => {
    expect(isHalfwidthKatakana("ア")).toBe(false);
    expect(isHalfwidthKatakana("ァ")).toBe(false);
    expect(isHalfwidthKatakana("ガ")).toBe(false);
    expect(isHalfwidthKatakana("パ")).toBe(false);
    expect(isHalfwidthKatakana("ヰ")).toBe(false);
    expect(isHalfwidthKatakana("ヱ")).toBe(false);
    expect(isHalfwidthKatakana("ン")).toBe(false);
    expect(isHalfwidthKatakana("ヷ")).toBe(false);
    expect(isHalfwidthKatakana("ヸ")).toBe(false);
    expect(isHalfwidthKatakana("ヴ")).toBe(false);
    expect(isHalfwidthKatakana("ヺ")).toBe(false);
    expect(isHalfwidthKatakana("ヹ")).toBe(false);
    expect(isHalfwidthKatakana("ヵ")).toBe(false);
    expect(isHalfwidthKatakana("ヶ")).toBe(false);
  });

  test("test halfwidth symbol", () => {
    expect(isHalfwidthKatakana("｡")).toBe(false);
    expect(isHalfwidthKatakana("｢")).toBe(false);
    expect(isHalfwidthKatakana("｣")).toBe(false);
    expect(isHalfwidthKatakana("､")).toBe(false);
    expect(isHalfwidthKatakana("･")).toBe(true);
    expect(isHalfwidthKatakana("ｰ")).toBe(true);
    expect(isHalfwidthKatakana("ﾞ")).toBe(true);
    expect(isHalfwidthKatakana("ﾟ")).toBe(true);
    expect(isHalfwidthKatakana("¢")).toBe(false);
    expect(isHalfwidthKatakana("€")).toBe(false);
    expect(isHalfwidthKatakana("₩")).toBe(false);
  });

  test("test halfwidth katakana", () => {
    expect(isHalfwidthKatakana("ｱ")).toBe(true);
    expect(isHalfwidthKatakana("ｧ")).toBe(true);
    expect(isHalfwidthKatakana("ｶﾞ")).toBe(true);
    expect(isHalfwidthKatakana("ﾊﾟ")).toBe(true);
    expect(isHalfwidthKatakana("ｳﾞ")).toBe(true);
    expect(isHalfwidthKatakana("ﾝ")).toBe(true);
  });

  test("test fullwidth kanji", () => {
    expect(isHalfwidthKatakana("亜")).toBe(false);
    expect(isHalfwidthKatakana("腕")).toBe(false);
    expect(isHalfwidthKatakana("黑")).toBe(false);
    expect(isHalfwidthKatakana("𠮟")).toBe(false);
  });
});
