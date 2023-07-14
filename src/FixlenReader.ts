import { Charset, CharsetDecoder } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"

export declare type FixlenReaderLayout = {
  lineLength: number,
  columns: FixlenReaderColumn[] | ((line: FixlenLineDecoder, index: number) => FixlenReaderColumn[]),
}

export declare type FixlenReaderColumn = {
  start: number,
  length?: number,
  shift?: boolean,
  trim?: "left" | "right" | "both",
  type?: "decimal" | "int-le" | "int-be" | "uint-le" | "uint-be" | "zoned" | "packed",
}

export interface FixlenLineDecoder {
  decode(layout: FixlenReaderColumn): string
}

export class FixlenReader {
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private decoder: CharsetDecoder
  private ebcdic: boolean
  private fatal: boolean

  private index: number = 0

  constructor(
    src: string | Uint8Array | Blob | ReadableStream<Uint8Array>,
    options?: {
      charset?: Charset,
      bom?: boolean,
      fatal?: boolean,
    }
  ) {
    const charset = options?.charset ?? utf8
    this.ebcdic = charset.isEbcdic()
    this.fatal = options?.fatal ?? true

    let stream
    if (typeof src === "string") {
      stream = new ReadableStream<Uint8Array>({
        start(controller) {
          const encoder = charset.createEncoder()
          controller.enqueue(encoder.encode(src))
          controller.close()
        }
      })
    } else if (src instanceof Uint8Array) {
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

    this.decoder = charset.createDecoder({
      fatal: this.fatal,
      ignoreBOM: options?.bom != null ? !options.bom : false,
    })
    this.reader = stream.getReader()
  }

  async *read(layout: FixlenReaderLayout): AsyncGenerator<(string | number | BigInt | null)[]> {
    let done = false

    let buf = new Uint8Array()
    let line: Uint8Array

    const lineDecoder = <FixlenLineDecoder> {
      decode: (layout: FixlenReaderColumn) => {
        return this.decoder.decode(line.subarray(
          layout.start,
          layout.length ? layout.start + layout.length : undefined,
        ))
      },
    }

    do {
      const readed = await this.reader.read()
      done = readed.done
      if (readed.value) {
        buf = buf.length > 0 ? this.concat(buf, readed.value) : readed.value
      }
      if (!done && buf.length < layout.lineLength) {
        continue
      }

      line = buf.slice(0, layout.lineLength)
      if (done && line.length === 0) {
        break
      }

      buf = buf.subarray(layout.lineLength)
      const cols = Array.isArray(layout.columns) ? layout.columns : layout.columns(lineDecoder, this.index + 1)

      const items = new Array<string | number | BigInt>()
      if (cols && cols.length > 0) {
        for (let i = 0; i < cols.length; i++) {
          const start = cols[i].start
          const clen = cols[i].length
          const end = clen != null ? start + clen : ((i + 1 < cols.length) ? cols[i + 1].start : line.length)
          const type = cols[i].type
          const shift = cols[i].shift
          if (!type || type === "decimal") {
            let text = ""
            if (start < end) {
              if (this.ebcdic && shift) {

              } else {
                text = this.decoder.decode(line.subarray(start, end))
              }
              switch (cols[i].trim) {
                case "left":
                  text = text.trimStart()
                  break
                case "right":
                  text = text.trimEnd()
                  break
                case "both":
                  text = text.trim()
                  break
              }
            }
            if (type === "decimal") {
              const value = Number.parseFloat(text)
              if (this.fatal && Number.isNaN(value)) {
                throw new RangeError(`tInvalid number: ${text}`)
              }
              items.push(value)
            } else {
              items.push(text)
            }
          } else if (type.startsWith("int-")) {
            const view = new DataView(line.buffer)
            const littleEndien = type === "int-le"
            const len = end - start
            if (len === 4) {
              items.push(view.getInt32(start, littleEndien))
            } else if (len === 2) {
              items.push(view.getInt16(start, littleEndien))
            } else if (len === 1) {
              items.push(view.getInt8(start))
            } else if (this.fatal) {
              throw new RangeError("byte length must be 1, 2 or 4.")
            } else {
              items.push(Number.NaN)
            }
          } else if (type.startsWith("uint-")) {
            const view = new DataView(line.buffer)
            const littleEndien = type === "uint-le"
            const len = end - start
            if (len === 4) {
              items.push(view.getUint32(start, littleEndien))
            } else if (len === 2) {
              items.push(view.getUint16(start, littleEndien))
            } else if (len === 1) {
              items.push(view.getUint8(start))
            } else if (this.fatal) {
              throw new RangeError("byte length must be 1, 2 or 4.")
            } else {
              items.push(Number.NaN)
            }
          } else if (type === "zoned") {
            try {
              let num = 0
              for (let i = start; i < end; i++) {
                if (i + 1 === end) {
                  const h4 = (line[i] >>> 4) & 0xF
                  if (h4 > 0x9) {
                    throw new RangeError("high 4 bit at last must be A-F.")
                  }
                  if (h4 === 0xB || h4 === 0xD) {
                    num = -1 * num
                  }
                }
                const l4 = line[i] & 0xF
                if (l4 > 0x9) {
                  throw new RangeError("low 4 bit must be decimal.")
                }
                num = num *10 + l4
              }
              items.push(num)
            } catch (err) {
              if (this.fatal) {
                throw err
              } else {
                items.push(Number.NaN)
              }
            }
          } else if (type === "packed") {
            try {
              let num = 0
              for (let i = start; i < end; i++) {
                const h4 = (line[i] >> 8) & 0xF
                if (h4 > 0x9) {
                  throw new RangeError("high 4 bit must be decimal.")
                }
                num = num * 10 + h4

                const l4 = line[i] & 0xF
                if (i + 1 === end) {
                  if (l4 > 0x9) {
                    throw new RangeError("low 4 bit at last must be A-F.")
                  }
                  if (l4 === 0xB || l4 === 0xD) {
                    num = -1 * num
                  }
                } else {
                  if (l4 > 0x9) {
                    throw new RangeError("low 4 bit must be decimal.")
                  }
                  num = num * 10 + l4
                }
              }
              items.push(num)
            } catch (err) {
              if (this.fatal) {
                throw err
              } else {
                items.push(Number.NaN)
              }
            }
          } else {
            throw new RangeError(`unknown column type: ${cols[i].type}`)
          }
        }
      }
      if (items.length > 0) {
        this.index++
        yield items
      }
    } while (!done)
  }

  get count() {
    return this.index
  }

  async close() {
    await this.reader.cancel()
  }

  private concat(a1: Uint8Array, a2: Uint8Array) {
    const result = new Uint8Array(a1.length + a2.length)
    result.set(a1, 0)
    result.set(a2, a1.length)
    return result
  }
}
