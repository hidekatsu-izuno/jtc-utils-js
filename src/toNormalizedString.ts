const EXCLUDES_SET = new Set<string>([
  "\uF91D",
  "\uF928",
  "\uF929",
  "\uF936",
  "\uF970",
  "\uF9D0",
  "\uF9DC",
  "\uFA10",
  "\uFA12",
  "\uFA15",
  "\uFA16",
  "\uFA17",
  "\uFA18",
  "\uFA19",
  "\uFA1A",
  "\uFA1B",
  "\uFA1C",
  "\uFA1D",
  "\uFA1E",
  "\uFA20",
  "\uFA22",
  "\uFA25",
  "\uFA26",
  "\uFA2A",
  "\uFA2B",
  "\uFA2C",
  "\uFA2D",
  "\uFA30",
  "\uFA31",
  "\uFA32",
  "\uFA33",
  "\uFA34",
  "\uFA35",
  "\uFA36",
  "\uFA37",
  "\uFA38",
  "\uFA39",
  "\uFA3A",
  "\uFA3B",
  "\uFA3C",
  "\uFA3D",
  "\uFA3E",
  "\uFA3F",
  "\uFA40",
  "\uFA41",
  "\uFA42",
  "\uFA43",
  "\uFA44",
  "\uFA45",
  "\uFA46",
  "\uFA47",
  "\uFA48",
  "\uFA49",
  "\uFA4A",
  "\uFA4B",
  "\uFA4C",
  "\uFA4D",
  "\uFA4E",
  "\uFA4F",
  "\uFA50",
  "\uFA51",
  "\uFA52",
  "\uFA53",
  "\uFA54",
  "\uFA55",
  "\uFA56",
  "\uFA57",
  "\uFA58",
  "\uFA59",
  "\uFA5A",
  "\uFA5B",
  "\uFA5C",
  "\uFA5D",
  "\uFA5E",
  "\uFA5F",
  "\uFA60",
  "\uFA61",
  "\uFA62",
  "\uFA63",
  "\uFA64",
  "\uFA65",
  "\uFA66",
  "\uFA67",
  "\uFA68",
  "\uFA69",
  "\uFA6A",
  "\uFA6B",
  "\uFA6C",
  "\uFA6D",
])

export function toNormalizedString(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  const array = new Array<string>()
  let start = 0
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i)
    if (c === "\r" || EXCLUDES_SET.has(c)) {
      if (start < i) {
        array.push(value.substring(start, i).normalize("NFC"))
      }
      if (c === "\r") {
        array.push("\n")
        start = i + ((value.charAt(i+1) === "\n") ? 2 : 1)
      } else {
        array.push(c)
        start = i + 1
      }
    }
  }
  if (start < value.length) {
    array.push(value.substring(start).normalize("NFC"))
  }
  return array.join("")
}
