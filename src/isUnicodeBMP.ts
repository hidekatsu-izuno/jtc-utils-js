export function isUnicodeBMP(value: string | null | undefined) {
  if (value == null) {
    return false
  }

  if (/[\uD800-\uDFFF]/.test(value)) {
    return false
  }

  return true
}
