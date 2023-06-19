import { CsvWriter as WebCsvWriter } from "../CsvWriter.js"
import { Writable } from "node:stream"

export class CsvWriter extends WebCsvWriter {
  constructor(
    src: WritableStream<Uint8Array> | Writable
  ) {
    super(src instanceof Writable ? Writable.toWeb(src) as WritableStream<Uint8Array> : src)
  }
}
