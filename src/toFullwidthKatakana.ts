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
	["\u308f\u3099", "\u30f7"],
	["\u3090", "\u30f0"],
	["\u3090\u3099", "\u30f8"],
	["\u3091", "\u30f1"],
	["\u3091\u3099", "\u30f9"],
	["\u3092", "\u30f2"],
	["\u3092\u3099", "\u30fa"],
	["\u3093", "\u30f3"],
	["\u3094", "\u30f4"],
	["\u3095", "\u30f5"],
	["\u3096", "\u30f6"],
	["\u309d", "\u30fd"],
	["\u309e", "\u30fe"],
	["\uff61", "\u3002"],
	["\uff62", "\u300c"],
	["\uff63", "\u300d"],
	["\uff64", "\u3001"],
	["\uff65", "\u30fb"],
	["\uff66", "\u30f2"],
	["\uff66\uff9e", "\u30fa"],
	["\uff67", "\u30a1"],
	["\uff68", "\u30a3"],
	["\uff69", "\u30a5"],
	["\uff6a", "\u30a7"],
	["\uff6b", "\u30a9"],
	["\uff6c", "\u30e3"],
	["\uff6d", "\u30e5"],
	["\uff6e", "\u30e7"],
	["\uff6f", "\u30c3"],
	["\uff70", "\u30fc"],
	["\uff71", "\u30a2"],
	["\uff72", "\u30a4"],
	["\uff73", "\u30a6"],
	["\uff73\uff9e", "\u30f4"],
	["\uff74", "\u30a8"],
	["\uff75", "\u30aa"],
	["\uff76", "\u30ab"],
	["\uff76\uff9e", "\u30ac"],
	["\uff77", "\u30ad"],
	["\uff77\uff9e", "\u30ae"],
	["\uff78", "\u30af"],
	["\uff78\uff9e", "\u30b0"],
	["\uff79", "\u30b1"],
	["\uff79\uff9e", "\u30b2"],
	["\uff7a", "\u30b3"],
	["\uff7a\uff9e", "\u30b4"],
	["\uff7b", "\u30b5"],
	["\uff7b\uff9e", "\u30b6"],
	["\uff7c", "\u30b7"],
	["\uff7c\uff9e", "\u30b8"],
	["\uff7d", "\u30b9"],
	["\uff7d\uff9e", "\u30ba"],
	["\uff7e", "\u30bb"],
	["\uff7e\uff9e", "\u30bc"],
	["\uff7f", "\u30bd"],
	["\uff7f\uff9e", "\u30be"],
	["\uff80", "\u30bf"],
	["\uff80\uff9e", "\u30c0"],
	["\uff81", "\u30c1"],
	["\uff81\uff9e", "\u30c2"],
	["\uff82", "\u30c4"],
	["\uff82\uff9e", "\u30c5"],
	["\uff83", "\u30c6"],
	["\uff83\uff9e", "\u30c7"],
	["\uff84", "\u30c8"],
	["\uff84\uff9e", "\u30c9"],
	["\uff85", "\u30ca"],
	["\uff86", "\u30cb"],
	["\uff87", "\u30cc"],
	["\uff88", "\u30cd"],
	["\uff89", "\u30ce"],
	["\uff8a", "\u30cf"],
	["\uff8a\uff9e", "\u30d0"],
	["\uff8a\uff9f", "\u30d1"],
	["\uff8b", "\u30d2"],
	["\uff8b\uff9e", "\u30d3"],
	["\uff8b\uff9f", "\u30d4"],
	["\uff8c", "\u30d5"],
	["\uff8c\uff9e", "\u30d6"],
	["\uff8c\uff9f", "\u30d7"],
	["\uff8d", "\u30d8"],
	["\uff8d\uff9e", "\u30d9"],
	["\uff8d\uff9f", "\u30da"],
	["\uff8e", "\u30db"],
	["\uff8e\uff9e", "\u30dc"],
	["\uff8e\uff9f", "\u30dd"],
	["\uff8f", "\u30de"],
	["\uff90", "\u30df"],
	["\uff91", "\u30e0"],
	["\uff92", "\u30e1"],
	["\uff93", "\u30e2"],
	["\uff94", "\u30e4"],
	["\uff95", "\u30e6"],
	["\uff96", "\u30e8"],
	["\uff97", "\u30e9"],
	["\uff98", "\u30ea"],
	["\uff99", "\u30eb"],
	["\uff9a", "\u30ec"],
	["\uff9b", "\u30ed"],
	["\uff9c", "\u30ef"],
	["\uff9c\uff9e", "\u30f7"],
	["\uff9d", "\u30f3"],
	["\uff9e", "\u309b"],
	["\uff9f", "\u309c"],
])

export function toFullwidthKatakana(str: string): string;
export function toFullwidthKatakana(str: null): null;
export function toFullwidthKatakana(str: undefined): undefined;
export function toFullwidthKatakana(value: string | null | undefined) {
  if (!value) {
    return value
  }

  const array = []
  let start = 0
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i)
    if (i + 1 < value.length) {
      const c2 = value.charAt(i + 1)
      if (c2 == "\u3099" || c2 == "\u309A" || c2 == "\uFF9E" || c2 == "\uFF9F") {
        const m = M.get(c + c2)
        if (m != null) {
          if (start < i) {
            array.push(value.substring(start, i))
          }
          array.push(m)
          i++
          start = i + 1
          continue
        }
      }
    }

    const m = M.get(c)
    if (m != null) {
      if (start < i) {
        array.push(value.substring(start, i))
      }
      array.push(m)
      start = i + 1
    }
  }
  if (start < value.length) {
    array.push(value.substring(start))
  }
  return array.join("")
}
