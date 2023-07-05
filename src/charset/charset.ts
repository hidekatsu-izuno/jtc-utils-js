export interface Charset {
  get name(): string
  createDecoder(options?: CharsetDecoderOptions): CharsetDecoder
  createEncoder(options?: CharsetEncoderOptions): CharsetEncoder
  isUnicode(): boolean
  isEbcdic(): boolean
}

export interface CharsetDecoder {
  decode(input: Uint8Array, options?: CharsetDecodeOptions): string
}

export declare type CharsetDecoderOptions = {
  fatal?: boolean,
  ignoreBOM?: boolean,
}

export declare type CharsetDecodeOptions = {
  shift: boolean
}

export interface CharsetEncoder {
  canEncode(str: string, options?: CharsetEncodeOptions): boolean

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array
}

export declare type CharsetEncoderOptions = {
  fatal?: boolean
}

export declare type CharsetEncodeOptions = {
  shift: boolean
}

export class StandardDecoder implements CharsetDecoder {
  private decoder: TextDecoder

  constructor(encoding: string, options?: CharsetDecoderOptions) {
    this.decoder = new TextDecoder(encoding, {
      fatal: options?.fatal ?? true,
      ignoreBOM: options?.ignoreBOM,
    })
  }

  decode(input: Uint8Array, options?: CharsetDecodeOptions) {
    return this.decoder.decode(input)
  }
}

export class StandardEncoder implements CharsetEncoder {
  private encoder = new TextEncoder()

  constructor(encoding: string, options?: CharsetEncoderOptions) {
    switch (encoding) {
      case "utf-8":
      case "utf8":
      case "unicode-1-1-utf-8":
        break
      default:
        throw new RangeError(`The encoding is invalid: ${encoding}`)
    }
  }

  canEncode(str: string, options?: CharsetEncodeOptions) {
    return true
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    return this.encoder.encode(str)
  }
}
