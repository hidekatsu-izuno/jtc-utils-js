
export function toSafeUnicode(value?: string) {
  if (!value) {
    return value
  }

  let result = value.replace(/(?:[\u3046-\u307B\u30AB-\u30F2]\u3099|[\u306F-\u307B\u30CF-\u30DB]\u309A)+/g, m => {
    return m.normalize("NFKC")
  })
  result = value.replace(/[\p{Cn}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/ug, "")
  result = result.replace(/(\r\n|[\p{Cc}\u3099\u309A])/ug, m => {
    return (
      m == "\r\n" || m === "\r" || m === "\n" ? "\n" :
      m === "\t" ? "\t" :
      m === "\u3099" ? "\u309B" :
      m === "\u309A" ? "\u309C" :
      ""
    )
  })
  return result
}
