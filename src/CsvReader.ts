import { Charset } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"
import { escapeRegExp } from "./util/escapeRegExp.js"

export class CsvReader {
  private reader: ReadableStreamDefaultReader<string>

  private fieldSeparator: string
  private skipEmptyLine: boolean

  private reSeparator: RegExp
  private endsWithCR = false
  private buf: string = ""

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

      const decoder = charset.createDecoder({
        fatal: options?.fatal ?? true,
        ignoreBOM: options?.bom != null ? !options.bom : false,
      })

      this.reader = stream
        .pipeThrough(new TransformStream({
          transform(chunk, controller) {
            controller.enqueue(decoder.decode(chunk, { stream: true }))
          },
          flush() {
            decoder.decode(new Uint8Array())
          }
        }))
        .getReader()
    }

    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.skipEmptyLine = options?.skipEmptyLine ?? false

    this.reSeparator = new RegExp(`\n|\r\n?|${escapeRegExp(this.fieldSeparator)}`, "g")
  }

  async read(): Promise<string[] | undefined> {
    const items = []

    let buf = this.buf
    let pos = 0
    let quoted = false
    let done = false
    loop:
    do {
      const readed = await this.reader.read()
      done = readed.done

      if (readed.value) {
        let value = readed.value
        if (this.endsWithCR && value.startsWith("\n")) {
          value = value.substring(1)
          this.endsWithCR = false
        }
        if (value.endsWith("\r")) {
          this.endsWithCR = true
        }
        buf = buf ? buf + value : value
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

        this.reSeparator.lastIndex = pos
        if (!this.reSeparator.test(buf)) {
          pos = buf.length
          continue loop
        }

        const item = buf.substring(0, this.reSeparator.lastIndex - (buf.endsWith("\r\n", this.reSeparator.lastIndex) ? 2 : 1))
        if (!buf.endsWith(this.fieldSeparator, this.reSeparator.lastIndex)) {
          if (item || items.length > 0 || quoted) {
            items.push(item)
          }
          if (items.length > 0 || !this.skipEmptyLine) {
            this.buf = buf.substring(this.reSeparator.lastIndex)
            this.index++
            return items
          }
        } else {
          items.push(item)
        }
        buf = buf.substring(this.reSeparator.lastIndex)
        pos = 0
        quoted = false
      }

      if (done) {
        if (buf || items.length > 0 || quoted) {
          items.push(buf)
        }
        if (items.length > 0) {
          this.buf = ""
          this.index++
          return items
        }
      }
    } while (buf || !done)
  }

  async* [Symbol.asyncIterator](): AsyncGenerator<string[]> {
    let record: string[] | undefined
    while (record = await this.read()) {
      yield record
    }
  }

  get count() {
    return this.index
  }

  async close() {
    await this.reader.cancel()
  }
}
