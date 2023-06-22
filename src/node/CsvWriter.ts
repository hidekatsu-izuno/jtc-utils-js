import { Writable } from "node:stream"
import { FileHandle } from "node:fs/promises"
import { CsvWriter as WebCsvWriter } from "../CsvWriter.js"

export class CsvWriter extends WebCsvWriter {
  constructor(
    dest: WritableStream<Uint8Array> | FileHandle | Writable,
    options?: {
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      skipEmptyLine?: boolean
    }
  ) {
    let newDest
    if (dest instanceof WritableStream) {
      newDest = dest
    } else if (dest instanceof Writable) {
      newDest = Writable.toWeb(dest) as WritableStream<Uint8Array>
    } else {
      newDest = Writable.toWeb(dest.createWriteStream()) as WritableStream<Uint8Array>
    }
    super(newDest, options)
  }
}
