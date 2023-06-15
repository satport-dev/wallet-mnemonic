import {AddressType, generateKeyPair,generateMnemonicsToSeedSync,generatePrivateKey, getBtcAddress, getCosmosAddress, getEthAddress, getKey, NetworkType, toBech32} from '../src'

let mnemonic ="input fit age retreat ship problem warm cargo census genre trash exact"
// eth
let path: string = `m/44'/60'/0'/0/0`
// btc
const hdPathString = "m/44'/0'/0'/0";

async function generateEthAddress(){
    let seed = generateMnemonicsToSeedSync(mnemonic,"")
    const privatekey = await generatePrivateKey(seed,path)
    const pair =  generateKeyPair(privatekey)
    console.log(pair.getPrivate().toString("hex"))
    const Key = getKey(privatekey)
    console.log("privatekey",Key.privateKey)
    //3d3194966efc5951ab5054f613ffdb84595ad21f46410c2824874e50655af11f
    //3d3194966efc5951ab5054f613ffdb84595ad21f46410c2824874e50655af11f
    
    let EthAddress=getEthAddress(new Uint8Array(Key.pubKey))
    const hex = Buffer.from(EthAddress).toString("hex");
    console.log("0x"+hex)
    //0x59c6176de6df8ff7c03a8461854201ae4ee1d41b
    //0x53d1b5833a7cbb7143dd73906d19efb5e703cab2
    //cosmos1mpe27fg4mj6a9yepzp6c64v05u0695z396y2gh
}
async function generateComos(){
    let seed = generateMnemonicsToSeedSync(mnemonic,"")
    const privatekey = await generatePrivateKey(seed)
    const Key = getKey(privatekey)
    let prefix ="cosmos"
    let address = getCosmosAddress(Buffer.from(Key.pubKey))
    console.log("address length",address.length)
    let bech32 = toBech32(address,prefix)
    console.log("cosmos......")
    console.log(bech32)
    //cosmos1mpe27fg4mj6a9yepzp6c64v05u0695z396y2gh
    //cosmos1mpe27fg4mj6a9yepzp6c64v05u0695z396y2gh
    //osmo1mpe27fg4mj6a9yepzp6c64v05u0695z3dph679
    let bech321 = toBech32(address,"osmo")
    console.log("osmo......")
    console.log(bech321)
    //osmo1mpe27fg4mj6a9yepzp6c64v05u0695z3dph679
    //osmo1mpe27fg4mj6a9yepzp6c64v05u0695z3dph679
    let bech322 = toBech32(address,"akash")
    console.log("akash......")
    console.log(bech322)
    //agoric13959p8zc5wx6kuxpxdkgnz92nj9l6g9l209ws8

}
/**
 * btc address
 */
async function generateBtcAddress(){
    let mnemonic = "run concert lake also suffer oppose mind order liberty order glory album"
    const address = getBtcAddress(mnemonic,AddressType.P2PKH,"m/44'/0'/0'/0",NetworkType.TESTNET,"",0)
    //cTTLsa2xYaMzU5j2hE1S4D1R5GXGhekKsjeAPcCb9NiZbSK5MHar
    //cTTLsa2xYaMzU5j2hE1S4D1R5GXGhekKsjeAPcCb9NiZbSK5MHar
    console.log(address)
    //n1R3EQzcEnmjUrRmhTCB9qAsE8Nhkx117d
    //n1R3EQzcEnmjUrRmhTCB9qAsE8Nhkx117d
    //1Lu5wMudRmLUhjx9ytDoKuxYN8mzssvVCB
}
//generateEthAddress()
//generateComos()
generateBtcAddress()