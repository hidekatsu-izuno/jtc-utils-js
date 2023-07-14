import { Charset, CharsetEncoder } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"

export declare type FixlenWriterColumn = {
  length: number,
  shift?: boolean,
  fill?: "left" | "right",
  filler?: string,
  type?: "zerofill" | "int-le" | "int-be" | "uint-le" | "uint-be" | "zoned" | "packed",
}

export class FixlenWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: CharsetEncoder
  private ebcdic: boolean

  private shift: boolean
  private filler: Uint8Array
  private lineSeparator?: Uint8Array
  private columns: (FixlenWriterColumn & { fillerBytes: Uint8Array })[]
  private lineLength: number

  private bom: boolean
  private fatal: boolean

  private index: number = 0

  constructor(
    dest: WritableStream<Uint8Array>,
    config: {
      columns: FixlenWriterColumn[],
      charset?: Charset,
      bom?: boolean,
      shift?: boolean,
      filler?: string,
      lineSeparator?: string,
      fatal?: boolean,
    },
  ) {
    const charset = config.charset ?? utf8
    this.encoder = charset.createEncoder()
    this.ebcdic = charset.isEbcdic()
    this.bom = charset.isUnicode() ? (config.bom ?? false) : false
    this.shift = config.shift ?? false
    this.filler = this.encoder.encode(config.filler || " ", { shift: this.shift })
    if (config.lineSeparator) {
      this.lineSeparator = this.encoder.encode(config.lineSeparator, { shift: this.shift })
    }
    this.fatal = config.fatal ?? true

    this.lineLength = 0
    this.columns = []
    for (let pos = 0; pos < config.columns.length; pos++) {
      const col = config.columns[pos]
      if (col.length <= 0) {
        throw new RangeError(`column length must be positive: ${col.length}`)
      }
      this.lineLength += col.length

      const colShift = col.shift ?? this.shift
      this.columns.push({
        length: col.length,
        shift: colShift,
        fill: col.fill,
        fillerBytes: col.filler ? this.encoder.encode(col.filler, { shift: colShift }) : this.filler,
        type: col.type,
      })
    }
    if (this.lineSeparator) {
      this.lineLength += this.lineSeparator.length
    }

    this.writer = dest.getWriter()
  }

  async write(record: any[], options?: {
    columns: FixlenWriterColumn[],
    shift?: boolean
    filler?: string,
    lineSeparator?: string,
  }) {
    let shift = this.shift
    let filler = this.filler
    let lineSeparator = this.lineSeparator
    let columns = this.columns
    let lineLength = this.lineLength

    if (options?.shift != null) {
      shift = options.shift
    }
    if (options?.filler != null) {
      filler = this.encoder.encode(options.filler, { shift })
    }
    if (options?.lineSeparator != null) {
      lineSeparator = this.encoder.encode(options.lineSeparator)
    }
    if (options?.columns) {
      columns = []
      lineLength = 0

      for (let pos = 0; pos < options.columns.length; pos++) {
        const col = options.columns[pos]
        if (col.length <= 0) {
          throw new RangeError(`column length must be positive: ${col.length}`)
        }
        lineLength += col.length

        const colShift = col.shift ?? this.shift
        columns.push({
          length: col.length,
          shift: col.shift ?? false,
          fill: col.fill,
          fillerBytes: col.filler ? this.encoder.encode(col.filler, { shift: colShift }) : filler,
          type: col.type,
        })
      }
      if (lineSeparator) {
        lineLength += lineSeparator.length
      }
    }

    let buf
    let start = 0
    if (this.bom) {
      const bomBytes = this.encoder.encode("\uFEFF")
      buf = new Uint8Array(bomBytes.length + lineLength)
      buf.set(bomBytes, 0)
      start += bomBytes.length
      this.bom = false
    } else {
      buf = new Uint8Array(lineLength)
    }

    for (let pos = 0; pos < columns.length; pos++) {
      const col = columns[pos]
      const value = record[pos]

      const isNumber = typeof value === "number" && Number.isFinite(value)
      const type = isNumber ? col.type : undefined
      const fill = col.fill ?? (isNumber ? "right" : "left")

      if (!type) {
        const text = value != null ? value.toString() : ""
        let encoded = this.encoder.encode(text, { shift: col.shift })
        if (encoded.length > col.length) {
          if (this.fatal) {
            throw new RangeError("overflow error")
          }
          encoded = this.encoder.encode(text, { shift: col.shift, limit: col.length })
        }

        if (encoded.length === col.length) {
          buf.set(encoded, start)
        } else {
          if ((col.length - encoded.length) % col.fillerBytes.length !== 0) {
            throw new RangeError(`filler length is mismatched: ${col.fillerBytes.length}`)
          }
          if (fill === "right") {
            for (let i = 0; i < col.length - encoded.length; i += col.fillerBytes.length) {
              buf.set(col.fillerBytes, start + i)
            }
            buf.set(encoded, col.length - encoded.length)
          } else {
            for (let i = 0; i < col.length - encoded.length; i += col.fillerBytes.length) {
              buf.set(col.fillerBytes, start + encoded.length + i)
            }
            buf.set(encoded, start)
          }
        }
      } else if (!Number.isInteger(value)) {
        if (this.fatal) {
          throw new RangeError(`value must be integer: ${value}`)
        } else {
          buf.fill(0, start, start + col.length)
        }
      } else if (type === "zerofill") {
        const encoded = new Uint8Array(col.length)
        let pos = 0

        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (sign) {
          const minus = this.encoder.encode("-", { shift: col.shift })
          encoded.set(minus, pos)
          pos += minus.length
        }

        const content = this.encoder.encode(text, { shift: col.shift })
        if (pos + content.length < col.length) {
          const zero = this.encoder.encode("0", { shift: col.shift })
          for (; pos < col.length - content.length; pos += zero.length) {
            encoded.set(zero, pos)
          }
        }
        if (pos + content.length === col.length) {
          encoded.set(content, col.length - content.length)
          buf.set(encoded, start)
        } else if (this.fatal) {
          throw new RangeError(`overflow error: ${value}`)
        } else {
          buf.fill(0, start, start + col.length)
        }
      } else if (type.startsWith("int-")) {
        const view = new DataView(buf.buffer)
        const littleEndien = type === "int-le"
        if (col.length === 4) {
          view.setInt32(start, value, littleEndien)
        } else if (col.length === 2) {
          view.setInt16(start, value, littleEndien)
        } else if (col.length === 1) {
          view.setInt8(start, value)
        } else if (this.fatal) {
          throw new RangeError("byte length must be 1, 2 or 4.")
        } else {
          buf.fill(0, start, start + col.length)
        }
      } else if (type.startsWith("uint-")) {
        const view = new DataView(buf.buffer)
        const littleEndien = type === "uint-le"
        if (col.length === 4) {
          view.setUint32(start, value, littleEndien)
        } else if (col.length === 2) {
          view.setUint16(start, value, littleEndien)
        } else if (col.length === 1) {
          view.setUint8(start, value)
        } else if (this.fatal) {
          throw new RangeError("length must be 1, 2 or 4.")
        } else {
          buf.fill(0, start, start + col.length)
        }
      } else if (type === "zoned") {
        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (this.fatal && col.length < text.length) {
          throw new RangeError(`length is too short: ${col.length}`)
        }

        for (let i = 0; i < col.length; i++) {
          let n = (i < col.length - text.length) ? 0 : text.charCodeAt(i - (col.length - text.length)) - 0x30
          if (n > 0xA) {
            if (this.fatal) {
              throw new RangeError(`Invalid value: ${n}`)
            } else {
              n = 0
            }
          }
          if (i === col.length - 1) {
            buf[start + i] = (sign ? 0xD0 : 0xC0) | n
          } else {
            buf[start + i] = (this.ebcdic ? 0xF0 : 0x30) | n
          }
        }
      } else if (type === "packed") {
        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (this.fatal && col.length < Math.ceil((text.length + 1) / 2)) {
          throw new RangeError(`length is too short: ${col.length}`)
        }

        buf[start + col.length - 1] = sign ? 0x0D : 0x0C
        for (let i = 0; i < text.length; i++) {
          let n = text.charCodeAt(text.length - 1 - i) - 0x30
          if (n > 0xA) {
            if (this.fatal) {
              throw new RangeError(`Invalid value: ${n}`)
            } else {
              n = 0
            }
          }
          if (i % 2 == 1) {
            buf[start + col.length - 1 - ((i + 1) >>> 1)] = n
          } else {
            buf[start + col.length - 1 - (i >>> 1)] |= n << 4
          }
        }
      } else {
        throw new RangeError(`unknown column type: ${type}`)
      }
      start += col.length
    }

    if (lineSeparator) {
      buf.set(lineSeparator, buf.length - lineSeparator.length)
    }

    this.index++
    await this.writer.write(buf)
  }

  get count() {
    return this.index
  }

  async close() {
    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }
    await this.writer.close()
  }
}
