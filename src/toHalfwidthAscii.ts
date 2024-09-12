export function toHalfwidthAscii(str: string): string;
export function toHalfwidthAscii(str: null): null;
export function toHalfwidthAscii(str: undefined): undefined;
export function toHalfwidthAscii(value: string | null | undefined) {
	if (!value) {
		return value;
	}

	return value.replace(/[\u3000\uFF01-\uFF5E]/g, (m) => {
		return m === "\u3000"
			? " "
			: String.fromCharCode(m.charCodeAt(0) - 0xff01 + 0x21);
	});
}
