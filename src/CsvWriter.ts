import { Charset, CharsetEncoder } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"

export class CsvWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: CharsetEncoder

  private bom: boolean
  private fieldSeparator: string
  private lineSeparator: string
  private quoteAlways: boolean

  private current: number = 0

  constructor(
    dest: WritableStream<Uint8Array>,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
      quoteAlways?: boolean
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
    this.quoteAlways = options?.quoteAlways ?? false
  }

  async write(record: any[]) {
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
      if (this.quoteAlways || item.includes(this.fieldSeparator) || /[\r\n]/.test(item)) {
        str += '"' + item.replaceAll('"', '""') + '"'
      } else {
        str += item
      }
    }
    str += this.lineSeparator

    await this.writer.write(this.encoder.encode(str))
    this.current++
  }

  get index() {
    return this.current
  }

  async close() {
    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }
    await this.writer.close()
  }
}
