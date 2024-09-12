const M = new Map<string, string>([
  ["\u3001", "\uff64"],
  ["\u3002", "\uff61"],
  ["\u300c", "\uff62"],
  ["\u300d", "\uff63"],
  ["\u3041", "\uff67"],
  ["\u3042", "\uff71"],
  ["\u3043", "\uff68"],
  ["\u3044", "\uff72"],
  ["\u3045", "\uff69"],
  ["\u3046", "\uff73"],
  ["\u3047", "\uff6a"],
  ["\u3048", "\uff74"],
  ["\u3049", "\uff6b"],
  ["\u304a", "\uff75"],
  ["\u304b", "\uff76"],
  ["\u304c", "\uff76\uff9e"],
  ["\u304d", "\uff77"],
  ["\u304e", "\uff77\uff9e"],
  ["\u304f", "\uff78"],
  ["\u3050", "\uff78\uff9e"],
  ["\u3051", "\uff79"],
  ["\u3052", "\uff79\uff9e"],
  ["\u3053", "\uff7a"],
  ["\u3054", "\uff7a\uff9e"],
  ["\u3055", "\uff7b"],
  ["\u3056", "\uff7b\uff9e"],
  ["\u3057", "\uff7c"],
  ["\u3058", "\uff7c\uff9e"],
  ["\u3059", "\uff7d"],
  ["\u305a", "\uff7d\uff9e"],
  ["\u305b", "\uff7e"],
  ["\u305c", "\uff7e\uff9e"],
  ["\u305d", "\uff7f"],
  ["\u305e", "\uff7f\uff9e"],
  ["\u305f", "\uff80"],
  ["\u3060", "\uff80\uff9e"],
  ["\u3061", "\uff81"],
  ["\u3062", "\uff81\uff9e"],
  ["\u3063", "\uff6f"],
  ["\u3064", "\uff82"],
  ["\u3065", "\uff82\uff9e"],
  ["\u3066", "\uff83"],
  ["\u3067", "\uff83\uff9e"],
  ["\u3068", "\uff84"],
  ["\u3069", "\uff84\uff9e"],
  ["\u306a", "\uff85"],
  ["\u306b", "\uff86"],
  ["\u306c", "\uff87"],
  ["\u306d", "\uff88"],
  ["\u306e", "\uff89"],
  ["\u306f", "\uff8a"],
  ["\u3070", "\uff8a\uff9e"],
  ["\u3071", "\uff8a\uff9f"],
  ["\u3072", "\uff8b"],
  ["\u3073", "\uff8b\uff9e"],
  ["\u3074", "\uff8b\uff9f"],
  ["\u3075", "\uff8c"],
  ["\u3076", "\uff8c\uff9e"],
  ["\u3077", "\uff8c\uff9f"],
  ["\u3078", "\uff8d"],
  ["\u3079", "\uff8d\uff9e"],
  ["\u307a", "\uff8d\uff9f"],
  ["\u307b", "\uff8e"],
  ["\u307c", "\uff8e\uff9e"],
  ["\u307d", "\uff8e\uff9f"],
  ["\u307e", "\uff8f"],
  ["\u307f", "\uff90"],
  ["\u3080", "\uff91"],
  ["\u3081", "\uff92"],
  ["\u3082", "\uff93"],
  ["\u3083", "\uff6c"],
  ["\u3084", "\uff94"],
  ["\u3085", "\uff6d"],
  ["\u3086", "\uff95"],
  ["\u3087", "\uff6e"],
  ["\u3088", "\uff96"],
  ["\u3089", "\uff97"],
  ["\u308a", "\uff98"],
  ["\u308b", "\uff99"],
  ["\u308c", "\uff9a"],
  ["\u308d", "\uff9b"],
  ["\u308e", "\uff9c"],
  ["\u308f", "\uff9c"],
  ["\u3090", "\uff72"],
  ["\u3091", "\uff74"],
  ["\u3092", "\uff66"],
  ["\u3093", "\uff9d"],
  ["\u3094", "\uff73\uff9e"],
  ["\u3095", "\uff76"],
  ["\u3096", "\uff79"],
  ["\u309b", "\uff9e"],
  ["\u309c", "\uff9f"],
  ["\u30a1", "\uff67"],
  ["\u30a2", "\uff71"],
  ["\u30a3", "\uff68"],
  ["\u30a4", "\uff72"],
  ["\u30a5", "\uff69"],
  ["\u30a6", "\uff73"],
  ["\u30a7", "\uff6a"],
  ["\u30a8", "\uff74"],
  ["\u30a9", "\uff6b"],
  ["\u30aa", "\uff75"],
  ["\u30ab", "\uff76"],
  ["\u30ac", "\uff76\uff9e"],
  ["\u30ad", "\uff77"],
  ["\u30ae", "\uff77\uff9e"],
  ["\u30af", "\uff78"],
  ["\u30b0", "\uff78\uff9e"],
  ["\u30b1", "\uff79"],
  ["\u30b2", "\uff79\uff9e"],
  ["\u30b3", "\uff7a"],
  ["\u30b4", "\uff7a\uff9e"],
  ["\u30b5", "\uff7b"],
  ["\u30b6", "\uff7b\uff9e"],
  ["\u30b7", "\uff7c"],
  ["\u30b8", "\uff7c\uff9e"],
  ["\u30b9", "\uff7d"],
  ["\u30ba", "\uff7d\uff9e"],
  ["\u30bb", "\uff7e"],
  ["\u30bc", "\uff7e\uff9e"],
  ["\u30bd", "\uff7f"],
  ["\u30be", "\uff7f\uff9e"],
  ["\u30bf", "\uff80"],
  ["\u30c0", "\uff80\uff9e"],
  ["\u30c1", "\uff81"],
  ["\u30c2", "\uff81\uff9e"],
  ["\u30c3", "\uff6f"],
  ["\u30c4", "\uff82"],
  ["\u30c5", "\uff82\uff9e"],
  ["\u30c6", "\uff83"],
  ["\u30c7", "\uff83\uff9e"],
  ["\u30c8", "\uff84"],
  ["\u30c9", "\uff84\uff9e"],
  ["\u30ca", "\uff85"],
  ["\u30cb", "\uff86"],
  ["\u30cc", "\uff87"],
  ["\u30cd", "\uff88"],
  ["\u30ce", "\uff89"],
  ["\u30cf", "\uff8a"],
  ["\u30d0", "\uff8a\uff9e"],
  ["\u30d1", "\uff8a\uff9f"],
  ["\u30d2", "\uff8b"],
  ["\u30d3", "\uff8b\uff9e"],
  ["\u30d4", "\uff8b\uff9f"],
  ["\u30d5", "\uff8c"],
  ["\u30d6", "\uff8c\uff9e"],
  ["\u30d7", "\uff8c\uff9f"],
  ["\u30d8", "\uff8d"],
  ["\u30d9", "\uff8d\uff9e"],
  ["\u30da", "\uff8d\uff9f"],
  ["\u30db", "\uff8e"],
  ["\u30dc", "\uff8e\uff9e"],
  ["\u30dd", "\uff8e\uff9f"],
  ["\u30de", "\uff8f"],
  ["\u30df", "\uff90"],
  ["\u30e0", "\uff91"],
  ["\u30e1", "\uff92"],
  ["\u30e2", "\uff93"],
  ["\u30e4", "\uff6c"],
  ["\u30e4", "\uff94"],
  ["\u30e5", "\uff6d"],
  ["\u30e6", "\uff95"],
  ["\u30e7", "\uff6e"],
  ["\u30e8", "\uff96"],
  ["\u30e9", "\uff97"],
  ["\u30ea", "\uff98"],
  ["\u30eb", "\uff99"],
  ["\u30ec", "\uff9a"],
  ["\u30ed", "\uff9b"],
  ["\u30ef", "\uff9c"],
  ["\u30f2", "\uff66"],
  ["\u30f3", "\uff9d"],
  ["\u30f4", "\uff73\uff9e"],
  ["\u30fb", "\uff65"],
  ["\u30fc", "\uff70"],
]);

export function toHalfwidthKatakana(str: string): string;
export function toHalfwidthKatakana(str: null): null;
export function toHalfwidthKatakana(str: undefined): undefined;
export function toHalfwidthKatakana(value: string | null | undefined) {
  if (!value) {
    return value;
  }

  const array = new Array<string>();
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
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
