export class CsvReader {
  private reader: ReadableStreamDefaultReader<string>

  constructor(
    src: Blob | ReadableStream<Uint8Array>,
    options?: {
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
    }
  ) {
    let stream
    if (src instanceof Blob) {
      stream= src.stream()
    } else {
      stream = src
    }

    const decoder = new TextDecoderStream(options?.encoding ?? "utf-8", {
      fatal: true,
      ignoreBOM: options?.bom ?? true,
    })

    this.reader = stream
      .pipeThrough(decoder)
      .getReader()
  }

  async *read() {
    while (true) {
      const { done, value } = await this.reader.read()
      if (value) {
        yield value
      }

      if (done) {
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
