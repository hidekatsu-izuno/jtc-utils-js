import { promises as fs } from "node:fs";
import { CsvReader } from "../src/CsvReader.ts";

const input = await fs.open("./data/map.fullwidth-katakana.csv");
const reader = new CsvReader(input, {
  skipEmptyLine: true,
});
try {
  const output = await fs.open("./src/toFullwidthKatakana.ts", "w");
  try {
    await output.write("const M = new Map<string, string>([\n");
    for await (const line of reader) {
      if (reader.count === 1) {
        continue;
      }
      const from = line[0].padStart(4, "0").replace(/(.{4})/g, "\\u$1");
      const to = line[1].padStart(4, "0").replace(/(.{4})/g, "\\u$1");
      await output.write(`\t["${from}", "${to}"],\n`);
    }
    await output.write(`]);

export function toFullwidthKatakana(str: string): string;
export function toFullwidthKatakana(str: null): null;
export function toFullwidthKatakana(str: undefined): undefined;
export function toFullwidthKatakana(value: string | null | undefined) {
  if (!value) {
    return value;
  }

  const array = [];
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
    if (i + 1 < value.length) {
      const c2 = value.charAt(i + 1);
      if (c2 === "\\u3099" || c2 === "\\u309A" || c2 === "\\uFF9E" || c2 === "\\uFF9F") {
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
`);
  } finally {
    await output.close();
  }
} finally {
  await reader.close();
}
