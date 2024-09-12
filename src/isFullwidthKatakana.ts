export function isFullwidthKatakana(value: string | null | undefined) {
	if (!value) {
		return false;
	}

	return /^[\u3000\u30A1-\u30FC]+$/.test(value);
}
