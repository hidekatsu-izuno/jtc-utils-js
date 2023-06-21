export class CsvWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>

  constructor(
    dest: WritableStream<Uint8Array>
  ) {
    this.writer = dest.getWriter()
  }

  async write(items: string[]) {
    for (let i = 0; i < items.length; i++) {
      await this.writer.write()
    }
  }

  async close() {
    if (this.writer && !(await this.writer.closed)) {
      await this.writer.close()
    }
  }
}
