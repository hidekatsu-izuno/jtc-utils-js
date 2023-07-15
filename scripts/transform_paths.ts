import { promises as fs } from "node:fs"

const files = [
  "module/locale/index.js",
  "module/locale/jaJPUCaJapanese.js",
]

for (const filename of files) {
  let file: fs.FileHandle | undefined
  let content: string | undefined
  try {
    file = await fs.open(filename, "r")
    content = await file.readFile({ encoding: "utf-8" })
  } finally {
    await file?.close()
  }

  content = content.replace(/"date-fns\/locale"/g, '"date-fns/esm/locale"')

  try {
    file = await fs.open(filename, "w")
    await file.writeFile(content, { encoding: "utf-8" })
  } finally {
    await file?.close()
  }
}
