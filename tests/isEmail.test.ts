import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { isEmail } from "../src/isEmail.ts";

suite("isEmail", () => {
  test("test empty", () => {
    assert.equal(isEmail(undefined), false);
    assert.equal(isEmail(null), false);
    assert.equal(isEmail(""), false);
  });

  test("test basic", () => {
    assert.equal(isEmail("test@domain.com"), true);
    assert.equal(isEmail("test.sample@domain_domain.co.jp"), false);
    assert.equal(isEmail("test.sample@domain-domain.co.jp"), true);
    assert.equal(isEmail("test.@domain.ne.fr"), true);
    assert.equal(isEmail(".test@example"), true);
    assert.equal(isEmail("あいう@example"), false);
  });
});
