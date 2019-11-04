var RSA = require('./wx_rsa.js')
// var privateKey = '-----BEGIN RSA PRIVATE KEY-----MIICXgIBAAKBgQCoChRDJ6e7BTE5yYBIS + NGYBpDs7ftEematqhvMmOFcJng7qjJk + yJ1j7DCqbCD2f / BI6gTfGXASiYuO6kklZu8Pkw4HAUkaaGyhaC8Z + TMg79PPRz5hziEdFXPTdXvXudiXbI2Wi6D90ZaSwN6ZHs7Mtc5VgGK3jxS35iLm+ oAQIDAQABAoGBAI + nHi9SxUdSZwS5yBsGFSNioNFj4Eag243RvShicUXwPvxVyqGY / cvQBhODFZAsz4Dpimxsda3b5bK51fmGyK / nXraHRunWcG7cDDB0EnRpGh4LvMI5Tny + kV0v07N0kkYF+ Lig88IjyBXMAY8m97QK / Huf6MsDFo7B6maSvlmBAkEA35GXk6achryGAoUyyLSro7bI9A9 + wXWFdXoqu1 / X1sZ8taGy7saB + XEA6EQ + XHRp7rZkQ5StoBL +reDGvLJLWQJBAMBqW / F + qg1VpmV / EfYTSS0 + jliw / Ik4kKHLuD / bYK61FG80JIoxLbelB / 1ZVZ8WR0cUKgrmoo8HOggjocNTNOkCQQCYibK86CHGAF0C3TSgIj01r2H+u4 / FmVScqeT8AVG31aeDGbeHGOPXeJWg4 + cUl80rNUDFp2yrWipwInwWhSPJAkAf+ 02u9Ru0vbC7nARTP19hWs10Jm7DLBi2G9NTIdaPE2ADH8qXAZeUt6R9UrTtjVlpkgtu5mjMlynpImsHuTPJAkEAoU10QspqfxL4F44KdHjHY1btc8wb4soaLy / eAY8PLE + jpNh8jsqA8v1EqLQbYz50D / BpkJsT5W + wydTvtEE3sA ==-----END RSA PRIVATE KEY-----'
// var publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoChRDJ6e7BTE5yYBIS + NGYBpDs7ftEematqhvMmOFcJng7qjJk + yJ1j7DCqbCD2f / BI6gTfGXASiYuO6kklZu8Pkw4HAUkaaGyhaC8Z+ TMg79PPRz5hziEdFXPTdXvXudiXbI2Wi6D90ZaSwN6ZHs7Mtc5VgGK3jxS35iLm+ oAQIDAQAB-----END PUBLIC KEY-----'
//加密
function jiami(data, key) {
    var encrypt_rsa = new RSA.RSAKey();
    encrypt_rsa = RSA.KEYUTIL.getKey(key);
    var encStr = encrypt_rsa.encrypt(data)
    encStr = RSA.hex2b64(encStr);
    return encStr
}
//解密
function jiemi(data, key) {
    var decrypt_rsa = new RSA.RSAKey();
    decrypt_rsa = RSA.KEYUTIL.getKey(key);
    data = RSA.b64tohex(data);
    var decStr = decrypt_rsa.decrypt(data)
    return decStr
}
function getDetryptPwd(pwd,pbk){
    var pubKey = pbk;
    var encrypt = new RSA.RSAKey();
    encrypt.setPublicKey(pubKey);
    return encrypt.decrypt(pwd);
    }
module.exports = {
    jiami: jiami,
    jiemi: jiemi,
    getDetryptPwd:getDetryptPwd
}