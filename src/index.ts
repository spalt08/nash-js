import { s2i, i2h } from './utils';

// Key Constants
const _c = new Uint32Array([
  0x99fcef34, 0x3fda8279, // sqrt(2)
  0xd0b09954, 0x3fe76cf5, // sqrt(3)
  0xb97f4a80, 0x3fce3779, // sqrt(5)
  0xa74be3a8, 0x3fe4a9fe, // sqrt(7)  
  0x9feb79a0, 0x3fd44394, // sqrt(11)
  0x118567cc, 0x3fe360ad, // sqrt(13)
  0xabfb41c0, 0x3fbf83d9, // sqrt(17)
]);

// Key Extension
// temp: 64 block size only
function extendKeyFrom(src: string | Uint32Array): Uint32Array {
  if (typeof src === 'string') src = s2i(src);

  const rounds = 24 + 2;
  const key = new Uint32Array(rounds);

  if (src.length > 8) throw new Error('Initial key is too long');

  let i = 0;
  for (; i < src.length; i++) key[i] = src[i];
  for (let j = 0; j + i < 8; j++) key[i + j] = _c[j * 2];
  for (; i < rounds; i++) key[i] = i ^ key[(i % 6) + 2];

  return key;
}

// temp
function sum2n(x: number, y: number): number {
  return x ^ y;
}

// temp: only for 64 bit blocks
function F(a: number, b: number) {
  // to do: bool function
  a = a % 2;
  b = b % 2;

  if (a > 0 && b > 0) return 19;
  if (a > 0 && b === 0) return 10;
  if (a === 0 && b > 0) return 14;

  return 11;
}

// Message Encryption
// temp: only for 64 bit blocks
export default function encrypt(message: string | Uint32Array, key: string | Uint32Array): string {
  if (typeof message === 'string') message = s2i(message);
  const c = extendKeyFrom(key);
  const out = new Uint32Array(message.length);

  for(let i = 0; i < message.length; i += 2) {
    let left = message[i];
    let right = message[i + 1]; 
    let leftKey = c[0];
    let rightKey = c[1];

    // round functions
    for (let r = 0; r < 24; r++) {
      const tmp = left; 
      const tmpKey = leftKey;

      // round key
      leftKey = (sum2n(leftKey, c[r + 2]) >>> F(leftKey, sum2n(leftKey, c[r + 2]))) ^ rightKey;
      rightKey = tmpKey;

      // round block
      left = (sum2n(left, leftKey) >>> F(left, sum2n(leftKey, leftKey))) ^ right;
      right = tmp;

      console.log(left);
    }
    
    out[i] = left;
    out[i + 1] = right;
  }
  
  return i2h(out);
}
