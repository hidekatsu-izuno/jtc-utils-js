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
    const re = new RegExp(`\n|\r\n?|${this.fieldSeparator}`, "g")

    let done = false
    let isCrEnd = false

    let buf = ""
    let pos = 0

    let items = []

    loop:
    do {
      const readed = await this.reader.read()
      done = readed.done

      if (readed.value) {
        if (isCrEnd && readed.value.startsWith("\n")) {
          readed.value = readed.value.substring(1)
          isCrEnd = false
        }
        if (readed.value.endsWith("\r")) {
          isCrEnd = true
        }

        buf = buf ? buf + readed.value : readed.value
      }

      while (pos < buf.length) {
        if (buf.startsWith('"')) {
          if (pos === 0) {
            pos = 1
          }
          const lpos = buf.indexOf('"', pos)
          if (lpos === -1) {
            pos = buf.length
            continue loop
          } else if (buf.startsWith('"', lpos + 1)) {
            pos = lpos + 2
            continue
          } else {
            const unquoted = buf.substring(1, lpos).replaceAll('""', '"')
            buf = unquoted + buf.substring(lpos + 1)
            pos = unquoted.length
            continue
          }
        }

        re.lastIndex = pos
        if (re.test(buf)) {
          const item = buf.substring(0, re.lastIndex - (buf.endsWith("\r\n", re.lastIndex) ? 2 : 1))
          if (!this.skipEmptyLine || item || items.length > 0) {
            if (!buf.endsWith(this.fieldSeparator, re.lastIndex)) {
              if (item || items.length > 0) {
                items.push(item)
              }
              yield items
              items = []
            } else {
              items.push(item)
            }
          }
          buf = buf.substring(re.lastIndex)
          pos = 0
        } else {
          pos = buf.length
          continue loop
        }
      }

      if (done) {
        if (buf || items.length > 0) {
          items.push(buf)
        }
        if (items.length > 0) {
          yield items
        }
      }
    } while (!done)
  }

  async close() {
    if (this.reader && !(await this.reader.closed)) {
      await this.reader.cancel()
    }
  }
}
