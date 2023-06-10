export function isValidCharType(value: string | null | undefined, ...types: string[]) {
  if (value == null) {
    return false
  }

  const typeSet = new Set<string>(types)
  const parts = new Array<string>()
  let hasHyphen = false

  if (typeSet.has("ascii")) {

  } else {

  }

  for (const type of types) {
    if (type === "ascii") {

    }
  }

  return "[" + parts.join("") + (hasHyphen ? "-" : "") + "]"
}

function getValidCharTypeRegExp(types: string[]) {

}
