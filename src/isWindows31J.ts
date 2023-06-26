import { ShiftJISEncoder } from "./encode/ShiftJISEncoder.js"

const encoder = new ShiftJISEncoder()

export function isWindows31J(value: string | null | undefined) {
  if (!value) {
      return false
  }

  for (let i = 0; i < value.length; i++) {
      const n = value.codePointAt(i);
      if (n == null || !encoder.canEncode(n)) {
          return false
      }
  }

  return true
}
