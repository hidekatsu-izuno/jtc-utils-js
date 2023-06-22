export class MemoryWritableStream extends WritableStream {
  private buf: Array<Uint8Array>

  constructor() {
    const buf: Array<Uint8Array> = []
    super({
      write(chunk: Uint8Array) {
        buf.push(chunk)
      }
    })
    this.buf = buf
  }

  toUint8Array() {
    let len = 0
    for (const u8a of this.buf) {
      len += u8a.length
    }
    const result = new Uint8Array(len)
    let pos = 0
    for (const u8a of this.buf) {
      result.set(u8a, pos)
      pos += u8a.length
    }
    return result
  }

  toString(encoding: string = "uft-8") {
    return new TextDecoder(encoding, { ignoreBOM: true }).decode(this.toUint8Array())
  }
}
