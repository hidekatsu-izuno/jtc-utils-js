
export function toSafeUnicode(value?: string) {
  if (!value) {
    return value
  }

  let result = value.replace(/[\p{Cn}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/ug, "")
  result = result.replace(/(\r\n|[\p{Cc}])/ug, m => {
    return (
      m == "\r\n" || m === "\r" || m === "\n" ? "\n" :
      m === "\t" ? "\t" :
      ""
    )
  })
  return result
}
