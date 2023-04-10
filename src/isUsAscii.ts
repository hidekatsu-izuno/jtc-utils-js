export default function isUsAscii(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[0x00-0x7F]+$/.test(value)
}
