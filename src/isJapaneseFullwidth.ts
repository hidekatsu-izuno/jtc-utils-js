export default function isJapaneseFullwidth(value: any) {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^\p{Script_Extensions=Han}+$/.test(value)
}
