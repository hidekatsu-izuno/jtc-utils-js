import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { isUnicodeBMP } from "../src/isUnicodeBMP.js";

describe("isUnicodeBMP", () => {
  test("test no string", () => {
    assert.equal(isUnicodeBMP(undefined), false);
    assert.equal(isUnicodeBMP(null), false);
    assert.equal(isUnicodeBMP(""), true);
  });

  test("test basic sequcence", () => {
    assert.equal(isUnicodeBMP("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ"), true);
    assert.equal(isUnicodeBMP("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ"), true);
    assert.equal(isUnicodeBMP("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ"), true);
    assert.equal(isUnicodeBMP("亜いｳエｵガｷﾞ具ｹﾞゴﾊﾟぴプﾎﾟ"), true);
    assert.equal(isUnicodeBMP("𠮟"), false);
  });
});
