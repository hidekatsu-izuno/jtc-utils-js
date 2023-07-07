export function isWebSafeString(value: string | null | undefined) {
  if (value == null) {
    return false
  }

  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\p{Co}\p{Cn}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/u.test(value)) {
    return false
  }

  return true
}
