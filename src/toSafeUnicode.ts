
export function toSafeUnicode(value?: string) {
  if (!value) {
    return value
  }

  return value.replace(/[\p{Cn}\p{Cc}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF&&[^\t\r\n]]$/ug, "")
}
