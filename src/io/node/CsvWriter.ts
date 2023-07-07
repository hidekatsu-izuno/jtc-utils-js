import { Writable } from "node:stream"
import { FileHandle } from "node:fs/promises"
import { CsvWriter as WebCsvWriter } from "../CsvWriter.js"
import { Charset } from "../../charset/charset.js"

export class CsvWriter extends WebCsvWriter {
  constructor(
    dest: WritableStream<Uint8Array> | FileHandle | Writable,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
      quoteAlways?: boolean
      fatal?: boolean,
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
