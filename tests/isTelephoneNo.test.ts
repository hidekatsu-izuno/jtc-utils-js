import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { isTelephoneNo } from "../src/isTelephoneNo.js";

describe("isTelephoneNo", () => {
  test("test empty", () => {
    assert.equal(isTelephoneNo(undefined), false);
    assert.equal(isTelephoneNo(null), false);
    assert.equal(isTelephoneNo(""), false);
  });

  test("test basic", () => {
    assert.equal(isTelephoneNo("0312345678"), true);
    assert.equal(isTelephoneNo("090123456789012"), true);
    assert.equal(isTelephoneNo("0901234567890123"), false);
    assert.equal(isTelephoneNo("03-1234-5678"), true);
    assert.equal(isTelephoneNo("090-12345-6-789012"), true);
    assert.equal(isTelephoneNo("(090)1234-5678"), true);
    assert.equal(isTelephoneNo("(090) 12345-6-789012"), true);
    assert.equal(isTelephoneNo("81-90-1234-5678901"), true);
    assert.equal(isTelephoneNo("+81-90-1234-5678901"), true);
    assert.equal(isTelephoneNo("+81(90)1234-5678901"), true);
    assert.equal(isTelephoneNo("+81 (090) 1234-567890"), true);
    assert.equal(isTelephoneNo("+0812 (090) 1234-5678"), false);
  });
});
