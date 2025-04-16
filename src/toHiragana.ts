const M = new Map<string, string>([
  ["\u30a1", "\u3041"],
  ["\u30a2", "\u3042"],
  ["\u30a3", "\u3043"],
  ["\u30a4", "\u3044"],
  ["\u30a5", "\u3045"],
  ["\u30a6", "\u3046"],
  ["\u30a7", "\u3047"],
  ["\u30a8", "\u3048"],
  ["\u30a9", "\u3049"],
  ["\u30aa", "\u304a"],
  ["\u30ab", "\u304b"],
  ["\u30ac", "\u304c"],
  ["\u30ad", "\u304d"],
  ["\u30ae", "\u304e"],
  ["\u30af", "\u304f"],
  ["\u30b0", "\u3050"],
  ["\u30b1", "\u3051"],
  ["\u30b2", "\u3052"],
  ["\u30b3", "\u3053"],
  ["\u30b4", "\u3054"],
  ["\u30b5", "\u3055"],
  ["\u30b6", "\u3056"],
  ["\u30b7", "\u3057"],
  ["\u30b8", "\u3058"],
  ["\u30b9", "\u3059"],
  ["\u30ba", "\u305a"],
  ["\u30bb", "\u305b"],
  ["\u30bc", "\u305c"],
  ["\u30bd", "\u305d"],
  ["\u30be", "\u305e"],
  ["\u30bf", "\u305f"],
  ["\u30c0", "\u3060"],
  ["\u30c1", "\u3061"],
  ["\u30c2", "\u3062"],
  ["\u30c3", "\u3063"],
  ["\u30c4", "\u3064"],
  ["\u30c5", "\u3065"],
  ["\u30c6", "\u3066"],
  ["\u30c7", "\u3067"],
  ["\u30c8", "\u3068"],
  ["\u30c9", "\u3069"],
  ["\u30ca", "\u306a"],
  ["\u30cb", "\u306b"],
  ["\u30cc", "\u306c"],
  ["\u30cd", "\u306d"],
  ["\u30ce", "\u306e"],
  ["\u30cf", "\u306f"],
  ["\u30d0", "\u3070"],
  ["\u30d1", "\u3071"],
  ["\u30d2", "\u3072"],
  ["\u30d3", "\u3073"],
  ["\u30d4", "\u3074"],
  ["\u30d5", "\u3075"],
  ["\u30d6", "\u3076"],
  ["\u30d7", "\u3077"],
  ["\u30d8", "\u3078"],
  ["\u30d9", "\u3079"],
  ["\u30da", "\u307a"],
  ["\u30db", "\u307b"],
  ["\u30dc", "\u307c"],
  ["\u30dd", "\u307d"],
  ["\u30de", "\u307e"],
  ["\u30df", "\u307f"],
  ["\u30e0", "\u3080"],
  ["\u30e1", "\u3081"],
  ["\u30e2", "\u3082"],
  ["\u30e3", "\u3083"],
  ["\u30e4", "\u3084"],
  ["\u30e5", "\u3085"],
  ["\u30e6", "\u3086"],
  ["\u30e7", "\u3087"],
  ["\u30e8", "\u3088"],
  ["\u30e9", "\u3089"],
  ["\u30ea", "\u308a"],
  ["\u30eb", "\u308b"],
  ["\u30ec", "\u308c"],
  ["\u30ed", "\u308d"],
  ["\u30ee", "\u308e"],
  ["\u30ef", "\u308f"],
  ["\u30f0", "\u3090"],
  ["\u30f1", "\u3091"],
  ["\u30f2", "\u3092"],
  ["\u30f3", "\u3093"],
  ["\u30f4", "\u3094"],
  ["\u30f5", "\u304b"],
  ["\u30f6", "\u3051"],
  ["\u30f7", "\u308f\u3099"],
  ["\u30f8", "\u3090\u3099"],
  ["\u30f9", "\u3091\u3099"],
  ["\u30fa", "\u3092\u3099"],
  ["\u30fd", "\u309d"],
  ["\u30fe", "\u309e"],
  ["\uff61", "\u3002"],
  ["\uff62", "\u300c"],
  ["\uff63", "\u300d"],
  ["\uff64", "\u3001"],
  ["\uff65", "\u30fb"],
  ["\uff66", "\u3092"],
  ["\uff67", "\u3041"],
  ["\uff68", "\u3043"],
  ["\uff69", "\u3045"],
  ["\uff6a", "\u3047"],
  ["\uff6b", "\u3049"],
  ["\uff6c", "\u3083"],
  ["\uff6d", "\u3085"],
  ["\uff6e", "\u3087"],
  ["\uff6f", "\u3063"],
  ["\uff70", "\u30fc"],
  ["\uff71", "\u3042"],
  ["\uff72", "\u3044"],
  ["\uff73", "\u3046"],
  ["\uff73\uff9e", "\u3094"],
  ["\uff74", "\u3048"],
  ["\uff75", "\u304a"],
  ["\uff76", "\u304b"],
  ["\uff76\uff9e", "\u304c"],
  ["\uff77", "\u304d"],
  ["\uff77\uff9e", "\u304e"],
  ["\uff78", "\u304f"],
  ["\uff78\uff9e", "\u3050"],
  ["\uff79", "\u3051"],
  ["\uff79\uff9e", "\u3052"],
  ["\uff7a", "\u3053"],
  ["\uff7a\uff9e", "\u3054"],
  ["\uff7b", "\u3055"],
  ["\uff7b\uff9e", "\u3056"],
  ["\uff7c", "\u3057"],
  ["\uff7c\uff9e", "\u3058"],
  ["\uff7d", "\u3059"],
  ["\uff7d\uff9e", "\u305a"],
  ["\uff7e", "\u305b"],
  ["\uff7e\uff9e", "\u305c"],
  ["\uff7f", "\u305d"],
  ["\uff7f\uff9e", "\u305e"],
  ["\uff80", "\u305f"],
  ["\uff80\uff9e", "\u3060"],
  ["\uff81", "\u3061"],
  ["\uff81\uff9e", "\u3062"],
  ["\uff82", "\u3064"],
  ["\uff82\uff9e", "\u3065"],
  ["\uff83", "\u3066"],
  ["\uff83\uff9e", "\u3067"],
  ["\uff84", "\u3068"],
  ["\uff84\uff9e", "\u3069"],
  ["\uff85", "\u306a"],
  ["\uff86", "\u306b"],
  ["\uff87", "\u306c"],
  ["\uff88", "\u306d"],
  ["\uff89", "\u306e"],
  ["\uff8a", "\u306f"],
  ["\uff8a\uff9e", "\u3070"],
  ["\uff8a\uff9f", "\u3071"],
  ["\uff8b", "\u3072"],
  ["\uff8b\uff9e", "\u3073"],
  ["\uff8b\uff9f", "\u3074"],
  ["\uff8c", "\u3075"],
  ["\uff8c\uff9e", "\u3076"],
  ["\uff8c\uff9f", "\u3077"],
  ["\uff8d", "\u3078"],
  ["\uff8d\uff9e", "\u3079"],
  ["\uff8d\uff9f", "\u307a"],
  ["\uff8e", "\u307b"],
  ["\uff8e\uff9e", "\u307c"],
  ["\uff8e\uff9f", "\u307d"],
  ["\uff8f", "\u307e"],
  ["\uff90", "\u307f"],
  ["\uff91", "\u3080"],
  ["\uff92", "\u3081"],
  ["\uff93", "\u3082"],
  ["\uff94", "\u3084"],
  ["\uff95", "\u3086"],
  ["\uff96", "\u3088"],
  ["\uff97", "\u3089"],
  ["\uff98", "\u308a"],
  ["\uff99", "\u308b"],
  ["\uff9a", "\u308c"],
  ["\uff9b", "\u308d"],
  ["\uff9c", "\u308f"],
  ["\uff9d", "\u3093"],
  ["\uff9e", "\u309b"],
  ["\uff9f", "\u309c"],
]);

export function toHiragana(str: string): string;
export function toHiragana(str: null): null;
export function toHiragana(str: undefined): undefined;
export function toHiragana(value: string | null | undefined) {
  if (!value) {
    return value;
  }

  const array = [];
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
    if (i + 1 < value.length) {
      const c2 = value.charAt(i + 1);
      if (c2 === "\uFF9E" || c2 === "\uFF9F") {
        const m = M.get(c + c2);
        if (m != null) {
          if (start < i) {
            array.push(value.substring(start, i));
          }
          array.push(m);
          i++;
          start = i + 1;
          continue;
        }
      }
    }

    const m = M.get(c);
    if (m != null) {
      if (start < i) {
        array.push(value.substring(start, i));
      }
      array.push(m);
      start = i + 1;
    }
  }
  if (start < value.length) {
    array.push(value.substring(start));
  }
  return array.join("");
}
