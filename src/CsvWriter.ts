export class CsvWriter {
  private dest: WritableStream<Uint8Array>
  private writer?: WritableStreamDefaultWriter<Uint8Array>
  private buf = new Uint8Array(1024)

  constructor(
    dest: WritableStream<Uint8Array>
  ) {
    this.dest = dest
  }

  async write(items: string[]) {
    let w = this.writer
    if (!w) {
      w = this.dest.getWriter()
      this.writer = w
    }

    for (let i = 0; i < items.length; i++) {
      await w.write()
    }
  }

  async close() {
    if (this.writer && !(await this.writer.closed)) {
      await this.writer.close()
    }
  }
}
