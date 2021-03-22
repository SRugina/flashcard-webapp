const HASH = "SHA-256";
const ITERATIONS = 3e4;

export const random128bit = () => {
  return crypto.getRandomValues(new Uint8Array(16));
};

export const encodeHex = (input: Uint8Array) => {
  return input.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
};

const EVERY_2_REGEXP = /.{1,2}/g; // split input into groups of 2

export const decodeHex = (input: string) => {
  return Uint8Array.from(
    input.match(EVERY_2_REGEXP)!.map((val) => parseInt(val, 16))
  );
};

const getHashLength = (hash: string) => {
  switch (hash) {
    case "SHA-1":
      return 160;
    case "SHA-256":
      return 256;
    case "SHA-384":
      return 384;
    case "SHA-512":
      return 512;
  }

  throw new Error("Unsupported hash function");
};

const deriveBits = async (
  input: string,
  salt: BufferSource,
  hash: string,
  iterations: number
) => {
  input = input.normalize("NFC");
  // Convert string to a TypedArray.
  const bytes = new TextEncoder().encode(input);

  // Create the base key to derive from.
  const importedKey = await crypto.subtle.importKey(
    "raw",
    bytes,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // Output length in bits for the given hash function.
  const hlen = getHashLength(hash);

  // All required PBKDF2 parameters.
  const params = { name: "PBKDF2", hash, salt, iterations } as Pbkdf2Params;

  // Derive |hlen| bits using PBKDF2.
  const bitBuffer = await crypto.subtle.deriveBits(params, importedKey, hlen);
  return encodeHex(new Uint8Array(bitBuffer));
};

export const hash = async (input: string) => {
  // Generate a new random salt for every new passcode.
  const salt = random128bit();

  const bits = await deriveBits(input, salt, HASH, ITERATIONS);

  return `${bits}::${encodeHex(salt)}::${HASH}::${String(ITERATIONS)}`;
};

export const verify = async (input: string, hash: string) => {
  if (hash.length === 0) {
    // hash of an empty password i.e. impossible to succeed a match
    hash =
      "8119aa2efef908b5043e929420e3035672f88917fa7b4142eb549bbbf710e433::33324951230a64ed6cbe8970eab844af::SHA-256::30000";
  }
  const [digest, salt, hashName, iterations] = hash.split("::");
  const bits = await deriveBits(
    input,
    decodeHex(salt),
    hashName,
    Number(iterations)
  );

  return compare(bits, digest);
};

const compare = (a: string, b: string) => {
  let eq = true;
  // Check each char of the string
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a.length >= i && b.length >= i && a[i] !== b[i]) {
      eq = false;
    }
  }
  return eq;
};
