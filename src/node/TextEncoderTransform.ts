import { Transform, TransformOptions, TransformCallback } from "node:stream"
import { TextEncoder } from "@kayahr/text-encoding"

export class TextEncoderTransform extends Transform {
  private encoder: TextEncoder

  constructor(encoding: string, options?: TransformOptions) {
    super(options)
    this.encoder = new TextEncoder(encoding)
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    try {
      if (encoding !== "buffer") {
        throw new TypeError("chunk must be buffer.")
      }

      const str = this.encoder.encode(chunk)
      callback(undefined, str)
    } catch (err) {
      callback(err as Error)
    }
  }
}
