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

	createEncoder(options?: CharsetEncoderOptions) {
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

	constructor() {}

	canEncode(str: string) {
		return true;
	}

	encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
		const limit = options?.limit ?? Number.POSITIVE_INFINITY;
		const encoded = this.encoder.encode(str);
		if (encoded.length > limit) {
			let len = limit;
			if (encoded[limit - 1] >= 0xc2) {
				len = len - 1;
			} else if (encoded[limit - 1] >= 0x80) {
				if (encoded[limit - 2] >= 0xe0) {
					len = len - 2;
				} else if (encoded[limit - 2] >= 0x80) {
					if (encoded[limit - 3] >= 0xf0) {
						len = len - 3;
					}
				}
			}
			return encoded.subarray(len);
		}
		return encoded;
	}
}

export const utf8 = new Utf8Charset();
