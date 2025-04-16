import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { isHttpURL } from "../src/isHttpURL.js";

describe("isHttpURL", () => {
  test("test empty", () => {
    assert.equal(isHttpURL(undefined), false);
    assert.equal(isHttpURL(null), false);
    assert.equal(isHttpURL(""), false);
  });

  test("test basic", () => {
    assert.equal(isHttpURL("http://example.com"), true);
    assert.equal(isHttpURL("https://test.example.co.jp"), true);
    assert.equal(isHttpURL("https://test.example.co.jp/foo/bar/test.html"), 
      true,
    );
    expect(
      isHttpURL(
        "https://test.example.co.jp/foo/bar/test.html?a=1&bb=22&ccc=333",
      ),
    ).toBe(true);
    expect(
      isHttpURL(
        "https://test.example.co.jp/foo/bar/test.html?a=1&bb=22&ccc=333#anchor",
      ),
    ).toBe(true);
    assert.equal(isHttpURL("mailto:test@domain.com"), false);
    assert.equal(isHttpURL("ftp://test.example.co.jp"), false);
    assert.equal(isHttpURL("file:///test.example.co.jp"), false);
  });
});
