export function isTypedArray(obj: any): obj is (
  Int8Array | Int16Array | Int32Array | BigInt64Array |
  Uint8Array | Uint16Array | Uint32Array | BigUint64Array |
  Uint8ClampedArray |
  Float32Array | Float64Array
) {
  return ArrayBuffer.isView(obj) && !(obj instanceof DataView)
}
