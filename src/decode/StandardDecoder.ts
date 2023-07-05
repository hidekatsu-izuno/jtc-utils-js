import { Decoder, DecoderDecodeOptions } from "./decoder.js"

export class StandardDecoder implements Decoder {
  private decoder: TextDecoder

  constructor(encoding: string, options?: { fatal?: boolean }) {
    this.decoder = new TextDecoder(encoding, {
      fatal: options?.fatal ?? true
    })
  }

  decode(input: Uint8Array, options?: DecoderDecodeOptions) {
    return this.decoder.decode(input)
  }
}
