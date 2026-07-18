import { promises as fs } from "node:fs";
import { CsvReader } from "../src/CsvReader.ts";

const input = await fs.open("./data/decode.x-fujitsu-jef.csv");
const reader = new CsvReader(input, {
  skipEmptyLine: true,
});

const mappings: Array<{ code: string; unicode: string; sp?: string }> = [];
try {
  for await (const line of reader) {
    const [unicode, sp] = line[1].split("+");
    mappings.push({ code: line[0], unicode, sp });
  }
} finally {
  await reader.close();
  await input.close();
}

const output = await fs.open("./src/charset/JEFKanjiDecodeMap.ts", "w");
try {
  await output.write(
    `import { PackedMap } from "../util/PackedMap.ts";

export const JEFKanjiDecodeMap = new PackedMap((m) => {
`,
  );
  for (const mapping of mappings) {
    await output.write(`  m.set(0x${mapping.code}, 0x${mapping.unicode});\n`);
  }
  await output.write("});\n");

  const spMappings = mappings.filter((mapping) => mapping.sp != null);
  if (spMappings.length > 0) {
    await output.write(
      `
export const JEFKanjiDecodeSpMap = new PackedMap((m) => {
`,
    );
    for (const mapping of spMappings) {
      await output.write(`  m.set(0x${mapping.code}, 0x${mapping.sp});\n`);
    }
    await output.write("});\n");
  }
} finally {
  await output.close();
}
