import assert from "node:assert/strict";
import { suite, test } from "node:test";

import { utf8 } from "../../src/charset/utf8.ts";

suite("utf8", () => {
  test("byte limits retain the longest complete prefix", () => {
    const encoder = utf8.createEncoder();
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const text = "aéあ😀z";
    const cases = [
      "",
      "a",
      "a",
      "aé",
      "aé",
      "aé",
      "aéあ",
      "aéあ",
      "aéあ",
      "aéあ",
      "aéあ😀",
      text,
      text,
    ];
    for (const [limit, expected] of cases.entries()) {
      const bytes = encoder.encode(text, { limit });
      assert.ok(bytes.length <= limit);
      assert.equal(decoder.decode(bytes), expected, `limit=${limit}`);
    }
    assert.equal(decoder.decode(encoder.encode(text)), text);
    assert.equal(decoder.decode(encoder.encode("abcdef", { limit: 3 })), "abc");
  });
});
