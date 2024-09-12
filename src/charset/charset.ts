export interface Charset {
	get name(): string;
	createDecoder(options?: CharsetDecoderOptions): CharsetDecoder;
	createEncoder(options?: CharsetEncoderOptions): CharsetEncoder;
	isUnicode(): boolean;
	isEbcdic(): boolean;
}

export interface CharsetDecoder {
	decode(input: Uint8Array, options?: CharsetDecodeOptions): string;
}

export declare type CharsetDecoderOptions = {
	fatal?: boolean;
	ignoreBOM?: boolean;
};

export declare type CharsetDecodeOptions = {
	stream?: boolean;
	shift?: boolean;
};

export interface CharsetEncoder {
	canEncode(str: string): boolean;

	encode(str: string, options?: CharsetEncodeOptions): Uint8Array;
}

export declare type CharsetEncoderOptions = {
	fatal?: boolean;
};

export declare type CharsetEncodeOptions = {
	shift?: boolean;
	limit?: number;
};

export class StandardDecoder implements CharsetDecoder {
	private decoder: TextDecoder;

	constructor(encoding: string, options?: CharsetDecoderOptions) {
		this.decoder = new TextDecoder(encoding, {
			fatal: options?.fatal ?? true,
			ignoreBOM: options?.ignoreBOM,
		});
	}

	decode(input: Uint8Array, options?: CharsetDecodeOptions) {
		return this.decoder.decode(input, options);
	}
}
