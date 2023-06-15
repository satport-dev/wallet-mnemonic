import { BIP32Factory, BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1'
import { ec } from "elliptic";

export async function generatePrivateKey(seed: globalThis.Buffer, path: string = `m/44'/118'/0'/0/0`): Promise<Buffer> {
    const bip32 = BIP32Factory(ecc);
    const masterSeed = bip32.fromSeed(seed);
    const hd = masterSeed.derivePath(path);
    const privateKey = hd.privateKey;
    if (!privateKey) {
        throw new Error("null hd key");
    }
    return privateKey;
}

export function generateKeyPair(privateKey: Buffer): ec.KeyPair {
    const secp256k1 = new ec("secp256k1");
    const keyPair = secp256k1.keyFromPrivate(privateKey);
    return keyPair
}

export type KeyPair = {
    publicKey: string
    pubKey: number[]
    privateKey: string
    priKey: Buffer
}
export function getKey(privateKey: Buffer): KeyPair {
    const keyPair = generateKeyPair(privateKey)
    return {
        publicKey: keyPair.getPublic("hex"),
        privateKey: keyPair.getPrivate("hex"),
        pubKey: keyPair.getPublic().encodeCompressed("array"),
        priKey: privateKey
    }
}

export function toKeyPair(pubKey:Uint8Array): ec.KeyPair {
    const secp256k1 = new ec("secp256k1");

    return secp256k1.keyFromPublic(
      Buffer.from(pubKey).toString("hex"),
      "hex"
    );
  }