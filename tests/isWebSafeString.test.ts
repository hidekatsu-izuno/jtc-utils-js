import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { isWebSafeString } from "../src/isWebSafeString.js";

describe("isWebSafeString", () => {
  test("test no string", () => {
    assert.equal(isWebSafeString(undefined), false);
    assert.equal(isWebSafeString(null), false);
    assert.equal(isWebSafeString(""), true);
  });

  test("test basic sequcence", () => {
    assert.equal(isWebSafeString("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ"), true);
    assert.equal(isWebSafeString("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ"), true);
    assert.equal(isWebSafeString("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ"), true);
    assert.equal(isWebSafeString("亜いｳエｵガｷﾞ具ｹﾞゴﾊﾟぴプﾎﾟ"), true);
    assert.equal(isWebSafeString("\uFEFF"), false);
    assert.equal(isWebSafeString("\uE000"), false);
    assert.equal(isWebSafeString("\uD800"), false);
  });

  test("test ascii", () => {
    assert.equal(isWebSafeString("\0"), false);
    assert.equal(isWebSafeString("\t"), true);
    assert.equal(isWebSafeString("\r"), true);
    assert.equal(isWebSafeString("\n"), true);
    assert.equal(isWebSafeString(" "), true);
    assert.equal(isWebSafeString("a"), true);
    assert.equal(isWebSafeString("0"), true);
    assert.equal(isWebSafeString("@"), true);
    assert.equal(isWebSafeString("\x7F"), false);
  });

  test("test special", () => {
    assert.equal(isWebSafeString("\uFFF0"), false);
    assert.equal(isWebSafeString("\uFFF1"), false);
    assert.equal(isWebSafeString("\uFFF2"), false);
    assert.equal(isWebSafeString("\uFFF3"), false);
    assert.equal(isWebSafeString("\uFFF4"), false);
    assert.equal(isWebSafeString("\uFFF5"), false);
    assert.equal(isWebSafeString("\uFFF6"), false);
    assert.equal(isWebSafeString("\uFFF7"), false);
    assert.equal(isWebSafeString("\uFFF8"), false);
    assert.equal(isWebSafeString("\uFFF9"), false);
    assert.equal(isWebSafeString("\uFFFA"), false);
    assert.equal(isWebSafeString("\uFFFB"), false);
    assert.equal(isWebSafeString("\uFFFC"), false);
    assert.equal(isWebSafeString("\uFFFD"), false);
    assert.equal(isWebSafeString("\uFFFE"), false);
    assert.equal(isWebSafeString("\uFFFF"), false);
  });
});
