export function toSafeUnicode(str: string): string;
export function toSafeUnicode(str: null): null;
export function toSafeUnicode(str: undefined): undefined;
export function toSafeUnicode(value: string | null | undefined) {
  if (!value) {
    return value
  }

  let result = value.normalize("NFC")
  result = result.replace(/[\p{Cn}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/ug, "")
  result = result.replace(/(\r\n|[\p{Cc}])/ug, m => {
    return (
      m === "\r\n" || m === "\r" ? "\n" :
      m === "\t" || m === "\n" ? m :
      ""
    )
  })
  return result
}
