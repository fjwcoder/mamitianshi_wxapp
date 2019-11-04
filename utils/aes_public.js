// util 文件
var aes = require('aes.min.js'); //引入aes类包
//URl: https://github.com/wzqwzq666/JS_AESencode/blob/master/utils/aes.js



// 加密
function encrypt(data) {
  //十六位十六进制数作为秘钥
  var aeskey = aes.CryptoJS.enc.Utf8.parse("_MAMI_tianshi_RT");
  //十六位十六进制数作为秘钥偏移量
  var aesiv = aes.CryptoJS.enc.Utf8.parse('mnbvcxzlkjhgfdae');
    var srcs = aes.CryptoJS.enc.Utf8.parse(data);
    var encrypted = aes.CryptoJS.AES.encrypt(srcs, aeskey, { iv: aesiv, mode: aes.CryptoJS.mode.CBC, padding: aes.CryptoJS.pad.Pkcs7 });
    //返回base64加密结果
    return encrypted.toString();
}

//解密
function decrypt(data) {
  //十六位十六进制数作为秘钥
  var aeskey = aes.CryptoJS.enc.Utf8.parse("_MAMI_tianshi_RT");
  //十六位十六进制数作为秘钥偏移量
  var aesiv = aes.CryptoJS.enc.Utf8.parse('mnbvcxzlkjhgfdae');
    // data是base64编码数据
    var decrypt = aes.CryptoJS.AES.decrypt(data, aeskey, { iv: aesiv, mode: aes.CryptoJS.mode.CBC, padding: aes.CryptoJS.pad.Pkcs7 });
    var decryptedStr = decrypt.toString(aes.CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}













// const fun_aes = require("./fun_aes.js");

// const key = fun_aes.CryptoJS.enc.Hex.parse("13707535364e794c");
// //封装加密
// function Encrypt(word) {
//     var encrypted = fun_aes.CryptoJS.AES.encrypt(word, key, {
//         mode: fun_aes.CryptoJS.mode.ECB,
//         padding: fun_aes.CryptoJS.pad.Pkcs7
//     });
//     return encrypted.ciphertext.toString();
// };
// //封装解密
// function Decrypt(word) {
//     var encryptedHexStr = fun_aes.CryptoJS.format.Hex.parse(word);
//     var decrypt = fun_aes.CryptoJS.AES.decrypt(encryptedHexStr, key, {
//         mode: fun_aes.CryptoJS.mode.ECB,
//         padding: fun_aes.CryptoJS.pad.Pkcs7
//     });
//     return fun_aes.CryptoJS.enc.Utf8.stringify(decrypt);
// }

// module.exports = {
//     Encrypt,
//     Decrypt
// }