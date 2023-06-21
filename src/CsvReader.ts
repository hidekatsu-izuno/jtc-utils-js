export class CsvReader {
  private reader: ReadableStreamDefaultReader<Uint8Array>

  constructor(
    src: Blob | ReadableStream<Uint8Array>
  ) {
    if (src instanceof Blob) {
      this.reader = src.stream().getReader()
    } else {
      this.reader = src.getReader()
    }
  }

  async *read() {
    while (true) {
      const { done, value } = await this.reader.read()
      if (value) {
        yield await Promise.resolve(value)
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
