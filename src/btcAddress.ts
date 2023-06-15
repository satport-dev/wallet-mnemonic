const Mnemonic = require("bitcore-mnemonic");
import * as ecc from 'tiny-secp256k1'
import ECPairFactory, { ECPairInterface } from "ecpair";
import * as bitcoin from 'bitcoinjs-lib';
const ECPair = ECPairFactory(ecc);
/**
 * btc address type
 */
export enum AddressType {
    P2PKH,
    P2WPKH,
    P2TR,
    P2SH_P2WPKH,
    M44_P2WPKH,
    M44_P2TR
}
interface Bip32 {
    public: number;
    private: number;
}
export interface Network {
    messagePrefix: string;
    bech32: string;
    bip32: Bip32;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
}

/**
 * 获取网络信息
 * 
 * @example 
 * 
 * bitcoin: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};
 * 
 * @param networkType 
 * @returns 
 */
export function toPsbtNetwork(networkType: NetworkType): Network {
    if (networkType === NetworkType.MAINNET) {
        return bitcoin.networks.bitcoin;
    } else {
        return bitcoin.networks.testnet;
    }
}
/**
 * btc network type
 */
export enum NetworkType {
    MAINNET,
    TESTNET
}

export type BTCNETWORK = "livenet" | "testnet"

export function createRootFromMnemonic(mnemonic: string, hdPath: string, passphrase = "", network: BTCNETWORK = "livenet") {
    const hdWallet = new Mnemonic(mnemonic);
    const root = hdWallet.toHDPrivateKey(
        passphrase,
        network
    ).deriveChild(hdPath);
    console.log("root",root)
    return root
}

export function createBtcPublicKey(mnemonic: string, hdPath: string, passphrase = "", network: BTCNETWORK = "livenet", index: number = 0):[string,ECPairInterface] {
    const root = createRootFromMnemonic(mnemonic, hdPath, passphrase, network)
    const child = root.deriveChild(index);
    /** create private public keypair */
    const ecpair = ECPair.fromPrivateKey(child.privateKey.toBuffer());
    // get public key
    const publicKey = ecpair.publicKey.toString("hex");
    console.log("privateKey",ecpair.privateKey?.toString("hex"))
    return [publicKey, ecpair];
}

/**
 * 公钥到钱包地址
 * @param publicKey 
 * @param type 
 * @param networkType 
 * @returns 
 */
export function publicKeyToAddress(publicKey: string, type: AddressType, networkType: NetworkType) {
    const network = toPsbtNetwork(networkType);
    if (!publicKey) return '';
    const pubkey = Buffer.from(publicKey, 'hex');
    if (type === AddressType.P2PKH) {
        const { address } = bitcoin.payments.p2pkh({
            pubkey,
            network
        });
        return address || '';
    } else if (type === AddressType.P2WPKH || type === AddressType.M44_P2WPKH) {
        const { address } = bitcoin.payments.p2wpkh({
            pubkey,
            network
        });
        return address || '';
    } else if (type === AddressType.P2TR || type === AddressType.M44_P2TR) {
        const { address } = bitcoin.payments.p2tr({
            internalPubkey: pubkey.subarray(1, 33),
            network
        });
        return address || '';
    } else if (type === AddressType.P2SH_P2WPKH) {
        const data = bitcoin.payments.p2wpkh({
            pubkey,
            network
        });
        const { address } = bitcoin.payments.p2sh({
            pubkey,
            network,
            redeem: data
        });
        return address || '';
    } else {
        return '';
    }
}

export function getBtcAddress(mnemonic: string, addressType: AddressType, hdPath: string, network: NetworkType, passphrase = "", index: number = 0) {
    const net = network == NetworkType.MAINNET ? "livenet" : "testnet"
    const [pubKey, ecpair] = createBtcPublicKey(mnemonic, hdPath, passphrase, net, index)
    const address = publicKeyToAddress(pubKey, addressType, network);
    const adnet = toPsbtNetwork(network);
    const b= ECPair.fromPrivateKey(Buffer.from(ecpair.privateKey!.toString("hex"), 'hex'), { network:adnet }).toWIF();
    console.log("privatekey",b)
    return address
}