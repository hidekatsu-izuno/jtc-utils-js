import { windows31j } from "./charset/windows31j.js"

const encoder = windows31j.createEncoder()

export function isWindows31J(value: string | null | undefined) {
  if (!value) {
      return false
  }

  return encoder.canEncode(value)
}
