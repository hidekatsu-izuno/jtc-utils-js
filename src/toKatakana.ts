
const M = new Map<string, string>([
	["\u3041", "\u30a1"],
	["\u3042", "\u30a2"],
	["\u3043", "\u30a3"],
	["\u3044", "\u30a4"],
	["\u3045", "\u30a5"],
	["\u3046", "\u30a6"],
	["\u3047", "\u30a7"],
	["\u3048", "\u30a8"],
	["\u3049", "\u30a9"],
	["\u304a", "\u30aa"],
	["\u304b", "\u30ab"],
	["\u304c", "\u30ac"],
	["\u304d", "\u30ad"],
	["\u304e", "\u30ae"],
	["\u304f", "\u30af"],
	["\u3050", "\u30b0"],
	["\u3051", "\u30b1"],
	["\u3052", "\u30b2"],
	["\u3053", "\u30b3"],
	["\u3054", "\u30b4"],
	["\u3055", "\u30b5"],
	["\u3056", "\u30b6"],
	["\u3057", "\u30b7"],
	["\u3058", "\u30b8"],
	["\u3059", "\u30b9"],
	["\u305a", "\u30ba"],
	["\u305b", "\u30bb"],
	["\u305c", "\u30bc"],
	["\u305d", "\u30bd"],
	["\u305e", "\u30be"],
	["\u305f", "\u30bf"],
	["\u3060", "\u30c0"],
	["\u3061", "\u30c1"],
	["\u3062", "\u30c2"],
	["\u3063", "\u30c3"],
	["\u3064", "\u30c4"],
	["\u3065", "\u30c5"],
	["\u3066", "\u30c6"],
	["\u3067", "\u30c7"],
	["\u3068", "\u30c8"],
	["\u3069", "\u30c9"],
	["\u306a", "\u30ca"],
	["\u306b", "\u30cb"],
	["\u306c", "\u30cc"],
	["\u306d", "\u30cd"],
	["\u306e", "\u30ce"],
	["\u306f", "\u30cf"],
	["\u3070", "\u30d0"],
	["\u3071", "\u30d1"],
	["\u3072", "\u30d2"],
	["\u3073", "\u30d3"],
	["\u3074", "\u30d4"],
	["\u3075", "\u30d5"],
	["\u3076", "\u30d6"],
	["\u3077", "\u30d7"],
	["\u3078", "\u30d8"],
	["\u3079", "\u30d9"],
	["\u307a", "\u30da"],
	["\u307b", "\u30db"],
	["\u307c", "\u30dc"],
	["\u307d", "\u30dd"],
	["\u307e", "\u30de"],
	["\u307f", "\u30df"],
	["\u3080", "\u30e0"],
	["\u3081", "\u30e1"],
	["\u3082", "\u30e2"],
	["\u3083", "\u30e3"],
	["\u3084", "\u30e4"],
	["\u3085", "\u30e5"],
	["\u3086", "\u30e6"],
	["\u3087", "\u30e7"],
	["\u3088", "\u30e8"],
	["\u3089", "\u30e9"],
	["\u308a", "\u30ea"],
	["\u308b", "\u30eb"],
	["\u308c", "\u30ec"],
	["\u308d", "\u30ed"],
	["\u308e", "\u30ee"],
	["\u308f", "\u30ef"],
	["\u3090", "\u30f0"],
	["\u3091", "\u30f1"],
	["\u3092", "\u30f2"],
	["\u3093", "\u30f3"],
	["\u3094", "\u30f4"],
	["\u3095", "\u30f5"],
	["\u3096", "\u30f6"],
	["\u308f\u3099", "\u30f7"],
	["\u3090\u3099", "\u30f8"],
	["\u3091\u3099", "\u30f9"],
	["\u3092\u3099", "\u30fa"],
	["\u309d", "\u30fd"],
	["\u309e", "\u30fe"],
])

function toKatakanaChar(c: string) {
  return M.get(c) ?? c
}

export function toKatakana(str: string): string;
export function toKatakana(str: null): null;
export function toKatakana(str: undefined): undefined;
export function toKatakana(value: string | null | undefined) {
  if (!value) {
    return value
  }

  let result = ""
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i)
    if (i + 1 < value.length) {
      const c2 = value.charAt(i+1)
      if (c2 == "\u3099" || c2 == "\u309A") {
        result += toKatakanaChar(c + c2)
        i++
        continue
      }
    }
    result += toKatakanaChar(c)
  }
  return result
}
