import { PackedMap } from "../util/PackedMap.ts";
import { JISEncodeMap } from "./JISEncodeMap.ts";
import {
	type Charset,
	type CharsetDecoderOptions,
	type CharsetEncodeOptions,
	type CharsetEncoder,
	type CharsetEncoderOptions,
	StandardDecoder,
} from "./charset.ts";

class Windows31jCharset implements Charset {
	get name() {
		return "windows-31j";
	}

	createDecoder(options?: CharsetDecoderOptions) {
		return new StandardDecoder("windows-31j");
	}

	createEncoder(options?: CharsetEncoderOptions) {
		return new Windows31jEncoder(options);
	}

	isUnicode() {
		return false;
	}

	isEbcdic() {
		return false;
	}
}

const Windows31jEncodeMap = new PackedMap((m) => {
	const decoder = new TextDecoder("windows-31j");

	// Shift-JIS additional mapping
	m.set(0xa5, 0x5c);
	m.set(0xab, 0x81e1);
	m.set(0xaf, 0x8150);
	m.set(0xb5, 0x83ca);
	m.set(0xb7, 0x8145);
	m.set(0xb8, 0x8143);
	m.set(0xbb, 0x81e2);
	m.set(0x203e, 0x7e);
	m.set(0x2212, 0x817c);
	m.set(0x3094, 0x8394);
	const buf = new Uint8Array(2);
	for (const hba of [
		[0xfa, 0xfc],
		[0xed, 0xee],
	]) {
		for (let hb = hba[0]; hb <= hba[1]; hb++) {
			buf[0] = hb;
			for (const lba of [
				[0x40, 0x7e],
				[0x80, 0xfc],
			]) {
				for (let lb = lba[0]; lb <= lba[1]; lb++) {
					buf[1] = lb;

					const decoded = decoder.decode(buf);
					if (decoded !== "\uFFFD") {
						m.set(decoded.charCodeAt(0), (hb << 8) | lb);
					}
				}
			}
		}
	}
});

class Windows31jEncoder implements CharsetEncoder {
	private fatal;

	constructor(options?: CharsetEncoderOptions) {
		this.fatal = options?.fatal ?? true;

		JISEncodeMap.initialize();
		Windows31jEncodeMap.initialize();
	}

	canEncode(str: string) {
		for (let i = 0; i < str.length; i++) {
			const cp = str.charCodeAt(i);
			if (cp <= 0x7f) {
				// ASCII
				// no handle
			} else if (cp >= 0xe000 && cp <= 0xe757) {
				// ユーザー外字
				// no handle
			} else if (cp >= 0xff61 && cp <= 0xff9f) {
				// 半角カナ
				// no handle
			} else {
				let enc = JISEncodeMap.get(cp);
				if (enc != null) {
					// no handle
				} else if ((enc = Windows31jEncodeMap.get(cp)) != null) {
					// no handle
				} else {
					return false;
				}
			}
		}
		return true;
	}

	encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
		const out = new Array<number>();
		const limit = options?.limit ?? Number.POSITIVE_INFINITY;
		let prev = 0;
		for (let i = 0; i < str.length; i++) {
			prev = out.length;
			const cp = str.charCodeAt(i);
			if (cp <= 0x7f) {
				// ASCII
				out.push(cp);
			} else if (cp >= 0xe000 && cp <= 0xe757) {
				// ユーザー外字
				const sjis =
					cp >= 0xe6db
						? cp - 0xe6db + 0xf980
						: cp >= 0xe69c
							? cp - 0xe69c + 0xf940
							: cp >= 0xe61f
								? cp - 0xe61f + 0xf880
								: cp >= 0xe5e0
									? cp - 0xe5e0 + 0xf840
									: cp >= 0xe563
										? cp - 0xe563 + 0xf780
										: cp >= 0xe524
											? cp - 0xe524 + 0xf740
											: cp >= 0xe4a7
												? cp - 0xe4a7 + 0xf680
												: cp >= 0xe468
													? cp - 0xe468 + 0xf640
													: cp >= 0xe3eb
														? cp - 0xe3eb + 0xf580
														: cp >= 0xe3ac
															? cp - 0xe3ac + 0xf540
															: cp >= 0xe32f
																? cp - 0xe32f + 0xf480
																: cp >= 0xe2f0
																	? cp - 0xe2f0 + 0xf440
																	: cp >= 0xe273
																		? cp - 0xe273 + 0xf380
																		: cp >= 0xe234
																			? cp - 0xe234 + 0xf340
																			: cp >= 0xe1b7
																				? cp - 0xe1b7 + 0xf280
																				: cp >= 0xe178
																					? cp - 0xe178 + 0xf240
																					: cp >= 0xe0fb
																						? cp - 0xe0fb + 0xf180
																						: cp >= 0xe0bc
																							? cp - 0xe0bc + 0xf140
																							: cp >= 0xe03f
																								? cp - 0xe03f + 0xf080
																								: cp - 0xe000 + 0xf040;
				out.push((sjis >>> 8) & 0xff);
				out.push(sjis & 0xff);
			} else if (cp >= 0xff61 && cp <= 0xff9f) {
				// 半角カナ
				out.push(cp - 0xff61 + 0xa1);
			} else {
				let enc = JISEncodeMap.get(cp);
				if (enc != null) {
					let hb = (enc >>> 8) & 0xff;
					let lb = enc & 0xff;
					lb += hb & 1 ? (lb < 0x60 ? 0x1f : 0x20) : 0x7e;
					hb = hb < 0x5f ? (hb + 0xe1) >>> 1 : (hb + 0x161) >>> 1;
					out.push(hb);
					out.push(lb);
				} else if ((enc = Windows31jEncodeMap.get(cp)) != null) {
					if (enc > 0xff) {
						out.push((enc >>> 8) & 0xff);
						out.push(enc & 0xff);
					} else {
						out.push(enc & 0xff);
					}
				} else if (this.fatal) {
					throw TypeError(
						`The code point ${cp.toString(16)} could not be encoded`,
					);
				} else {
					out.push(0x5f); // ?
				}
			}

			if (out.length > limit) {
				out.length = prev;
				break;
			}
		}

		return Uint8Array.from(out);
	}
}

export const windows31j = new Windows31jCharset();
