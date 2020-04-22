import { s2i, i2h, h2i, i2s } from './utils';

// Key Constants
const _c = new Uint32Array([
  0xdef933f3, 0x04b5ff3f, // sqrt(2)
  0x65c242d7, 0xb3ddff3f, // sqrt(3)
  0xa5bfdcbc, 0x1b8f0040, // sqrt(5)
  0xc7974efd, 0x53a90040, // sqrt(7)
  0x79eb9f94, 0x43d40040, // sqrt(11)
  0xcf0a235a, 0xc1e60040, // sqrt(13)
  0x687f357b, 0xf0830140, // sqrt(17)
  0x6f22a319, 0x7c8b0140, // sqrt(19)
]);

const ROUNDS = 24;

// temp: only for 64 bit blocks
function F(a: number, b: number) {
  // to do: bool function
  a %= 2;
  b %= 2;

  if (a > 0 && b > 0) return 19;
  if (a > 0 && b === 0) return 10;
  if (a === 0 && b > 0) return 14;

  return 11;
}

// temp XOR
function sum2n(x: number, y: number): number {
  return (x ^ y) >>> 0;
}

// rot right (cycle)
function rot(x: number, N: number) {
  return ((x >> N) | (x << (32 - N))) >>> 0;
}

// Key Extension
// temp: 64 block size only
function extendKeyFrom(src: string | Uint32Array): Uint32Array {
  if (typeof src === 'string') src = s2i(src);

  const c = new Uint32Array(ROUNDS + 2);

  if (src.length > 8) throw new Error('Initial key is too long');

  // constants
  let i = 0;
  for (; i < src.length; i++) c[i] = src[i];
  for (let j = 0; j + i < 8; j++) c[i + j] = _c[j * 2];
  for (; i < ROUNDS; i++) c[i] = i ^ c[(i % 6) + 2];

  // key blocks
  const keys = new Uint32Array(ROUNDS);
  let L = c[0];
  let R = c[1];

  // key rounds
  for (i = 0; i < ROUNDS; i++) {
    keys[i] = (rot(sum2n(L, c[i + 2]), F(L, sum2n(L, c[i + 2]))) ^ R >>> 0);
    R = L;
    L = keys[i];
  }

  return keys;
}

// Message Encryption
// temp: only for 64 bit blocks
function encrypt(message: string | Uint32Array, key: string | Uint32Array): Uint32Array {
  if (typeof message === 'string') message = s2i(message);
  key = extendKeyFrom(key);

  const out = new Uint32Array(message.length);

  // for each block
  for (let i = 0; i < message.length; i += 2) {
    let L = message[i];
    let R = message[i + 1];

    // round function
    for (let r = 0; r < ROUNDS; r++) {
      const tmp = L;

      // round block
      L = (rot(sum2n(L, key[r]), F(L, sum2n(L, key[r]))) ^ R) >>> 0;
      R = tmp;
    }

    out[i] = L;
    out[i + 1] = R;
  }

  return out;
}

// Message Decryption
// temp: only for 64 bit blocks
function decrypt(message: string | Uint32Array, key: string | Uint32Array): Uint32Array {
  if (typeof message === 'string') message = s2i(message);
  key = extendKeyFrom(key);

  const out = new Uint32Array(message.length);

  // for each block
  for (let i = 0; i < message.length; i += 2) {
    let L = message[i];
    let R = message[i + 1];

    // round function
    for (let r = ROUNDS - 1; r >= 0; r--) {
      const tmp = R;

      // round block
      R = (L ^ rot(sum2n(R, key[r]), F(R, sum2n(R, key[r])))) >>> 0;
      L = tmp;
    }

    out[i] = L;
    out[i + 1] = R;
  }

  return out;
}

export default {
  encrypt,
  decrypt,
  i2h,
  h2i,
  s2i,
  i2s,
};
