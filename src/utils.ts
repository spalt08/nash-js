export function s2i(text: string): Uint32Array {
  const buf = new Uint32Array(text.length / 4);

  for (let i = 0; i < text.length; i += 4) {
    buf[i / 4] = (
      (text.charCodeAt(i) & 0xFF) << 24
    ^ (text.charCodeAt(i + 1) & 0xFF) << 16
    ^ (text.charCodeAt(i + 2) & 0xFF) << 8
    ^ (text.charCodeAt(i + 3) & 0xFF)
    );
  }

  return buf;
}

export function i2h(buf: Uint32Array): string {
  let hex = '';

  for (let i = 0; i < buf.length; i++) {
    hex += `00000000${buf[i].toString(16)}`.slice(-8);
  }

  return hex;
}
