import { Readable } from "node:stream"
import { FileHandle } from "node:fs/promises"
import { FixlenReader as WebFixlenReader } from "../FixlenReader.js"

export class CsvReader extends WebFixlenReader {
  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array> | FileHandle | Readable,
    lineLength: number,
    options?: {
      encoding?: string,
      bom?: boolean,
      columns: number[] | ((line: Uint8Array, lineNumber: number) => number[])
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
    super(newSrc, lineLength, options)
  }
}
