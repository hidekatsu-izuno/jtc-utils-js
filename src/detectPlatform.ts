export declare type PlatformInfo = {
  // server environment
  server: boolean,
  node: boolean,
  deno: boolean,
  cloudflareWorkers: boolean,
  awsLambda: boolean,

  // browser environment
  browser: boolean,
  ucbrowser: boolean,
  edge: boolean,
  msie: boolean,
  chrome: boolean,
  googlebot: boolean,
  safari: boolean,
  firefox: boolean,
  opera: boolean,
  line: boolean,
  yahoo: boolean,

  // engine
  webkit: boolean,
  trident: boolean,
  edgeHtml: boolean,
  blink: boolean,
  gecko: boolean,

  // os
  windows: boolean,
  macos: boolean,
  android: boolean,
  ios: boolean,

  // machine
  tablet: boolean,
  mobile: boolean,
}

export function detectPlatform(userAgent?: string) {
  const info: PlatformInfo = {
    server: false,
    node: false,
    deno: false,
    cloudflareWorkers: false,
    awsLambda: false,

    // browser environment
    browser: false,
    ucbrowser: false,
    edge: false,
    msie: false,
    chrome: false,
    googlebot: false,
    safari: false,
    firefox: false,
    opera: false,
    line: false,
    yahoo: false,

    // engine
    webkit: false,
    trident: false,
    edgeHtml: false,
    blink: false,
    gecko: false,

    // os
    windows: false,
    macos: false,
    android: false,
    ios: false,

    // machine
    tablet: false,
    mobile: false,
  }

  if (!userAgent && typeof navigator !== "undefined") {
    userAgent = navigator.userAgent
  }

  if (userAgent === "Cloudflare-Workers") {
    info.cloudflareWorkers = true
  } else if (typeof process !== "undefined" && process.versions?.node != null) {
    info.node = true
  } else if (typeof process !== "undefined" && process.env?.LAMBDA_TASK_ROOT && process.env?.AWS_EXECUTION_ENV) {
    info.awsLambda = true
  } else if (typeof window !== "undefined" && "Deno" in window) {
    info.deno = true
  } else if (typeof window !== "undefined") {
    info.browser = true

    const ua = userAgent ? userAgent.toLowerCase() : ""
    if (ua.indexOf('ucbrowser') !== -1) {
      info.ucbrowser = true
    } else if (ua.indexOf('edge') !== -1) {
      info.edge = true
      info.edgeHtml = true
    } else if (ua.indexOf('edg') !== -1) {
      info.edge = true
      info.webkit = true
      info.blink = true
    } else if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) {
      info.msie = true
      info.trident = true
    } else if (ua.indexOf('opera') !== -1) {
      info.opera = true
    } else if (ua.indexOf('webkit') !== -1) {
      info.webkit = true
      if (ua.indexOf('opr') !== -1) {
        info.opera = true
        info.blink = true
      } else if (ua.indexOf('chromium') !== -1) {
        info.blink = true
      } else if (ua.indexOf('chrome') !== -1) {
        info.chrome = true
        info.blink = true
      } else if (ua.indexOf('fxios') !== -1) {
        info.firefox = true
      } else if (ua.indexOf('safari') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('iphone') !== -1) {
        info.safari = true
      }
    } else if (ua.indexOf('firefox') !== -1) {
      info.firefox = true
      info.gecko = true
    } else if ('ActiveXObject' in window) {
      info.msie = true
      info.trident = true
    } else if ('-ms-user-select' in document.documentElement.style) {
      info.edge = true
    } else if ('-moz-user-select' in document.documentElement.style) {
      info.firefox = true
    } else if ("opera" in window) {
      info.opera = true
    } else if ("chrome" in window) {
      info.chrome = true
      info.webkit = true
      info.blink = true
    }

    if (ua.indexOf('googlebot') !== -1) {
      info.googlebot = true
    } else if (ua.indexOf('line') !== -1) {
      info.line = true
    } else if (ua.indexOf('yahoo') !== -1) {
      info.yahoo = true
    }

    if (ua.indexOf('ipad') !== -1) {
      info.ios = true
      info.tablet = true
    } else if (ua.indexOf('iphone') !== -1) {
      info.ios = true
      info.mobile = true
    } else if (ua.indexOf('macintosh') !== -1) {
      info.macos = true
    } else if (ua.indexOf('windows') !== -1) {
      info.windows = true
      if (ua.indexOf('phone') !== -1) {
        info.mobile = true
      }
    } else if (ua.indexOf('android') !== -1) {
      info.android = true
      if (ua.indexOf('tablet') !== -1) {
        info.tablet = true
      } else {
        info.mobile = true
      }
    }
  }

  info.server = !info.browser
  return info
}
