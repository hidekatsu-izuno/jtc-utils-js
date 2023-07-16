import type { Writable } from "node:stream"
import type { FileHandle } from "node:fs/promises"
import { Charset, CharsetEncoder } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"

export class CsvWriter {
  private writer: Promise<WritableStreamDefaultWriter<Uint8Array>>
  private encoder: CharsetEncoder

  private bom: boolean
  private fieldSeparator: string
  private lineSeparator: string
  private quoteAll: boolean

  private index: number = 0

  constructor(
    dest: WritableStream<Uint8Array> | FileHandle | Writable,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
      quoteAll?: boolean
      fatal?: boolean,
    },
  ) {
    const charset = options?.charset ?? utf8
    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.lineSeparator = options?.lineSeparator ?? "\r\n"
    this.quoteAll = options?.quoteAll ?? false
    this.bom = charset.isUnicode() ? options?.bom ?? true : false
    this.encoder = charset.createEncoder({
      fatal: options?.fatal ?? true
    })

    let stream: Promise<WritableStream<Uint8Array>>
    if (dest instanceof WritableStream) {
      stream = Promise.resolve(dest)
    } else if (typeof window === "undefined") {
      stream = (async () => {
        const { Writable } = await import("node:stream")
        if (dest instanceof Writable) {
          return Writable.toWeb(dest)
        } else {
          return Writable.toWeb((dest as FileHandle).createWriteStream())
        }
      })() as Promise<WritableStream<Uint8Array>>
    } else {
      throw new TypeError(`Unsuppoted destination: ${dest}`)
    }

    this.writer = stream.then(value => value.getWriter())
  }

  async write(record: any[], options?: {
    quoteAll?: boolean,
  }) {
    const quoteAll = options?.quoteAll ?? this.quoteAll

    let str = ""
    if (this.bom) {
      str = "\uFEFF"
      this.bom = false
    }

    for (let i = 0; i < record.length; i++) {
      const item = record[i] ? record[i].toString() : ""
      if (i > 0) {
        str += this.fieldSeparator
      }
      if (quoteAll || item.includes(this.fieldSeparator) || /[\r\n]/.test(item)) {
        str += '"' + item.replaceAll('"', '""') + '"'
      } else {
        str += item
      }
    }
    str += this.lineSeparator

    this.index++
    const writer = await this.writer
    await writer.write(this.encoder.encode(str))
  }

  get count() {
    return this.index
  }

  async close() {
    const writer = await this.writer
    if (this.bom) {
      await writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }
    await writer.close()
  }
}
