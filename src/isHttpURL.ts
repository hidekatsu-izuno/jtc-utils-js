export function isHttpURL(value: string | null | undefined) {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)
    return /^https?:$/.test(url.protocol)
  } catch (e) {
    return false
  }
}
