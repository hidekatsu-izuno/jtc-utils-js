export class CsvReader {
  private src: ReadableStream<Uint8Array>
  private reader?: ReadableStreamDefaultReader<Uint8Array>
  private buf = new Uint8Array(1024)

  constructor(
    src: Blob | ReadableStream<Uint8Array>
  ) {
    if (src instanceof Blob) {
      this.src = src.stream()
    } else {
      this.src = src
    }
  }

  async *read() {
    let r = this.reader
    if (!r) {
      r = this.src.getReader()
      this.reader = r
    }

    while (true) {
      const { done, value } = await r.read();
      if (done) {
        break
      }

      yield await Promise.resolve(value)
    }
  }

  async close() {
    if (this.reader && !(await this.reader.closed)) {
      await this.reader.cancel()
    }
  }
}
