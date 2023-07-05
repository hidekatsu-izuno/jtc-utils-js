import { Charset } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"
import { escapeRegExp } from "./escapeRegExp.js"

export class CsvReader {
  private reader: ReadableStreamDefaultReader<string>

  private fieldSeparator: string
  private skipEmptyLine: boolean

  private index: number = 0

  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array>,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fieldSeparator?: string,
      skipEmptyLine?: boolean,
      fatal?: boolean,
    }
  ) {
    const charset = options?.charset ?? utf8

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

      const decoder = new TextDecoderStream(charset.name, {
        fatal: options?.fatal ?? true,
        ignoreBOM: options?.bom != null ? !options.bom : false,
      })

      this.reader = stream
        .pipeThrough(decoder)
        .getReader()
    }

    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.skipEmptyLine = options?.skipEmptyLine ?? false
  }

  async *read(): AsyncGenerator<string[]> {
    const re = new RegExp(`\n|\r\n?|${escapeRegExp(this.fieldSeparator)}`, "g")

    let done = false
    let endsWithCR = false

    let buf = ""
    let pos = 0
    let quoted = false

    let items = []

    loop:
    do {
      const readed = await this.reader.read()
      done = readed.done

      if (readed.value) {
        if (endsWithCR && readed.value.startsWith("\n")) {
          readed.value = readed.value.substring(1)
          endsWithCR = false
        }
        if (readed.value.endsWith("\r")) {
          endsWithCR = true
        }

        buf = buf ? buf + readed.value : readed.value
      }

      while (pos < buf.length) {
        if (!quoted && buf.startsWith('"')) {
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
            quoted = true
            continue
          }
        }

        re.lastIndex = pos
        if (!re.test(buf)) {
          pos = buf.length
          continue loop
        }

        const item = buf.substring(0, re.lastIndex - (buf.endsWith("\r\n", re.lastIndex) ? 2 : 1))
        if (!buf.endsWith(this.fieldSeparator, re.lastIndex)) {
          if (item || items.length > 0 || quoted) {
            items.push(item)
          }
          if (items.length > 0 || !this.skipEmptyLine) {
            yield items
          }
          items = []
          this.index++
        } else {
          items.push(item)
        }
        buf = buf.substring(re.lastIndex)
        pos = 0
        quoted = false
      }

      if (done) {
        if (buf || items.length > 0 || quoted) {
          items.push(buf)
        }
        if (items.length > 0) {
          yield items
          this.index++
        }
      }
    } while (!done)
  }

  get lineNumber() {
    return this.index
  }

  async close() {
    await this.reader.cancel()
  }
}
