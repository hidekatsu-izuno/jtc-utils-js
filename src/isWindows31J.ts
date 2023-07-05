import { ShiftJISEncoder } from "./encode/ShiftJISEncoder.js"

const encoder = new ShiftJISEncoder()

export function isWindows31J(value: string | null | undefined) {
  if (!value) {
      return false
  }

  return encoder.canEncode(value)
}
