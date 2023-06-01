export function isSafeUnicode(value: any, options?: {
  linebreak?: boolean,
  space?: boolean,
  punct?: boolean,
  supplementary?: boolean,
  privateUse?: boolean,
  emoji?: boolean
  variation?: boolean,
}) {
  if (!value || typeof value !== "string") {
    return false
  }

  if (/[\p{Cn}\p{Cc}\p{Cf}\p{Zl}\p{Zp}\uD800-\uDFFF\uFEFF\uFFF0-\uFFFF]/u.test(value.replace(/[\t\r\n]/g, ""))) {
    return false
  }
  if (options?.linebreak === false && /[\r\n]/.test(value)) {
    return false
  }
  if (options?.punct === false && /[\p{P}\p{S}]/u.test(value)) {
    return false
  }
  if (options?.space === false && /[\t\p{Zs}]/u.test(value)) {
    return false
  }
  if (options?.supplementary === false && /\p{Cs}/u.test(value)) {
    return false
  }
  if (options?.privateUse === false && /\p{Co}/u.test(value)) {
    return false
  }
  if (options?.variation === false && /[\uFE00-\uFE0F\u{E0100}-\u{E01EF}]/u.test(value)) {
    return false
  }
  if (options?.emoji === false && /[\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F]/u.test(value)) {
    return false
  }

  return true
}
