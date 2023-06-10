export function isURL(value: string | null | undefined) {
  if (value == null) {
    return false
  }

  try {
    const url = new URL(value)
    return /^https?$/.test(url.protocol)
  } catch (e) {
    return false
  }
}
