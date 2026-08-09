const STRING_CHUNK_SIZE = 0x1000;

export function fromCodeUnits(codeUnits: number[]) {
  const chunks: string[] = [];
  for (let i = 0; i < codeUnits.length; i += STRING_CHUNK_SIZE) {
    chunks.push(
      String.fromCharCode(...codeUnits.slice(i, i + STRING_CHUNK_SIZE)),
    );
  }
  return chunks.join("");
}

export function fromCodePoints(codePoints: number[]) {
  const chunks: string[] = [];
  for (let i = 0; i < codePoints.length; i += STRING_CHUNK_SIZE) {
    chunks.push(
      String.fromCodePoint(...codePoints.slice(i, i + STRING_CHUNK_SIZE)),
    );
  }
  return chunks.join("");
}
