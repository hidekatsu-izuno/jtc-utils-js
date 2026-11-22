import assert from "node:assert/strict";
import { suite, test } from "node:test";

import { jaJPUCaJapanese } from "../src/locale/jaJPUCaJapanese.ts";
import { parseDate } from "../src/parseDate.ts";
import { getTimeZone } from "../src/util/getTimeZone.ts";

suite("formatDate", () => {
  test("test parse by no format", () => {
    assert.deepEqual(parseDate("2000-01-01"), new Date(2000, 0, 1));
    assert.deepEqual(parseDate("20000101"), new Date(2000, 0, 1));
  });

  test("test parse from string", () => {
    assert.deepEqual(parseDate("2000/01/01", "uuuu/M/d"), new Date(2000, 0, 1));
  });

  test("test parse from string with tz", () => {
    const current = getTimeZone();
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: current }),
      new Date(2000, 0, 1, 0, 0),
    );
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: "UTC" }),
      new Date(2000, 0, 1, 9),
    );
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00Z", "uuuu/MM/dd H:m:sX", {
        timeZone: current,
      }),
      new Date(2000, 0, 1, 9),
    );
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00Z", "uuuu/MM/dd H:m:sX", {
        timeZone: "UTC",
      }),
      new Date(2000, 0, 1, 9),
    );
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00+0000", "uuuu/MM/dd H:m:sx", {
        timeZone: current,
      }),
      new Date(2000, 0, 1, 9),
    );
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00+0000", "uuuu/MM/dd H:m:sx", {
        timeZone: "UTC",
      }),
      new Date(2000, 0, 1, 9),
    );
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00", undefined, { timeZone: current }),
      new Date(2000, 0, 1, 0),
    );
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00", undefined, { timeZone: "UTC" }),
      new Date(2000, 0, 1, 9),
    );
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00+00:00", undefined, { timeZone: current }),
      new Date(2000, 0, 1, 9),
    );
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00+00:00", undefined, { timeZone: "UTC" }),
      new Date(2000, 0, 1, 9),
    );
  });

  test("test parse across a daylight saving time transition", () => {
    assert.deepEqual(
      parseDate("2024/03/10 01:30:00", "uuuu/MM/dd H:mm:ss", {
        timeZone: "America/New_York",
      }),
      new Date("2024-03-10T06:30:00Z"),
    );
    assert.deepEqual(
      parseDate("2024/03/10 03:30:00", "uuuu/MM/dd H:mm:ss", {
        timeZone: "America/New_York",
      }),
      new Date("2024-03-10T07:30:00Z"),
    );
  });

  test("test parse japanese calendar", () => {
    assert.deepEqual(
      parseDate("平成12/1/1", "Gyyyy/M/d", { locale: jaJPUCaJapanese }),
      new Date(2000, 0, 1),
    );
  });

  test("parses Japanese era years in the specified time zone", () => {
    const options = { locale: jaJPUCaJapanese, timeZone: "Asia/Tokyo" };
    const midnight = new Date("1999-12-31T15:00:00Z");
    assert.deepEqual(parseDate("平成12/1/1", "Gyyyy/M/d", options), midnight);
    assert.deepEqual(parseDate("12/1/1 H", "yy/M/d G", options), midnight);
    assert.deepEqual(parseDate("平120101", "GyyMMdd", options), midnight);
    assert.deepEqual(parseDate("平成12/01/01", "GP", options), midnight);
    assert.deepEqual(
      parseDate("平成12/1/1 00:00Z", "Gy/M/d HH:mmX", options),
      new Date("2000-01-01T00:00:00Z"),
    );
  });

  test("validates leap days in the Gregorian year of the Japanese era", () => {
    for (const timeZone of [undefined, "Asia/Tokyo"]) {
      const options = { locale: jaJPUCaJapanese, timeZone };
      assert.deepEqual(
        parseDate("令和6/2/29", "Gy/M/d", options),
        timeZone ? new Date("2024-02-28T15:00:00Z") : new Date(2024, 1, 29),
      );
      assert.equal(parseDate("令和4/2/29", "Gy/M/d", options), null);
    }
  });
});
