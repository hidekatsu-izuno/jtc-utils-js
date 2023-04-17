export default function toHalfwidth(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return value.replace(/[]/g, toHalfwidthChar)
}

const M = {
  "\u3000": "　",

}

function toHalfwidthChar(n: string) {
  return ""
}
