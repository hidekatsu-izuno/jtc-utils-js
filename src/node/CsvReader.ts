import { Readable } from "node:stream"
import { FileHandle } from "node:fs/promises"
import { CsvReader as WebCsvReader } from "../CsvReader.js"
import { Charset } from "../charset/charset.js"

export class CsvReader extends WebCsvReader {
  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array> | FileHandle | Readable,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fieldSeparator?: string,
      skipEmptyLine?: boolean,
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
