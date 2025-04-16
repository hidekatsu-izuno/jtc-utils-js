const M = new Map<string, string>([
  ["\u1100", "\uffa1"],
  ["\u1101", "\uffa2"],
  ["\u1102", "\uffa4"],
  ["\u1103", "\uffa7"],
  ["\u1104", "\uffa8"],
  ["\u1105", "\uffa9"],
  ["\u1106", "\uffb1"],
  ["\u1107", "\uffb2"],
  ["\u1108", "\uffb3"],
  ["\u1109", "\uffb5"],
  ["\u110a", "\uffb6"],
  ["\u110b", "\uffb7"],
  ["\u110c", "\uffb8"],
  ["\u110d", "\uffb9"],
  ["\u110e", "\uffba"],
  ["\u110f", "\uffbb"],
  ["\u1110", "\uffbc"],
  ["\u1111", "\uffbd"],
  ["\u1112", "\uffbe"],
  ["\u111a", "\uffb0"],
  ["\u1121", "\uffb4"],
  ["\u1160", "\uffa0"],
  ["\u1161", "\uffc2"],
  ["\u1162", "\uffc3"],
  ["\u1163", "\uffc4"],
  ["\u1164", "\uffc5"],
  ["\u1165", "\uffc6"],
  ["\u1166", "\uffc7"],
  ["\u1167", "\uffca"],
  ["\u1168", "\uffcb"],
  ["\u1169", "\uffcc"],
  ["\u116a", "\uffcd"],
  ["\u116b", "\uffce"],
  ["\u116c", "\uffcf"],
  ["\u116d", "\uffd2"],
  ["\u116e", "\uffd3"],
  ["\u116f", "\uffd4"],
  ["\u1170", "\uffd5"],
  ["\u1171", "\uffd6"],
  ["\u1172", "\uffd7"],
  ["\u1173", "\uffda"],
  ["\u1174", "\uffdb"],
  ["\u1175", "\uffdc"],
  ["\u11aa", "\uffa3"],
  ["\u11ac", "\uffa5"],
  ["\u11ad", "\uffa6"],
  ["\u11b0", "\uffaa"],
  ["\u11b1", "\uffab"],
  ["\u11b2", "\uffac"],
  ["\u11b3", "\uffad"],
  ["\u11b4", "\uffae"],
  ["\u11b5", "\uffaf"],
  ["\u2190", "\uffe9"],
  ["\u2191", "\uffea"],
  ["\u2192", "\uffeb"],
  ["\u2193", "\uffec"],
  ["\u2502", "\uffe8"],
  ["\u25a0", "\uffed"],
  ["\u25cb", "\uffee"],
  ["\u3000", "\u0020"],
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
  ["\u3099", "\uff9e"],
  ["\u309a", "\uff9f"],
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
  ["\u30e3", "\uff6c"],
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
  ["\u30f7", "\uff9c\uff9e"],
  ["\u30fa", "\uff66\uff9e"],
  ["\u30fb", "\uff65"],
  ["\u30fc", "\uff70"],
  ["\uff01", "\u0021"],
  ["\uff02", "\u0022"],
  ["\uff03", "\u0023"],
  ["\uff04", "\u0024"],
  ["\uff05", "\u0025"],
  ["\uff06", "\u0026"],
  ["\uff07", "\u0027"],
  ["\uff08", "\u0028"],
  ["\uff09", "\u0029"],
  ["\uff0a", "\u002a"],
  ["\uff0b", "\u002b"],
  ["\uff0c", "\u002c"],
  ["\uff0d", "\u002d"],
  ["\uff0e", "\u002e"],
  ["\uff0f", "\u002f"],
  ["\uff10", "\u0030"],
  ["\uff11", "\u0031"],
  ["\uff12", "\u0032"],
  ["\uff13", "\u0033"],
  ["\uff14", "\u0034"],
  ["\uff15", "\u0035"],
  ["\uff16", "\u0036"],
  ["\uff17", "\u0037"],
  ["\uff18", "\u0038"],
  ["\uff19", "\u0039"],
  ["\uff1a", "\u003a"],
  ["\uff1b", "\u003b"],
  ["\uff1c", "\u003c"],
  ["\uff1d", "\u003d"],
  ["\uff1e", "\u003e"],
  ["\uff1f", "\u003f"],
  ["\uff20", "\u0040"],
  ["\uff21", "\u0041"],
  ["\uff22", "\u0042"],
  ["\uff23", "\u0043"],
  ["\uff24", "\u0044"],
  ["\uff25", "\u0045"],
  ["\uff26", "\u0046"],
  ["\uff27", "\u0047"],
  ["\uff28", "\u0048"],
  ["\uff29", "\u0049"],
  ["\uff2a", "\u004a"],
  ["\uff2b", "\u004b"],
  ["\uff2c", "\u004c"],
  ["\uff2d", "\u004d"],
  ["\uff2e", "\u004e"],
  ["\uff2f", "\u004f"],
  ["\uff30", "\u0050"],
  ["\uff31", "\u0051"],
  ["\uff32", "\u0052"],
  ["\uff33", "\u0053"],
  ["\uff34", "\u0054"],
  ["\uff35", "\u0055"],
  ["\uff36", "\u0056"],
  ["\uff37", "\u0057"],
  ["\uff38", "\u0058"],
  ["\uff39", "\u0059"],
  ["\uff3a", "\u005a"],
  ["\uff3b", "\u005b"],
  ["\uff3c", "\u005c"],
  ["\uff3d", "\u005d"],
  ["\uff3e", "\u005e"],
  ["\uff3f", "\u005f"],
  ["\uff40", "\u0060"],
  ["\uff41", "\u0061"],
  ["\uff42", "\u0062"],
  ["\uff43", "\u0063"],
  ["\uff44", "\u0064"],
  ["\uff45", "\u0065"],
  ["\uff46", "\u0066"],
  ["\uff47", "\u0067"],
  ["\uff48", "\u0068"],
  ["\uff49", "\u0069"],
  ["\uff4a", "\u006a"],
  ["\uff4b", "\u006b"],
  ["\uff4c", "\u006c"],
  ["\uff4d", "\u006d"],
  ["\uff4e", "\u006e"],
  ["\uff4f", "\u006f"],
  ["\uff50", "\u0070"],
  ["\uff51", "\u0071"],
  ["\uff52", "\u0072"],
  ["\uff53", "\u0073"],
  ["\uff54", "\u0074"],
  ["\uff55", "\u0075"],
  ["\uff56", "\u0076"],
  ["\uff57", "\u0077"],
  ["\uff58", "\u0078"],
  ["\uff59", "\u0079"],
  ["\uff5a", "\u007a"],
  ["\uff5b", "\u007b"],
  ["\uff5c", "\u007c"],
  ["\uff5d", "\u007d"],
  ["\uff5e", "\u007e"],
  ["\uffe0", "\u00a2"],
  ["\uffe1", "\u00a3"],
  ["\uffe2", "\u00ac"],
  ["\uffe3", "\u00af"],
  ["\uffe4", "\u00a6"],
  ["\uffe5", "\u00a5"],
  ["\uffe6", "\u20a9"],
]);

export function toHalfwidth(str: string): string;
export function toHalfwidth(str: null): null;
export function toHalfwidth(str: undefined): undefined;
export function toHalfwidth(value: string | null | undefined) {
  if (!value) {
    return value;
  }

  const array = [];
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
