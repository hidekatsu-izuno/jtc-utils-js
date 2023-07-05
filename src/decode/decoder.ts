export interface Decoder {
  canDecode(input: Uint8Array, options?: DecoderDecodeOptions): boolean

  decode(input: Uint8Array, options?: DecoderDecodeOptions): string
}

export declare type DecoderOptions = {
  fatal?: boolean,
  ignoreBOM?: boolean,
}

export declare type DecoderDecodeOptions = {
  shift: boolean
}
