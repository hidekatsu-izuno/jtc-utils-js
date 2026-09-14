import type {
  Charset,
  CharsetDecodeOptions,
  CharsetDecoderOptions,
  CharsetEncodeOptions,
  CharsetEncoderOptions,
} from "./charset.ts";
import { cp942 } from "./cp942.ts";

class Cp942cCharset implements Charset {
  get name() {
    return "cp942c";
  }

  createDecoder(options?: CharsetDecoderOptions) {
    const decoder = cp942.createDecoder(options);
    return {
      decode(input: Uint8Array, options?: CharsetDecodeOptions) {
        return decoder
          .decode(input, options)
          .replace(/[\u001a\u001c\u007f\u00a5\u203e]/g, (char) => {
            switch (char) {
              case "\u001a":
                return "\u007f";
              case "\u001c":
                return "\u001a";
              case "\u007f":
                return "\u001c";
              case "\u00a5":
                return "\\";
              default:
                return "~";
            }
          });
      },
    };
  }

  createEncoder(options?: CharsetEncoderOptions) {
    const encoder = cp942.createEncoder(options);
    return {
      canEncode(str: string) {
        return encoder.canEncode(str);
      },
      encode(str: string, options?: CharsetEncodeOptions) {
        // Use CP942 characters that encode to CP942C's ASCII-compatible bytes.
        const mapped = str.replace(/[\u001a\u001c\u007f\\~]/g, (char) => {
          switch (char) {
            case "\u001a":
              return "\u001c";
            case "\u001c":
              return "\u007f";
            case "\u007f":
              return "\u001a";
            case "\\":
              return "\u00a5";
            default:
              return "\u203e";
          }
        });
        return encoder.encode(mapped, options);
      },
    };
  }

  isUnicode() {
    return false;
  }

  isEbcdic() {
    return false;
  }
}

export const cp942c = new Cp942cCharset();
