export interface Encoder {
  get requiredBufferLength(): number;

  canEncode(cp: number): boolean

  encode(cp: number, buffer: Uint8Array): number;
}
