import { Writable, WritableOptions } from "node:stream"

export class MemoryWritable extends Writable {
  private buf: Array<Uint8Array> = []

  constructor(options?: WritableOptions) {
    super(options)
  }

  _write(chunk: any, encoding: string, callback: (error?: Error | null | undefined) => void): void {
    if (encoding === "buffer") {
      this.buf.push(chunk)
    } else {
      this.buf.push(Buffer.from(chunk, encoding as BufferEncoding))
    }
    callback()
  }

  toBuffer() {
    return Buffer.concat(this.buf)
  }

  toString(encoding: string = "uft-8") {
    if (Buffer.isEncoding(encoding)) {
      return this.toBuffer().toString(encoding)
    } else {
      return new TextDecoder(encoding).decode(this.toBuffer())
    }
  }
}
