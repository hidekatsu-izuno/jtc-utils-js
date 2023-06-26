export class FixlenReader {
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private decoder: TextDecoder

  private lineLength: number
  private columns: (line: Uint8Array, lineNumber: number) => number[]

  private index: number = 0

  constructor(
    src: Uint8Array | Blob | ReadableStream<Uint8Array>,
    lineLength: number,
    options?: {
      encoding?: string,
      bom?: boolean,
      columns: number[] | ((line: Uint8Array, lineNumber: number) => number[])
    }
  ) {
    let stream
    if (src instanceof Uint8Array) {
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
    this.columns = !columns ? (line: Uint8Array, lineNumber: number) => [0] :
      Array.isArray(columns) ? (line: Uint8Array, lineNumber: number) => columns :
      columns

    this.decoder = new TextDecoder(options?.encoding ?? "utf-8", {
      fatal: true,
      ignoreBOM: options?.bom ? !options?.bom : false,
    })
    this.reader = stream.getReader()
  }

  async *read() {
    let done = false

    let buf = new Uint8Array()

    do {
      const readed = await this.reader.read()
      done = readed.done
      if (readed.value) {
        buf = buf.length > 0 ? this.concat(buf, readed.value) : readed.value
      }
      if (!done && buf.length < this.lineLength) {
        continue
      }

      const line = buf.slice(0, this.lineLength)
      if (done && line.length === 0) {
        break
      }

      buf = buf.subarray(this.lineLength)
      const columns = this.columns(line, this.index + 1)

      const items = []
      if (columns && columns.length > 0) {
        let last = 0
        for (let i = 0; i < columns.length; i++) {
          const start = columns[i] ?? last
          const end = columns[i + 1] ?? line.length
          if (start >= end) {
            items.push("")
          } else {
            items.push(this.decoder.decode(line.subarray(start, end)))
          }
          last = end
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
