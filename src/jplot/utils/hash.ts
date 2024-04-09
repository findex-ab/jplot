import { isFloat } from './is';

const SEED = 817283;

export const hashu32 = (i: number, seed: number = SEED) => {
  i = toUint32(i)
  const s = ((i >> 3) * 12);
  const s2 = toUint32(seed);
  const k = toUint32(~i + ~s + ~s2 + (((~s2) >> 3) ^ (s2 << 17)));
  i ^= i << 17; i ^= i >> 13; i ^= i << 5;
  i += (i ^ k) + i * k; i *= 1013; i ^= (i >> 4);
  return toUint32(i * k + i + i * k + k);

}

export const hashf = (i: number, seed: number = SEED): number => {
  return hashu32(i, seed) / toUint32(0xFFFFFFFF);
}

export const hash21f = (ix: number, iy: number, is: number = 1.98472): number => {
  let x = toUint32(ix)
  let y = toUint32(iy)
  const s = toUint32(is)
  const kx = ~x
  const ky = ~y
  x = hashu32(x + s * 13)
  y = hashu32(y + s * 13)
  return toUint32(x * 5013 + y * 1013 + (ky * 5013 + kx * 1013)) / 0xffffffff
}

export const floatBitsToUint = (f: number): number => {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer)
  view.setFloat32(0, f)
  return view.getUint32(0)
}

export const toUint32 = (f: number): number => {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer)
  view.setUint32(0, isFloat(f) ? floatBitsToUint(f) : f)
  return view.getUint32(0)
}

export const hexToUint32 = (hex: string): number => {
  let stringValue = hex.replace('#', '').replace('0x', '');
  stringValue = stringValue.length < 8 ? `${stringValue}FF` : stringValue;
  stringValue = `0x${stringValue}`;
  return toUint32(parseInt(stringValue, 16));
}

export const nthByte = (val: number, n: number): number => {
  return (val >> (n * 8)) & 0xFF;
}
