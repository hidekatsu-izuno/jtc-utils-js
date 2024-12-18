import { describe, expect, test } from "vitest";
import { toZenginKana } from "../src/toZenginKana.js";

describe("toZenginKana", () => {
  test("test characters", () => {
    expect(toZenginKana("\0")).toBe("\0");
    expect(toZenginKana("¥")).toBe("\\");
    expect(toZenginKana(",")).toBe(".");
    expect(toZenginKana("，")).toBe(".");
    expect(toZenginKana("．")).toBe(".");
    expect(toZenginKana("、")).toBe(".");
    expect(toZenginKana("。")).toBe(".");
    expect(toZenginKana("・")).toBe(".");
    expect(toZenginKana("ー")).toBe("-");
    expect(toZenginKana("－")).toBe("-");
    expect(toZenginKana("／")).toBe("/");
    expect(toZenginKana("＼")).toBe("\\");
    expect(toZenginKana("￥")).toBe("\\");
    expect(toZenginKana("(")).toBe("(");
    expect(toZenginKana(")")).toBe(")");
    expect(toZenginKana("[")).toBe("(");
    expect(toZenginKana("]")).toBe(")");
    expect(toZenginKana("（")).toBe("(");
    expect(toZenginKana("）")).toBe(")");
    expect(toZenginKana("［")).toBe("(");
    expect(toZenginKana("］")).toBe(")");
    expect(toZenginKana("｛")).toBe("(");
    expect(toZenginKana("｝")).toBe(")");
    expect(toZenginKana("！")).toBe("！");
    expect(toZenginKana("０")).toBe("0");
    expect(toZenginKana("Ａ")).toBe("A");
    expect(toZenginKana("ａ")).toBe("A");
    expect(toZenginKana("～")).toBe("～");
    expect(toZenginKana("亜")).toBe("亜");
    expect(toZenginKana("あ")).toBe("ｱ");
    expect(toZenginKana("ア")).toBe("ｱ");
    expect(toZenginKana("ｱ")).toBe("ｱ");
    expect(toZenginKana("が")).toBe("ｶﾞ");
    expect(toZenginKana("ガ")).toBe("ｶﾞ");
    expect(toZenginKana("ｶﾞ")).toBe("ｶﾞ");
    expect(toZenginKana("ぱ")).toBe("ﾊﾟ");
    expect(toZenginKana("パ")).toBe("ﾊﾟ");
    expect(toZenginKana("ﾊﾟ")).toBe("ﾊﾟ");
    expect(toZenginKana("「")).toBe("｢");
    expect(toZenginKana("」")).toBe("｣");
  });

  test("test sequences", () => {
    expect(toZenginKana("タグチ　トモロヲ")).toBe("ﾀｸﾞﾁ ﾄﾓﾛｵ");
    expect(toZenginKana("カ）ベローチェ")).toBe("ｶ)ﾍﾞﾛ-ﾁｴ");
    expect(toZenginKana("アガサ・クリスティー")).toBe("ｱｶﾞｻ.ｸﾘｽﾃｲ-");
  });
});
