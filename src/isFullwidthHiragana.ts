export function isFullwidthHiragana(value: string | null | undefined) {
  if (!value) {
    return false
  }

  return /^[\u3000\u3041-\u3096\u30FC]+$/.test(value)
}
