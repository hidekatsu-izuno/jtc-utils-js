
export function toZenginKana(value?: string) {
  if (!value) {
    return null
  }

  let result = ""
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i)
    result += toZenginKanaChar(c)
  }
  return result
}

const M = new Map<string, string>([
	["\u002C", "\u002E"],
	["\u005B", "\u0028"],
	["\u005D", "\u0029"],
	["\u007B", "\u0028"],
	["\u007D", "\u0029"],
	["\u3014", "\u0028"],
	["\u3015", "\u0029"],
	["\u3000", "\u0020"],
	["\u3001", "\u002e"],
	["\u3002", "\u002e"],
	["\u300c", "\uff62"],
	["\u300d", "\uff63"],
	["\u3099", "\uff9e"],
	["\u309a", "\uff9f"],
	["\u30a1", "\uff71"],
	["\u30a2", "\uff71"],
	["\u30a3", "\uff72"],
	["\u30a4", "\uff72"],
	["\u30a5", "\uff73"],
	["\u30a6", "\uff73"],
	["\u30a7", "\uff74"],
	["\u30a8", "\uff74"],
	["\u30a9", "\uff75"],
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
	["\u30c3", "\uff82"],
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
	["\u30e3", "\uff94"],
	["\u30e4", "\uff94"],
	["\u30e5", "\uff95"],
	["\u30e6", "\uff95"],
	["\u30e7", "\uff96"],
	["\u30e8", "\uff96"],
	["\u30e9", "\uff97"],
	["\u30ea", "\uff98"],
	["\u30eb", "\uff99"],
	["\u30ec", "\uff9a"],
	["\u30ed", "\uff9b"],
	["\u30ef", "\uff9c"],
	["\u30f2", "\uff75"],
	["\u30f3", "\uff9d"],
	["\u30f4", "\uff73\uff9e"],
	["\u30f7", "\uff9c\uff9e"],
	["\u30fa", "\uff75\uff9e"],
	["\u30fb", "\u002e"],
	["\u30fc", "\u002d"],
	["\uff08", "\u0028"],
	["\uff09", "\u0029"],
	["\uff0c", "\u002e"],
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
	["\uff3b", "\u0028"],
	["\uff3c", "\u005c"],
	["\uff3d", "\u0029"],
	["\uff41", "\u0041"],
	["\uff42", "\u0042"],
	["\uff43", "\u0043"],
	["\uff44", "\u0044"],
	["\uff45", "\u0045"],
	["\uff46", "\u0046"],
	["\uff47", "\u0047"],
	["\uff48", "\u0048"],
	["\uff49", "\u0049"],
	["\uff4a", "\u004a"],
	["\uff4b", "\u004b"],
	["\uff4c", "\u004c"],
	["\uff4d", "\u004d"],
	["\uff4e", "\u004e"],
	["\uff4f", "\u004f"],
	["\uff50", "\u0050"],
	["\uff51", "\u0051"],
	["\uff52", "\u0052"],
	["\uff53", "\u0053"],
	["\uff54", "\u0054"],
	["\uff55", "\u0055"],
	["\uff56", "\u0056"],
	["\uff57", "\u0057"],
	["\uff58", "\u0058"],
	["\uff59", "\u0059"],
	["\uff5a", "\u005a"],
	["\uff5b", "\u0028"],
	["\uff5d", "\u0029"],
	["\uffe5", "\u005c"],
])

function toZenginKanaChar(c: string) {
  return M.get(c) ?? c
}
