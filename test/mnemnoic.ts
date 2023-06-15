import {RGN,generateMnemonics,generateMnemonicsToSeedSync} from '../src'

// default 12 words
let mnemonics = generateMnemonics(RGN)
console.log(mnemonics)

// default 24 words
let mnemonic1 = generateMnemonics(RGN,256)
console.log(mnemonic1)

// seed
// mnemonic: input fit age retreat ship problem warm cargo census genre trash exact
let seed = generateMnemonicsToSeedSync(mnemonics,"admin")
console.log(seed)