import { Windows31jEncoder } from "./encode/Windows31jEncoder.js"

const encoder = new Windows31jEncoder()

export function isWindows31J(value: string | null | undefined) {
  if (!value) {
      return false
  }

  return encoder.canEncode(value)
}
