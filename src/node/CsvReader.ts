import { CsvReader as WebCsvReader } from "../CsvReader.js"
import { Readable } from "node:stream"

export class CsvReader extends WebCsvReader {
  constructor(
    src: Blob | ReadableStream<Uint8Array> | Readable
  ) {
    super(src instanceof Readable ? Readable.toWeb(src) as ReadableStream<Uint8Array> : src)
  }
}
