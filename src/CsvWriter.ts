import { TextEncoder as LegacyTextEncoder } from "@kayahr/text-encoding"

export class CsvWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: TextEncoder

  private bom: boolean = false
  private fieldSeparator: string
  private lineSeparator: string
  private quoteAlways: boolean

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
    if (encoding === "utf-8" || encoding === "utf8" || encoding === "unicode-1-1-utf-8") {
      this.encoder = new TextEncoder()
      this.bom = options?.bom ?? true
    } else {
      this.encoder = new LegacyTextEncoder(encoding)
      if (encoding === "utf-16" || encoding === "utf-16le" || encoding === "utf-16be") {
        this.bom = options?.bom ?? true
      }
    }

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
  }

  async close() {
    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }
    await this.writer.close()
  }
}
