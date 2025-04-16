const M = new Map<string, string>([
  ["\u0020", "\u3000"],
  ["\u0021", "\uff01"],
  ["\u0022", "\uff02"],
  ["\u0023", "\uff03"],
  ["\u0024", "\uff04"],
  ["\u0025", "\uff05"],
  ["\u0026", "\uff06"],
  ["\u0027", "\uff07"],
  ["\u0028", "\uff08"],
  ["\u0029", "\uff09"],
  ["\u002a", "\uff0a"],
  ["\u002b", "\uff0b"],
  ["\u002c", "\uff0c"],
  ["\u002d", "\uff0d"],
  ["\u002e", "\uff0e"],
  ["\u002f", "\uff0f"],
  ["\u0030", "\uff10"],
  ["\u0031", "\uff11"],
  ["\u0032", "\uff12"],
  ["\u0033", "\uff13"],
  ["\u0034", "\uff14"],
  ["\u0035", "\uff15"],
  ["\u0036", "\uff16"],
  ["\u0037", "\uff17"],
  ["\u0038", "\uff18"],
  ["\u0039", "\uff19"],
  ["\u003a", "\uff1a"],
  ["\u003b", "\uff1b"],
  ["\u003c", "\uff1c"],
  ["\u003d", "\uff1d"],
  ["\u003e", "\uff1e"],
  ["\u003f", "\uff1f"],
  ["\u0040", "\uff20"],
  ["\u0041", "\uff21"],
  ["\u0042", "\uff22"],
  ["\u0043", "\uff23"],
  ["\u0044", "\uff24"],
  ["\u0045", "\uff25"],
  ["\u0046", "\uff26"],
  ["\u0047", "\uff27"],
  ["\u0048", "\uff28"],
  ["\u0049", "\uff29"],
  ["\u004a", "\uff2a"],
  ["\u004b", "\uff2b"],
  ["\u004c", "\uff2c"],
  ["\u004d", "\uff2d"],
  ["\u004e", "\uff2e"],
  ["\u004f", "\uff2f"],
  ["\u0050", "\uff30"],
  ["\u0051", "\uff31"],
  ["\u0052", "\uff32"],
  ["\u0053", "\uff33"],
  ["\u0054", "\uff34"],
  ["\u0055", "\uff35"],
  ["\u0056", "\uff36"],
  ["\u0057", "\uff37"],
  ["\u0058", "\uff38"],
  ["\u0059", "\uff39"],
  ["\u005a", "\uff3a"],
  ["\u005b", "\uff3b"],
  ["\u005c", "\uff3c"],
  ["\u005d", "\uff3d"],
  ["\u005e", "\uff3e"],
  ["\u005f", "\uff3f"],
  ["\u0060", "\uff40"],
  ["\u0061", "\uff41"],
  ["\u0062", "\uff42"],
  ["\u0063", "\uff43"],
  ["\u0064", "\uff44"],
  ["\u0065", "\uff45"],
  ["\u0066", "\uff46"],
  ["\u0067", "\uff47"],
  ["\u0068", "\uff48"],
  ["\u0069", "\uff49"],
  ["\u006a", "\uff4a"],
  ["\u006b", "\uff4b"],
  ["\u006c", "\uff4c"],
  ["\u006d", "\uff4d"],
  ["\u006e", "\uff4e"],
  ["\u006f", "\uff4f"],
  ["\u0070", "\uff50"],
  ["\u0071", "\uff51"],
  ["\u0072", "\uff52"],
  ["\u0073", "\uff53"],
  ["\u0074", "\uff54"],
  ["\u0075", "\uff55"],
  ["\u0076", "\uff56"],
  ["\u0077", "\uff57"],
  ["\u0078", "\uff58"],
  ["\u0079", "\uff59"],
  ["\u007a", "\uff5a"],
  ["\u007b", "\uff5b"],
  ["\u007c", "\uff5c"],
  ["\u007d", "\uff5d"],
  ["\u007e", "\uff5e"],
  ["\u00a2", "\uffe0"],
  ["\u00a3", "\uffe1"],
  ["\u00a5", "\uffe5"],
  ["\u00a6", "\uffe4"],
  ["\u00ac", "\uffe2"],
  ["\u00af", "\uffe3"],
  ["\u20a9", "\uffe6"],
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
  ["\uffa0", "\u1160"],
  ["\uffa1", "\u1100"],
  ["\uffa2", "\u1101"],
  ["\uffa3", "\u11aa"],
  ["\uffa4", "\u1102"],
  ["\uffa5", "\u11ac"],
  ["\uffa6", "\u11ad"],
  ["\uffa7", "\u1103"],
  ["\uffa8", "\u1104"],
  ["\uffa9", "\u1105"],
  ["\uffaa", "\u11b0"],
  ["\uffab", "\u11b1"],
  ["\uffac", "\u11b2"],
  ["\uffad", "\u11b3"],
  ["\uffae", "\u11b4"],
  ["\uffaf", "\u11b5"],
  ["\uffb0", "\u111a"],
  ["\uffb1", "\u1106"],
  ["\uffb2", "\u1107"],
  ["\uffb3", "\u1108"],
  ["\uffb4", "\u1121"],
  ["\uffb5", "\u1109"],
  ["\uffb6", "\u110a"],
  ["\uffb7", "\u110b"],
  ["\uffb8", "\u110c"],
  ["\uffb9", "\u110d"],
  ["\uffba", "\u110e"],
  ["\uffbb", "\u110f"],
  ["\uffbc", "\u1110"],
  ["\uffbd", "\u1111"],
  ["\uffbe", "\u1112"],
  ["\uffc2", "\u1161"],
  ["\uffc3", "\u1162"],
  ["\uffc4", "\u1163"],
  ["\uffc5", "\u1164"],
  ["\uffc6", "\u1165"],
  ["\uffc7", "\u1166"],
  ["\uffca", "\u1167"],
  ["\uffcb", "\u1168"],
  ["\uffcc", "\u1169"],
  ["\uffcd", "\u116a"],
  ["\uffce", "\u116b"],
  ["\uffcf", "\u116c"],
  ["\uffd2", "\u116d"],
  ["\uffd3", "\u116e"],
  ["\uffd4", "\u116f"],
  ["\uffd5", "\u1170"],
  ["\uffd6", "\u1171"],
  ["\uffd7", "\u1172"],
  ["\uffda", "\u1173"],
  ["\uffdb", "\u1174"],
  ["\uffdc", "\u1175"],
  ["\uffe8", "\u2502"],
  ["\uffe9", "\u2190"],
  ["\uffea", "\u2191"],
  ["\uffeb", "\u2192"],
  ["\uffec", "\u2193"],
  ["\uffed", "\u25a0"],
  ["\uffee", "\u25cb"],
]);

export function toFullwidth(str: string): string;
export function toFullwidth(str: null): null;
export function toFullwidth(str: undefined): undefined;
export function toFullwidth(value: string | null | undefined) {
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
