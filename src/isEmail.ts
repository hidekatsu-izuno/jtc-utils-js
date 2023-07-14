export function isEmail(value: string | null | undefined) {
  if (value == null) {
    return false
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#validation
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
}
