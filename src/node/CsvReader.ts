import { Readable } from "node:stream"
import iconv from "iconv-lite"
import { parse, Options } from 'csv-parse'

export class CsvReader {
  private stream: Readable

  constructor(
    src: string | Uint8Array | Readable,
    options?: {
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
    }
  ) {
    let stream: NodeJS.ReadableStream
    if (typeof src === "string" || src instanceof Uint8Array) {
      stream = Readable.from(src)
    } else {
      stream = src
    }
    const popts: Options = {
      relax_column_count: true,
      delimiter: options?.fieldSeparator,
      record_delimiter: options?.lineSeparator,
    }
    if (options?.encoding != null) {
      if (/^(ascii|utf-?8|utf16le|ucs-?2|base64(url)?|latin1|binary|hex)$/i.test(options.encoding)) {
        popts.encoding = options.encoding.toLowerCase() as BufferEncoding
      } else {
        stream = stream.pipe(iconv.decodeStream(options.encoding))
      }
    }
    popts.bom = options?.bom != null ? options?.bom :
      options?.encoding != null ? /^(utf-?8|utf16le|ucs-?2)$/i.test(options.encoding) :
      true
    this.stream = stream.pipe(parse(popts))
  }

  async *read(): AsyncGenerator<string[]> {
    for await (const row of this.stream) {
      yield row
    }
  }

  async close() {
    this.stream.destroy()
  }
}
