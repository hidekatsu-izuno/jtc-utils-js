export class CsvReader {
  private reader: ReadableStreamDefaultReader<string>

  private fieldSeparator: string
  private skipEmptyLine: boolean

  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array>,
    options?: {
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      skipEmptyLine?: boolean
    }
  ) {
    if (typeof src === "string") {
      this.reader = new ReadableStream<string>({
        start(controller) {
          controller.enqueue(src)
          controller.close()
        }
      }).getReader()
    } else {
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

      const decoder = new TextDecoderStream(options?.encoding ?? "utf-8", {
        fatal: true,
        ignoreBOM: options?.bom ? !options?.bom : false,
      })

      this.reader = stream
        .pipeThrough(decoder)
        .getReader()
    }

    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.skipEmptyLine = options?.skipEmptyLine ?? false
  }

  async *read() {
    const re = new RegExp(`"((?:""|[^"])*)(?:$|"(${this.fieldSeparator}|\n|\r\n?|$))|(.*?)(${this.fieldSeparator}|\n|\r\n?)`, "y")
    let buf = ""
    let items = []

    while (true) {
      const { done, value } = await this.reader.read()
      if (!buf) {
        buf = value || ""
      } else if (value) {
        buf += value
      }

      if (buf) {
        let last = 0

        re.lastIndex = 0
        let m
        while ((m = re.exec(buf))) {
          last = re.lastIndex

          items.push(m[1] ? m[1].replaceAll('""', '"') : m[3] ?? "")
          if ((m[1] ? m[2] : m[4]) !== ",") {
            if (items.length > 0 || !this.skipEmptyLine) {
              yield items
            }
            items = []
          }
        }

        if (last < buf.length) {
          buf = buf.substring(last)
        } else {
          buf = ""
        }
      }

      if (done) {
        if (buf.length > 0 || items.length > 0) {
          items.push(buf)
          yield items
        }
        break
      }
    }
  }

  async close() {
    if (this.reader && !(await this.reader.closed)) {
      await this.reader.cancel()
    }
  }
}
