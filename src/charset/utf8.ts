import {
  type Charset,
  type CharsetDecoderOptions,
  type CharsetEncodeOptions,
  type CharsetEncoder,
  type CharsetEncoderOptions,
  StandardDecoder,
} from "./charset.ts";

class Utf8Charset implements Charset {
  get name() {
    return "utf-8";
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("utf-8", options);
  }

  createEncoder(_options?: CharsetEncoderOptions) {
    return new Utf8Encoder();
  }

  isUnicode() {
    return true;
  }

  isEbcdic() {
    return false;
  }
}

class Utf8Encoder implements CharsetEncoder {
  private encoder = new TextEncoder();

  canEncode(_str: string) {
    return true;
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const limit = options?.limit ?? Number.POSITIVE_INFINITY;
    const encoded = this.encoder.encode(str);
    if (encoded.length > limit) {
      let len = Math.max(0, Math.floor(limit));
      // A continuation byte at the boundary means the last character is split.
      while (len > 0 && (encoded[len] & 0xc0) === 0x80) {
        len--;
      }
      return encoded.subarray(0, len);
    }
    return encoded;
  }
}

export const utf8 = new Utf8Charset();
