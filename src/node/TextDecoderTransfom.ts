import { Transform, TransformOptions } from "node:stream"
import { TransformCallback } from "stream"

export class TextDecoderTransform extends Transform {
  private decoder: TextDecoder

  constructor(encoding: string, options?: TransformOptions) {
    super(options)
    this.decoder = new TextDecoder(encoding)
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    try {
      if (encoding !== "buffer") {
        throw new TypeError("chunk must be buffer.")
      }

      const str = this.decoder.decode(chunk, { stream: true })
      callback(undefined, str)
    } catch (err) {
      callback(err as Error)
    }
  }

  _flush(callback: TransformCallback): void {
    const str = this.decoder.decode(undefined, { stream: false })
    callback(undefined, str ? str : undefined)
  }
}
