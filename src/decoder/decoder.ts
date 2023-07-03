export interface Decoder {
  decode(input: Uint8Array): string
}

export declare type DecoderOptions = {
  fatal?: boolean,
  ignoreBOM?: boolean,
}
