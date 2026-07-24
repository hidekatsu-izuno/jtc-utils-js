export declare type PlatformInfo = {
  server: boolean;
  node: boolean;
  deno: boolean;
  bun: boolean;
  cloudflareWorkers: boolean;
  awsLambda: boolean;

  // browser environment
  browser: boolean;
  edge: boolean;
  msie: boolean;
  chrome: boolean;
  androidWebView: boolean;
  samsungBrowser: boolean;
  safari: boolean;
  firefox: boolean;
  opera: boolean;

  // sub bland
  ucbrowser: boolean;
  googlebot: boolean;
  line: boolean;
  yahoo: boolean;

  // engine
  webkit: boolean;
  trident: boolean;
  edgeHtml: boolean;
  blink: boolean;
  gecko: boolean;
  presto: boolean;

  // os
  windows: boolean;
  macos: boolean;
  ios: boolean;
  ipad: boolean;
  iphone: boolean;
  ipod: boolean;
  android: boolean;

  // machine
  tablet: boolean;
  mobile: boolean;
};

export function detectPlatform(userAgent?: string): PlatformInfo {
  const info: PlatformInfo = {
    // environment
    browser: false,
    server: false,

    // server platform bland
    node: false,
    deno: false,
    bun: false,
    cloudflareWorkers: false,
    awsLambda: false,

    // browser bland
    edge: false,
    msie: false,
    chrome: false,
    androidWebView: false,
    samsungBrowser: false,
    safari: false,
    firefox: false,
    opera: false,

    // sub bland
    googlebot: false,
    ucbrowser: false,
    line: false,
    yahoo: false,

    // engine
    webkit: false,
    trident: false,
    edgeHtml: false,
    blink: false,
    gecko: false,
    presto: false,

    // os
    windows: false,
    macos: false,
    ios: false,
    ipad: false,
    iphone: false,
    ipod: false,
    android: false,

    // machine
    tablet: false,
    mobile: false,
  };

  const hasWindow = typeof window !== "undefined";
  const platformNavigator =
    typeof navigator !== "undefined" ? navigator : undefined;

  if (!userAgent) {
    userAgent = platformNavigator?.userAgent;
  }

  if (userAgent === "Cloudflare-Workers") {
    info.cloudflareWorkers = true;
  } else if (typeof process !== "undefined" && process.versions?.node != null) {
    info.node = true;
  } else if (
    typeof process !== "undefined" &&
    process.env?.LAMBDA_TASK_ROOT &&
    process.env?.AWS_EXECUTION_ENV
  ) {
    info.awsLambda = true;
  } else if (hasWindow && "Deno" in window) {
    info.deno = true;
  } else if (typeof process !== "undefined" && process.versions?.bun) {
    info.bun = true;
  } else if (hasWindow) {
    info.browser = true;

    const ua = userAgent ? userAgent.toLowerCase() : "";
    if (ua.indexOf("edgios") !== -1) {
      info.edge = true;
      info.webkit = true;
    } else if (ua.indexOf("edge") !== -1) {
      info.edge = true;
      info.edgeHtml = true;
    } else if (ua.indexOf("edg") !== -1) {
      info.edge = true;
      info.blink = true;
    } else if (ua.indexOf("samsungbrowser") !== -1) {
      info.samsungBrowser = true;
      info.blink = true;
    } else if (ua.indexOf("android") !== -1 && ua.indexOf("; wv)") !== -1) {
      info.androidWebView = true;
      info.blink = true;
    } else if (ua.indexOf("msie") !== -1 || ua.indexOf("trident") !== -1) {
      info.msie = true;
      info.trident = true;
    } else if (ua.indexOf("opera") !== -1) {
      info.opera = true;
      info.presto = true;
    } else if (ua.indexOf("fxios") !== -1) {
      info.firefox = true;
      info.webkit = true;
    } else if (ua.indexOf("webkit") !== -1) {
      if (ua.indexOf("opr") !== -1) {
        info.opera = true;
        info.blink = true;
      } else if (ua.indexOf("crios") !== -1) {
        info.chrome = true;
        info.webkit = true;
      } else if (
        ua.indexOf("safari") !== -1 ||
        ua.indexOf("ipad") !== -1 ||
        ua.indexOf("iphone") !== -1
      ) {
        info.webkit = true;
        if (ua.indexOf("chrome") !== -1) {
          info.chrome = true;
        } else {
          info.safari = true;
        }
      } else if (ua.indexOf("chromium") !== -1) {
        info.blink = true;
      } else if (ua.indexOf("chrome") !== -1) {
        info.chrome = true;
        info.blink = true;
      } else {
        info.webkit = true;
      }
    } else if (ua.indexOf("firefox") !== -1) {
      info.firefox = true;
      info.gecko = true;
    } else if ("ActiveXObject" in window) {
      info.msie = true;
      info.trident = true;
    } else if (
      typeof document !== "undefined" &&
      "-ms-user-select" in document.documentElement.style
    ) {
      info.edge = true;
      if ("chrome" in window) {
        info.blink = true;
      } else {
        info.edgeHtml = true;
      }
    } else if (
      typeof document !== "undefined" &&
      "-moz-user-select" in document.documentElement.style
    ) {
      info.firefox = true;
      info.gecko = true;
    } else if ("opera" in window) {
      info.opera = true;
      if ("chrome" in window) {
        info.blink = true;
      } else {
        info.presto = true;
      }
    } else if ("chrome" in window) {
      info.chrome = true;
      info.blink = true;
    }

    if (ua.indexOf("ucbrowser") !== -1) {
      info.ucbrowser = true;
    } else if (ua.indexOf("googlebot") !== -1) {
      info.googlebot = true;
    } else if (ua.indexOf("line") !== -1) {
      info.line = true;
    } else if (ua.indexOf("yahoo") !== -1) {
      info.yahoo = true;
    }

    const ipad =
      ua.indexOf("ipad") !== -1 ||
      (ua.indexOf("macintosh") !== -1 &&
        ua.indexOf("applewebkit") !== -1 &&
        (platformNavigator?.maxTouchPoints ?? 0) > 1);
    const ipod = ua.indexOf("ipod") !== -1;
    const iphone = ua.indexOf("iphone") !== -1;

    if (ipad) {
      info.ios = true;
      info.ipad = true;
      info.tablet = true;
    } else if (ipod) {
      info.ios = true;
      info.ipod = true;
      info.mobile = true;
    } else if (iphone) {
      info.ios = true;
      info.iphone = true;
      info.mobile = true;
    } else if (ua.indexOf("macintosh") !== -1) {
      info.macos = true;
    } else if (ua.indexOf("windows") !== -1) {
      info.windows = true;
      if (ua.indexOf("phone") !== -1) {
        info.mobile = true;
      }
    } else if (ua.indexOf("android") !== -1) {
      info.android = true;
      if (ua.indexOf("tablet") !== -1 || ua.indexOf("mobile") === -1) {
        info.tablet = true;
      } else {
        info.mobile = true;
      }
    }
  }

  info.server = !info.browser;
  return info;
}
