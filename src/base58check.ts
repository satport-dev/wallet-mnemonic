

import crypto from 'crypto'
import base58 from 'bs58'


export const encode = (data: Uint8Array, prefix = '00', encoding = 'hex') => {
    if (typeof data === 'string') {
        data = Buffer.from(data)
    }
    if (!(data instanceof Buffer)) {
        throw new TypeError('"data" argument must be an Array of Buffers')
    }

    let prefix1 = Buffer.from(prefix)
    let hash = Buffer.concat([prefix1, data])
    // twice sha256
    hash = crypto.createHash('sha256').update(hash).digest()
    hash = crypto.createHash('sha256').update(hash).digest()
    // prefix data checksum
    hash = Buffer.concat([prefix1, data, hash.subarray(0, 4)])
    // base58 code
    return base58.encode(hash)
}


export const decode = (str: string, encoding: BufferEncoding) => {
    const buffer = Buffer.from(base58.decode(str))
    let prefix = buffer.subarray(0, 1)
    let data = buffer.subarray(1, -4)
    let hash = Buffer.concat([prefix, data])
    hash = crypto.createHash('sha256').update(hash).digest()
    hash = crypto.createHash('sha256').update(hash).digest()
    buffer.subarray(-4).forEach((check, index) => {
        if (check !== hash[index]) {
            throw new Error('Invalid checksum')
        }
    })
    let pre, d
    if (encoding) {
        pre = prefix.toString(encoding)
        d = data.toString(encoding)
    }
    return { prefix: pre, data: d }
}