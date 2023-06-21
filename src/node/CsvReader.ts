import { Readable } from "node:stream"
import { parse, Options } from 'csv-parse'
import { TextDecoderTransform } from "./TextDecoderTransfom.js"

export class CsvReader {
  private stream: Readable

  constructor(
    src: string | Uint8Array | Readable | ReadableStream<Uint8Array>,
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
    } else if (src instanceof ReadableStream) {
      stream = Readable.fromWeb(src as any)
    } else {
      stream = src
    }
    const popts: Options = {
      relax_column_count: true,
      delimiter: options?.fieldSeparator,
      record_delimiter: options?.lineSeparator,
    }
    if (options?.encoding != null) {
      if (Buffer.isEncoding(options.encoding)) {
        popts.encoding = options.encoding
      } else {
        stream = stream.pipe(new TextDecoderTransform(options.encoding))
      }
    }
    popts.bom = options?.bom != null ? options?.bom :
      options?.encoding != null ? /^(utf|ucs)/i.test(options.encoding) :
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
