import assert from "node:assert/strict";
import { suite, test } from "node:test";

import { detectPlatform, type PlatformInfo } from "../src/detectPlatform.ts";

const iphoneUserAgent =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) " +
  "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 " +
  "Mobile/15E148 Safari/604.1";
const ipodUserAgent =
  "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_8 like Mac OS X) " +
  "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 " +
  "Mobile/15E148 Safari/604.1";
const ipadUserAgent =
  "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) " +
  "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 " +
  "Mobile/15E148 Safari/604.1";
const macUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const androidWebViewUserAgent =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240505.002; wv) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 " +
  "Chrome/124.0.6367.99 Mobile Safari/537.36";
const samsungBrowserUserAgent =
  "Mozilla/5.0 (Linux; Android 14; SM-S921B) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 " +
  "Chrome/125.0.0.0 Mobile Safari/537.36";

function detectInBrowser(userAgent: string, maxTouchPoints = 0): PlatformInfo {
  const processDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "process",
  );
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "navigator",
  );
  const windowDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "window",
  );

  Object.defineProperty(globalThis, "process", {
    configurable: true,
    value: undefined,
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { maxTouchPoints, userAgent },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {},
  });

  try {
    return detectPlatform(userAgent);
  } finally {
    if (processDescriptor) {
      Object.defineProperty(globalThis, "process", processDescriptor);
    }
    if (navigatorDescriptor) {
      Object.defineProperty(globalThis, "navigator", navigatorDescriptor);
    } else {
      Reflect.deleteProperty(globalThis, "navigator");
    }
    if (windowDescriptor) {
      Object.defineProperty(globalThis, "window", windowDescriptor);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
}

suite("detectPlatform", () => {
  test("distinguishes iPad and iPhone", () => {
    const ipad = detectInBrowser(ipadUserAgent);
    assert.equal(ipad.ios, true);
    assert.equal(ipad.ipad, true);
    assert.equal(ipad.iphone, false);
    assert.equal(ipad.tablet, true);
    assert.equal(ipad.mobile, false);

    const iphone = detectInBrowser(iphoneUserAgent);
    assert.equal(iphone.ios, true);
    assert.equal(iphone.ipad, false);
    assert.equal(iphone.iphone, true);
    assert.equal(iphone.ipod, false);
    assert.equal(iphone.tablet, false);
    assert.equal(iphone.mobile, true);

    const ipod = detectInBrowser(ipodUserAgent);
    assert.equal(ipod.ios, true);
    assert.equal(ipod.ipad, false);
    assert.equal(ipod.iphone, false);
    assert.equal(ipod.ipod, true);
    assert.equal(ipod.tablet, false);
    assert.equal(ipod.mobile, true);
  });

  test("detects iPadOS desktop user agent", () => {
    const ipad = detectInBrowser(macUserAgent, 5);

    assert.equal(ipad.ios, true);
    assert.equal(ipad.ipad, true);
    assert.equal(ipad.macos, false);
    assert.equal(ipad.tablet, true);
  });

  test("does not classify a Mac as iPad without touch points", () => {
    const mac = detectInBrowser(macUserAgent);

    assert.equal(mac.macos, true);
    assert.equal(mac.ios, false);
    assert.equal(mac.ipad, false);
  });

  test("detects Android WebView and Samsung Internet separately", () => {
    const webView = detectInBrowser(androidWebViewUserAgent);
    assert.equal(webView.androidWebView, true);
    assert.equal(webView.samsungBrowser, false);
    assert.equal(webView.android, true);
    assert.equal(webView.mobile, true);
    assert.equal(webView.blink, true);

    const samsungBrowser = detectInBrowser(samsungBrowserUserAgent);
    assert.equal(samsungBrowser.androidWebView, false);
    assert.equal(samsungBrowser.samsungBrowser, true);
    assert.equal(samsungBrowser.android, true);
    assert.equal(samsungBrowser.mobile, true);
    assert.equal(samsungBrowser.blink, true);
  });

  test("works without browser globals on Node", () => {
    const platform = detectPlatform();

    assert.equal(platform.node, true);
    assert.equal(platform.server, true);
  });
});
