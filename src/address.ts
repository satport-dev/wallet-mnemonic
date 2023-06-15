
import CryptoJS from "crypto-js";
import { bech32 } from "bech32"
import { Hash } from './hash'
import { toKeyPair } from './key'
import { encode } from './base58check'
export function getCosmosAddress(publicKey: Buffer): Uint8Array {
    console.log("buffer length", publicKey.length)
    let hash = CryptoJS.SHA256(
        CryptoJS.lib.WordArray.create(publicKey as any)
    ).toString();
    hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(hash)).toString();

    return new Uint8Array(Buffer.from(hash, "hex"));
}

export function toBech32(address: Uint8Array, prefix: string): string {
    const words = bech32.toWords(address);
    return bech32.encode(prefix, words);
}

export function toBytes(pubKey: Uint8Array, uncompressed?: boolean): Uint8Array {
    if (uncompressed && pubKey.length === 65) {
        return pubKey;
    }
    if (!uncompressed && pubKey.length === 33) {
        return pubKey;
    }

    const keyPair = toKeyPair(pubKey);
    if (uncompressed) {
        return new Uint8Array(
            Buffer.from(keyPair.getPublic().encode("hex", false), "hex")
        );
    } else {
        return new Uint8Array(
            Buffer.from(keyPair.getPublic().encodeCompressed("hex"), "hex")
        );
    }
}

export function getEthAddress(pubKey: Uint8Array): Uint8Array {
    return Hash.keccak256(toBytes(pubKey, true).slice(1)).slice(-20);
}


export function getSpAddress(pubKey: Uint8Array, prefix: string = "sp") {
    const addressArray = getCosmosAddress(Buffer.from(pubKey))
    return encode(addressArray,prefix)
}