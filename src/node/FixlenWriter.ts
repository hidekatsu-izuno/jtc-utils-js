import { Writable } from "node:stream"
import { FileHandle } from "node:fs/promises"
import { FixlenWriterColumn, FixlenWriter as WebFixlenWriter } from "../FixlenWriter.js"
import { Charset } from "../charset/charset.js"

export class FixlenWriter extends WebFixlenWriter {
  constructor(
    dest: WritableStream<Uint8Array> | FileHandle | Writable,
    config: {
      columns: FixlenWriterColumn[],
      charset?: Charset,
      bom?: boolean,
      shift?: boolean,
      filler?: string,
      lineSeparator?: string,
      fatal?: boolean,
    },
  ) {
    let newDest
    if (dest instanceof WritableStream) {
      newDest = dest
    } else if (dest instanceof Writable) {
      newDest = Writable.toWeb(dest) as WritableStream<Uint8Array>
    } else {
      newDest = Writable.toWeb(dest.createWriteStream()) as WritableStream<Uint8Array>
    }
    super(newDest, config)
  }
}
