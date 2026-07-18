import { promises as fs } from "node:fs";
import { CsvReader } from "../src/CsvReader.ts";
import { JISEncodeMap } from "../src/charset/JISEncodeMap.ts";

const input = await fs.open("./data/decode.x-fujitsu-jef.csv");
const reader = new CsvReader(input, {
  skipEmptyLine: true,
});

const mappings: Array<{ code: number; unicode: number; sp?: number }> = [];
try {
  for await (const line of reader) {
    const [unicode, sp] = line[1].split("+");
    mappings.push({
      code: Number.parseInt(line[0], 16),
      unicode: Number.parseInt(unicode, 16),
      sp: sp != null ? Number.parseInt(sp, 16) : undefined,
    });
  }
} finally {
  await reader.close();
  await input.close();
}

JISEncodeMap.initialize();
const jisMappings = new Map<number, number>();
for (let unicode = 0; unicode <= 0xffff; unicode++) {
  const jis = JISEncodeMap.get(unicode);
  if (jis != null) {
    // Match the reverse-map priority used by the generated runtime loop.
    jisMappings.set(jis + 0x8080, unicode);
  }
}

const mappingByCode = new Map(
  mappings.map((mapping) => [mapping.code, mapping.unicode]),
);
const exclusions = [...jisMappings.keys()]
  .filter((code) => !mappingByCode.has(code))
  .sort((a, b) => a - b);
const differences = mappings.filter(
  (mapping) => jisMappings.get(mapping.code) !== mapping.unicode,
);

const output = await fs.open("./src/charset/JEFKanjiDecodeMap.ts", "w");
try {
  await output.write(
    `import { PackedMap } from "../util/PackedMap.ts";
import { JISEncodeMap } from "./JISEncodeMap.ts";

// biome-ignore format: generated table
const JISDecodeExclusions = new Set([
`,
  );
  for (let i = 0; i < exclusions.length; i += 8) {
    await output.write(
      `  ${exclusions
        .slice(i, i + 8)
        .map((code) => `0x${code.toString(16)}`)
        .join(", ")},\n`,
    );
  }
  await output.write(
    `]);

export const JEFKanjiDecodeMap = new PackedMap((m) => {
`,
  );
  for (const mapping of differences) {
    await output.write(
      `  m.set(0x${mapping.code.toString(16)}, 0x${mapping.unicode.toString(16)});\n`,
    );
  }
  await output.write(
    `
  JISEncodeMap.initialize();
  for (let unicode = 0xffff; unicode >= 0; unicode--) {
    const jis = JISEncodeMap.get(unicode);
    if (jis != null) {
      const code = jis + 0x8080;
      if (!JISDecodeExclusions.has(code)) {
        m.set(code, unicode);
      }
    }
  }
});
`,
  );

  const spMappings = mappings.filter((mapping) => mapping.sp != null);
  if (spMappings.length > 0) {
    await output.write(
      `
export const JEFKanjiDecodeSpMap = new PackedMap((m) => {
`,
    );
    for (const mapping of spMappings) {
      await output.write(
        `  m.set(0x${mapping.code.toString(16)}, 0x${mapping.sp?.toString(16)});\n`,
      );
    }
    await output.write("});\n");
  }
} finally {
  await output.close();
}
