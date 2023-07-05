export interface Charset {
  createDecoder(options?: CharsetDecoderOptions): CharsetDecoder
  createEncoder(options?: CharsetEncoderOptions): CharsetEncoder
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
