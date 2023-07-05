import { EucjpEncoder } from "./EucjpEncoder.js"
import { Cp930Encoder } from "./Cp930Encoder.js"
import { Cp939Encoder } from "./Cp939Encoder.js"
import { Windows31jEncoder } from "./Windows31jEncoder.js"
import { Utf16beEncoder } from "./Utf16beEncoder.js"
import { Utf16leEncoder } from "./Utf16leEncoder.js"
import { StandardEncoder } from "./StandardEncoder.js"

export interface Encoder {
  canEncode(str: string, options?: EncoderEncodeOptions): boolean

  encode(str: string, options?: EncoderEncodeOptions): Uint8Array
}

export declare type EncoderOptions = {
  fatal?: boolean
}

export declare type EncoderEncodeOptions = {
  shift: boolean
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
  switch (encoding) {
    case "cp930":
    case "cp939":
      return true
    default:
      return false
  }
}

export function createEncoder(encoding: string, options?: EncoderOptions) {
  switch (encoding) {
    case "utf-8":
    case "utf8":
    case "unicode-1-1-utf-8":
      return new StandardEncoder("utf-8")
    case "utf-16":
    case "utf-16le":
      return new Utf16leEncoder()
    case "utf-16be":
      return new Utf16beEncoder()
    case "csshiftjis":
    case "ms_kanji":
    case "shift-jis":
    case "shift_jis":
    case "sjis":
    case "windows-31j":
    case "x-sjis":
      return new Windows31jEncoder(options)
    case "cseucpkdfmtjapanese":
    case "euc-jp":
    case "x-euc-jp":
      return new EucjpEncoder(options)
    case "cp930":
      return new Cp930Encoder(options)
    case "cp939":
      return new Cp939Encoder(options)
    default:
      throw new RangeError(`The encoding label provided ('${encoding}') is invalid.`)
  }
}
