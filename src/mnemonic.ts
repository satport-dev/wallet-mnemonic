import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer/'
import * as crypto from 'crypto'
export type RNGFN = (array: Uint8Array) => Uint8Array


export const RGN: RNGFN = (array: Uint8Array): Uint8Array => {
    return crypto.getRandomValues(array)
}

export function generateMnemonics(rng: RNGFN, strength: number = 128): string {
    if (strength % 32 !== 0) {
        throw new TypeError("invalid entropy");
    }
    let bytes = new Uint8Array(strength / 8);
    bytes = rng(bytes);
    let hex = Buffer.from(bytes).toString("hex")
    return bip39.entropyToMnemonic(hex);
}

export function generateMnemonicsToSeedSync(mnemonic:string,password:string=""){
    const seed = bip39.mnemonicToSeedSync(mnemonic,password)
    return seed
}

export async function generateMnemonicsToSeed(mnemonic:string,password:string=""){
    const seed = await bip39.mnemonicToSeed(mnemonic,password)
    return seed
}

export function validateMnemonic(mnemonic:string):boolean{
    return bip39.validateMnemonic(mnemonic)
}

