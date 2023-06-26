export interface Encoder {
  get requiredBufferLength(): number;

  encode(cp: number, buffer: Uint8Array): number;
}
