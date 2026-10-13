// Small deterministic helpers shared by the sanitiser (what the browser sees)
// and the marker (what the server checks), so both agree on ids and order.

// FNV-1a 32-bit hash -> short base36 string. Used to give "order" lines ids
// that don't reveal their position or whether they are distractors.
export function hashId(text) {
  let h = 0x811c9dc5;
  const s = String(text);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

// mulberry32 PRNG, so a shuffle is stable across reloads for the same seed
function seededRandom(seed) {
  let a = parseInt(hashId(seed), 36);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(items, seed) {
  const rand = seededRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  // never hand the student the answer already in order
  if (out.length > 1 && out.every((item, i) => item === items[i])) {
    out.push(out.shift());
  }
  return out;
}

// The id every order line gets, on both server and client
export function orderLineId(part, content) {
  return hashId(`${part.id ?? ''}|${content}`);
}
