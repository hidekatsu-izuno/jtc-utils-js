
export function toSafeUnicode(value?: string) {
  if (!value) {
    return value
  }

  let result = value.replace(/[\p{Cn}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/ug, "")
  result = result.replace(/([\p{Cc}])/ug, m => {
    return m === "\t" || m === "\r" || m === "\n" ? m : ""
  })
  return result
}
