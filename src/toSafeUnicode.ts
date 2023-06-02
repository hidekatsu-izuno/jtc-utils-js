import { normalize } from "./normalize.js"

export function toSafeUnicode(value: string | null | undefined) {
  if (!value) {
    return value
  }

  let result = normalize(value)
  result = value.replace(/[\p{Cn}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/ug, "")
  result = result.replace(/([\p{Cc}])/ug, m => {
    return (
      m === "\t" || m === "\n" || m === "\r" ? m :
      ""
    )
  })
  return result
}
