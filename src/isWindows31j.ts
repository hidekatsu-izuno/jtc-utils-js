import { windows31j } from "./charset/windows31j.ts"

const encoder = windows31j.createEncoder()

export function isWindows31j(value: string | null | undefined) {
  if (!value) {
      return false
  }

  return encoder.canEncode(value)
}
