import { Charset, CharsetEncoder } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"

export class CsvWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: CharsetEncoder

  private bom: boolean
  private fieldSeparator: string
  private lineSeparator: string
  private quoteAll: boolean

  private index: number = 0

  constructor(
    dest: WritableStream<Uint8Array>,
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
    this.bom = charset.isUnicode() ? options?.bom ?? true : false
    this.encoder = charset.createEncoder({
      fatal: options?.fatal ?? true
    })

    this.writer = dest.getWriter()
    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.lineSeparator = options?.lineSeparator ?? "\r\n"
    this.quoteAll = options?.quoteAll ?? false
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
    await this.writer.write(this.encoder.encode(str))
  }

  get count() {
    return this.index
  }

  async close() {
    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }
    await this.writer.close()
  }
}
