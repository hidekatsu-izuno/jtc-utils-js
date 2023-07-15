import type { Readable } from "node:stream"
import type { FileHandle } from "node:fs/promises"
import { Charset } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"
import { escapeRegExp } from "./util/escapeRegExp.js"

export class CsvReader {
  private reader: Promise<ReadableStreamDefaultReader<string>>
  private fieldSeparator: string
  private skipEmptyLine: boolean
  private reSeparator: RegExp

  private endsWithCR = false
  private buf: string = ""
  private index: number = 0

  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array> | FileHandle | Readable,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fieldSeparator?: string,
      skipEmptyLine?: boolean,
      fatal?: boolean,
    }
  ) {
    const charset = options?.charset ?? utf8
    this.fieldSeparator = options?.fieldSeparator ?? ","
    this.skipEmptyLine = options?.skipEmptyLine ?? false
    this.reSeparator = new RegExp(`\n|\r\n?|${escapeRegExp(this.fieldSeparator)}`, "g")

    if (typeof src === "string") {
      this.reader = Promise.resolve(new ReadableStream<string>({
        start(controller) {
          controller.enqueue(src)
          controller.close()
        }
      }).getReader())
    } else {
      let stream: Promise<ReadableStream<Uint8Array>>
      if (src instanceof Uint8Array) {
        stream = Promise.resolve(new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(src)
            controller.close()
          }
        }))
      } else if (src instanceof Blob) {
        stream = Promise.resolve(src.stream())
      } else if (src instanceof ReadableStream) {
        stream = Promise.resolve(src)
      } else if (typeof window === "undefined") {
        stream = (async () => {
          const { Readable } = await import("node:stream")
          if (src instanceof Readable) {
            return Readable.toWeb(src)
          } else {
            return Readable.toWeb((src as FileHandle).createReadStream())
          }
        })() as Promise<ReadableStream<Uint8Array>>
      } else {
        throw new TypeError(`Unsuppoted source: ${src}`)
      }

      const decoder = charset.createDecoder({
        fatal: options?.fatal ?? true,
        ignoreBOM: options?.bom != null ? !options.bom : false,
      })

      this.reader = stream.then(value => value
        .pipeThrough(new TransformStream({
          transform(chunk, controller) {
            controller.enqueue(decoder.decode(chunk, { stream: true }))
          },
          flush() {
            decoder.decode(new Uint8Array())
          }
        }))
        .getReader())
    }
  }

  async read(): Promise<string[] | undefined> {
    const items = []

    let buf = this.buf
    let pos = 0
    let quoted = false
    let done = false

    const reader = await this.reader
    loop:
    do {
      const readed = await reader.read()
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
            const unquoted = buf.substring(1, lpos).replace(/""/g, '"')
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
    const reader = await this.reader
    await reader.cancel()
  }
}
