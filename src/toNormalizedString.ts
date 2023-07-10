export function toNormalizedString(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  return value.normalize("NFC").replace(/\r\n?/g, "\n")
}
