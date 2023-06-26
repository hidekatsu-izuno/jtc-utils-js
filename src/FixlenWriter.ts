import { Encoder, createEncoder, isUnicodeEncoding } from "./encode/encoder.js"

export class FixlenWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: Encoder

  private columns: ((values: Array<any>, lineNumber: number) => number[])

  private bom: boolean
  private lineSeparator: Uint8Array

  private index: number = 0

  constructor(
    dest: WritableStream<Uint8Array>,
    options?: {
      columns?: number[] | ((values: Array<any>, lineNumber: number) => number[]),
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
      quoteAlways?: boolean
    },
  ) {
    const columns = options?.columns
    this.columns = !columns ? () => new Array<number>() :
      Array.isArray(columns) ? () => columns :
      columns

    const encoding = (options?.encoding ?? "utf-8").toLowerCase()
    this.bom = isUnicodeEncoding(encoding) ? options?.bom ?? false : false
    this.encoder = createEncoder(encoding)
    this.lineSeparator = this.encoder.encode(options?.lineSeparator ?? "\r\n")

    this.writer = dest.getWriter()
  }

  async write(values: any[]) {
    this.index++

    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }

    const columns = this.columns(values, this.index + 1)
    const buf = new Uint8Array(columns.reduce((prev, cur) => prev + cur, 0) + this.lineSeparator.length)

    let start = 0
    for (let i = 0; i < values.length; i++) {
      const len = columns[i] ?? 0
      if (len > 0 && values[i]) {
        let value = values[i].toString()
        if (len < value.length) {
          if (typeof values[i] === "number") {
            value = "0".repeat(value.length - len) + value
          } else {
            value = value + " ".repeat(value.length - len)
          }
        }
        const encoded = this.encoder.encode(value)
        if (encoded.length === len) {
          buf.set(encoded, start)
        } else {
          if (typeof values[i] === "number") {
            buf.set(encoded.subarray(0, len), start + encoded.length - len)
          } else {
            buf.set(encoded.subarray(0, len), start)
          }
        }
      }
      start += len
    }
    buf.set(this.lineSeparator, start)

    await this.writer.write(buf)
    this.index++
  }

  async close() {
    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }
    await this.writer.close()
  }
}
