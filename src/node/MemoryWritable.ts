import { Writable, WritableOptions } from "node:stream"
import iconv from "iconv-lite"

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
    const flag = /^(ascii|utf-?8|utf16le|ucs-?2|base64(url)?|latin1|binary|hex)$/i.test(encoding)

    if (flag) {
      return this.toBuffer().toString(encoding as BufferEncoding)
    } else {
      return iconv.decode(this.toBuffer(), encoding)
    }
  }
}
