export function isUsAscii(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  if (/[^\x00-\x7F]/.test(value)) {
    return false
  }

  return true
}
