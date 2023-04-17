import fs from "node:fs/promises"

const fd = await fs.open("./data/mji.00601.csv")

try {
  let buf
  for await (const chunk of fd.createReadStream({
    encoding: "utf-8"
  })) {
    buf = buf ? buf + chunk : chunk
    let start = 0
    let pos
    while ((pos = buf.indexOf("\n", start)) != -1) {
      if (buf.charAt(pos - 1) === "\r") {
        step(buf.substring(start, pos - 1))
      } else {
        step(buf.substring(start, pos))
      }
      start = pos + 1
    }
    if (start < buf.length) {
      buf = buf.substring(start)
    } else {
      buf = null
    }
  }
  if (buf) {
    step(buf)
  }
} finally {
  await fd.close()
}

function step(line: string) {
  const m = line.match(/^(?:[^,]*,){3}(U\+[^,]*),/)
  const cp = m?.[1]
  if (!cp) {
    return
  }

  const root = new Array<Array<number>>()

}
