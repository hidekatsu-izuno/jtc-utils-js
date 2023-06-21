import { Writable } from "node:stream"
import iconv from "iconv-lite"
import { stringify, Stringifier, Options } from 'csv-stringify'

export class CsvWriter {
  private stringifier: Stringifier
  private dest: NodeJS.WritableStream

  constructor(
    dest: Writable | WritableStream<Uint8Array>,
    options?: {
      encoding?: string,
      bom?: boolean,
      fieldSeparator?: string,
      lineSeparator?: string,
    }
  ) {
    const sopts: Options = {
      objectMode: true,
      delimiter: options?.fieldSeparator,
      record_delimiter: options?.lineSeparator ?? "\r\n",
    }
    if (options?.encoding != null) {
      if (Buffer.isEncoding(options.encoding)) {
        sopts.defaultEncoding = options.encoding
      }
    }
    sopts.bom = options?.bom != null ? options?.bom :
      options?.encoding != null ? /^(utf|ucs)/i.test(options.encoding) :
      true

    if (dest instanceof WritableStream) {
      this.dest = Writable.fromWeb(dest)
    } else {
      this.dest = dest
    }

    this.stringifier = stringify(sopts)
    if (options?.encoding != null && sopts.defaultEncoding == null) {
      this.stringifier.pipe(iconv.encodeStream(options.encoding)).pipe(this.dest)
    } else {
      this.stringifier.pipe(this.dest)
    }
  }

  async write(record: string[]) {
    return await new Promise((resolve, reject) => {
      this.stringifier.write(record, err => {
        if (err) {
          reject(err)
        } else {
          resolve(undefined)
        }
      })
    })
  }

  async close() {
    return await new Promise(resolve => {
      this.dest.end(() => {
        resolve(undefined)
      })
    })
  }
}
