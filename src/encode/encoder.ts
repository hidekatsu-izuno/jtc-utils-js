import { ShiftJISEncoder } from "./ShiftJISEncoder.js"
import { Utf8Encoder } from "./Utf8Encoder.js"

export interface Encoder {
  canEncode(str: string): boolean

  encode(str: string): Uint8Array
}

export function isUnicodeEncoding(encoding: string) {
  switch (encoding) {
    case "utf-8":
    case "utf8":
    case "unicode-1-1-utf-8":
    case "utf-16":
    case "utf-16le":
    case "utf-16be":
      return true
    default:
      return false
  }
}

export function createEncoder(encoding: string) {
  switch (encoding) {
    case "utf-8":
    case "utf8":
    case "unicode-1-1-utf-8":
      return new Utf8Encoder()
    case "csshiftjis":
    case "ms_kanji":
    case "shift-jis":
    case "shift_jis":
    case "sjis":
    case "windows-31j":
    case "x-sjis":
      return new ShiftJISEncoder()
    default:
      throw new RangeError(`The encoding label provided ('${encoding}') is invalid.`)
  }
}
