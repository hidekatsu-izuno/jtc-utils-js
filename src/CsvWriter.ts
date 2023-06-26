import { Encoder, createEncoder, isUnicodeEncoding } from "./encode/encoder.js"

export class CsvWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: Encoder

  private bom: boolean
  private fieldSeparator: string
  private lineSeparator: string
  private quoteAlways: boolean

  private index: number = 0

  constructor(
    dest: WritableStream<Uint8Array>,
    options?: {
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
      quoteAlways?: boolean
    },
  ) {
    const encoding = (options?.encoding ?? "utf-8").toLowerCase()
    this.bom = isUnicodeEncoding(encoding) ? options?.bom ?? true : false
    this.encoder = createEncoder(encoding)

    this.writer = dest.getWriter()
    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.lineSeparator = options?.lineSeparator ?? "\r\n"
    this.quoteAlways = options?.quoteAlways ?? false
  }

  async write(items: any[]) {
    let str = ""
    if (this.bom) {
      str = "\uFEFF"
      this.bom = false
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i] ? items[i].toString() : ""
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
    this.index++
  }

  get lineNumber() {
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
