import { TextEncoder } from "@kayahr/text-encoding"

export class CsvWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: TextEncoder

  private fieldSeparator: string
  private lineSeparator: string

  constructor(
    dest: WritableStream<Uint8Array>,
    options?: {
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
    },
  ) {
    this.writer = dest.getWriter()
    this.encoder = new TextEncoder(options?.encoding ?? "utf-8")

    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.lineSeparator = options?.lineSeparator ?? "\r\n"
  }

  async write(items: string[]) {
    let str = ""
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (i > 0) {
        str += this.fieldSeparator
      }
      if (item.includes(this.fieldSeparator) || /[\r\n]/.test(item)) {
        str += '"' + item.replaceAll('"', '""') + '"'
      } else {
        str += item
      }
    }
    str += this.lineSeparator

    await this.writer.write(this.encoder.encode(str))
  }

  async close() {
    if (this.writer && !(await this.writer.closed)) {
      await this.writer.close()
    }
  }
}
