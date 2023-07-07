import { Readable } from "node:stream"
import { FileHandle } from "node:fs/promises"
import { FixlenReader as WebFixlenReader } from "../FixlenReader.js"
import { Charset } from "../../charset/charset.js"

export class FixlenReader extends WebFixlenReader {
  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array> | FileHandle | Readable,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fatal?: boolean,
    }
  ) {
    let newSrc
    if (typeof src === "string" || src instanceof Uint8Array || src instanceof Blob || src instanceof ReadableStream) {
      newSrc = src
    } else if (src instanceof Readable) {
      newSrc = Readable.toWeb(src) as ReadableStream<Uint8Array>
    } else {
      newSrc = Readable.toWeb(src.createReadStream()) as ReadableStream<Uint8Array>
    }
    super(newSrc, options)
  }
}
