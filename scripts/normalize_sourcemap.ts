import { promises as fs } from "node:fs"
import path from "node:path"


async function normalizeSourceMap(file: string) {
  let content = await fs.readFile(file, { encoding: "utf-8" })
  content = content.replace(/(,\s*)?"sourcesContent"\s*:\s*\[\s*("(\\"|[^"])*"\s*(,\s*"(\\"|[^"])*"\s*)*)?\]/, "")
  await fs.writeFile(file, content, { encoding: "utf-8" })
}

const traverse = async (dir: string) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await traverse(path.join(dir, entry.name))
    }
    if (entry.isFile() && entry.name.endsWith(".map")) {
      await normalizeSourceMap(path.join(dir, entry.name))
    }
  }
}

await traverse("./cjs")
await traverse("./lib")
