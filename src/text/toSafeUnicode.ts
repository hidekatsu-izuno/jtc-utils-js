export function toSafeUnicode(str: string): string;
export function toSafeUnicode(str: null): null;
export function toSafeUnicode(str: undefined): undefined;
export function toSafeUnicode(value: string | null | undefined) {
  if (!value) {
    return value
  }

  let result = value.normalize("NFC")
  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\p{Cn}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/ug, "")
  result = result.replace(/\r\n?/g, "\n")
  return result
}
