export function isHiragana(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return /^[\u3000\u3041-\u3096]+$/.test(value);
}
