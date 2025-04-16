import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { formatDate } from "../src/formatDate.ts";
import { enUS, ja, jaJPUCaJapanese } from "../src/locale/index.ts";
import { getTimeZone } from "../src/util/getTimeZone.ts";

suite("formatDate", () => {
  test("test format from string to string", () => {
    assert.equal(formatDate("2000-01-01", "uuuu/M/d"), "2000/1/1");
  });

  test("test format from string with tz to string", () => {
    const current = getTimeZone();
    assert.equal(
      formatDate("2000-01-01 00:00:00", "uuuu/M/d H:m:s", {
        timeZone: current,
      }),
      "2000/1/1 0:0:0",
    );
    assert.equal(
      formatDate("2000-01-01 00:00:00", "uuuu/M/d H:m:s", { timeZone: "UTC" }),
      "1999/12/31 15:0:0",
    );
    assert.equal(
      formatDate("2000-01-01 00:00:00Z", "uuuu/M/d H:m:s", {
        timeZone: current,
      }),
      "2000/1/1 9:0:0",
    );
    assert.equal(
      formatDate("2000-01-01 00:00:00Z", "uuuu/M/d H:m:s", { timeZone: "UTC" }),
      "2000/1/1 0:0:0",
    );
  });

  test("test format japanese calendar", () => {
    assert.equal(
      formatDate("2000-01-01", "Gy/M/d", { locale: jaJPUCaJapanese }),
      "平12/1/1",
    );
    assert.equal(
      formatDate("2000-01-01", "GGGGyyy/M/d", { locale: jaJPUCaJapanese }),
      "平成012/1/1",
    );
    assert.equal(
      formatDate("2000-01-01", "GGGGGyyy/M/d", { locale: jaJPUCaJapanese }),
      "H012/1/1",
    );
  });

  test("test localalized format", () => {
    assert.equal(
      formatDate(new Date(2000, 0, 1), "GGGGy/M/d", { locale: enUS }),
      "Anno Domini2000/1/1",
    );
    assert.equal(
      formatDate(new Date(2000, 0, 1), "GGGGy/M/d", { locale: ja }),
      "西暦2000/1/1",
    );
    assert.equal(
      formatDate(new Date(2000, 0, 1), "GGGGy/M/d", {
        locale: jaJPUCaJapanese,
      }),
      "平成12/1/1",
    );
  });
});
