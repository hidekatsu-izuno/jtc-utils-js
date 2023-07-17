import fs from "node:fs"

const dirs = [
  "./cjs",
  "./lib",
  "./types",
]

for (const dir of dirs) {
  fs.rmSync(dir, { recursive:true, force:true })
}
