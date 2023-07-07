export class MemoryReadableStream extends ReadableStream<Uint8Array> {
  constructor(input: Uint8Array | Uint8Array[]) {
    super({
      start(controller) {
        if (Array.isArray(input)) {
          for (const item of input) {
            controller.enqueue(item)
          }
        } else {
          controller.enqueue(input)
        }
        controller.close()
      }
    })
  }
}
