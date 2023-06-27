import { createEncoder } from "./encoder/encoder.js"

declare type ColumnLayout = {
  start: number,
  end?: number,
  trim?: "left" | "right" | "both",
  type?: "number" | "int" | "uint" | "zoned" | "packed",
}

interface ReaderStatus {
  get lineNumber(): number
  value(layout: ColumnLayout): string
}

export class FixlenReader {
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private decoder: TextDecoder

  private lineLength: number
  private columns: (status: ReaderStatus) => ColumnLayout[]

  private index: number = 0

  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array>,
    lineLength: number,
    options?: {
      columns: ColumnLayout[] | ((status: ReaderStatus) => ColumnLayout[])
      encoding?: string,
      bom?: boolean,
      fatal?: boolean,
    }
  ) {
    const encoding = options?.encoding ? options.encoding.toLowerCase() : "utf-8"

    let stream
    if (typeof src === "string") {
      stream = new ReadableStream<Uint8Array>({
        start(controller) {
          const encoder = createEncoder(encoding)
          controller.enqueue(encoder.encode(src))
          controller.close()
        }
      })
    } else if (src instanceof Uint8Array) {
      stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(src)
          controller.close()
        }
      })
    } else if (src instanceof Blob) {
      stream = src.stream()
    } else {
      stream = src
    }

    this.lineLength = lineLength
    const columns = options?.columns
    this.columns = !columns ? (status: ReaderStatus) => [{ start: 0 }] :
      Array.isArray(columns) ? (status: ReaderStatus) => columns :
      columns

    this.decoder = new TextDecoder(encoding, {
      fatal: options?.fatal ?? true,
      ignoreBOM: options?.bom != null ? !options.bom : false,
    })
    this.reader = stream.getReader()
  }

  async *read() {
    let done = false

    let buf = new Uint8Array()
    let line: Uint8Array

    const status = <ReaderStatus> {
      get lineNumber() {
        return this.lineNumber
      },
      value: (layout: ColumnLayout) => {
        return this.decoder.decode(line.subarray(layout.start, layout.end))
      },
    }

    do {
      const readed = await this.reader.read()
      done = readed.done
      if (readed.value) {
        buf = buf.length > 0 ? this.concat(buf, readed.value) : readed.value
      }
      if (!done && buf.length < this.lineLength) {
        continue
      }

      line = buf.slice(0, this.lineLength)
      if (done && line.length === 0) {
        break
      }

      buf = buf.subarray(this.lineLength)
      const columns = this.columns(status)

      const items = new Array<string | number | null>()
      if (columns && columns.length > 0) {
        for (let i = 0; i < columns.length; i++) {
          const start = columns[i].start
          const end = columns[i].end ?? ((i + 1 < columns.length) ? columns[i + 1].start : line.length)
          const item = line.subarray(start, end)
          if (columns[i].type === "int" || columns[i].type === "uint") {
            const len = end - start
            if (len !== 1 && len !== 2 && len !== 4) {

            }
          } else {
            let text = ""
            if (start < end) {
              text = this.decoder.decode(item)
              switch (columns[i].trim) {
                case "left":
                  text = text.trimStart()
                  break
                case "right":
                  text = text.trimEnd()
                  break
                case "both":
                  text = text.trim()
                  break
              }
            }
            if (columns[i].type === "number") {
              let value = null
              if (text) {
                value = Number.parseFloat(text)
                if (!Number.isNaN(value)) {
                  value = text
                }
              }
              items.push(value)
            } else {
              items.push(text)
            }
          }
        }
      }
      if (items.length > 0) {
        yield items
      }
      this.index++
    } while (!done)
  }

  async close() {
    await this.reader.cancel()
  }

  private concat(a1: Uint8Array, a2: Uint8Array) {
    const result = new Uint8Array(a1.length + a2.length)
    result.set(a1, 0)
    result.set(a2, a1.length)
    return result
  }
}
