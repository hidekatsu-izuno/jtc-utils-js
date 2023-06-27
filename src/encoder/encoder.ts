import { EucJPEncoder } from "./EucJPEncoder.js"
import { ShiftJISEncoder } from "./ShiftJISEncoder.js"
import { Utf16BeEncoder } from "./Utf16BeEncoder.js"
import { Utf16LeEncoder } from "./Utf16LeEncoder.js"
import { Utf8Encoder } from "./Utf8Encoder.js"

export interface Encoder {
  canEncode(str: string): boolean

  encode(str: string): Uint8Array
}

export declare type EncoderOptions = {
  fatal?: boolean
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

export function isEbcdicEncoding(encoding: string) {
  return false
}

export function createEncoder(encoding: string, options?: EncoderOptions) {
  switch (encoding) {
    case "utf-8":
    case "utf8":
    case "unicode-1-1-utf-8":
      return new Utf8Encoder()
    case "utf-16":
    case "utf-16le":
      return new Utf16LeEncoder()
    case "utf-16be":
      return new Utf16BeEncoder()
    case "csshiftjis":
    case "ms_kanji":
    case "shift-jis":
    case "shift_jis":
    case "sjis":
    case "windows-31j":
    case "x-sjis":
      return new ShiftJISEncoder(options)
    case "cseucpkdfmtjapanese":
    case "euc-jp":
    case "x-euc-jp":
      return new EucJPEncoder(options)
    default:
      throw new RangeError(`The encoding label provided ('${encoding}') is invalid.`)
  }
}
