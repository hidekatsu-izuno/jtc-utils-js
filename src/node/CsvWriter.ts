import { Writable } from "node:stream"
import iconv from "iconv-lite"
import { stringify, Stringifier, Options } from 'csv-stringify'

export class CsvWriter {
  private stringifier: Stringifier
  private dest: NodeJS.WritableStream

  constructor(
    dest: Writable,
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
      if (/^(ascii|utf-?8|utf16le|ucs-?2|base64(url)?|latin1|binary|hex)$/i.test(options.encoding)) {
        sopts.defaultEncoding = options.encoding.toLowerCase() as BufferEncoding
      }
    }
    sopts.bom = options?.bom != null ? options?.bom :
      options?.encoding != null ? /^(utf-?8|utf16le|ucs-?2)$/i.test(options.encoding) :
      true
    this.stringifier = stringify(sopts)
    this.dest = dest
    if (options?.encoding != null && sopts.defaultEncoding == null) {
      this.stringifier.pipe(iconv.encodeStream(options.encoding)).pipe(dest)
    } else {
      this.stringifier.pipe(dest)
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
