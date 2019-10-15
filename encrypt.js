const crypto = require('crypto')

// const secret = "8A574794-770C-4D2B-858F-429C91EE8A92"
const secret = "8A574794-770C-4D2B-858F-429C91EE8A92"
const salt = "Ivan Medvedev"
const value = "abc"
const expectedResult = "6hoAuBbyD8eMDvZUB1dYUA=="
// const expectedResult = "Uo89YGnwF7FtzNJwDDeNjA=="
let result = ""

// console.log(Buffer.from("abc"))  Ivan Medvedev

// let some = new Buffer(["0x49","0x76","0x61","0x6e","0x20","0x4d","0x65","0x64","0x76","0x65","0x64","0x65","0x76"])
// console.log(some.toString())
const derivedBytes = crypto.pbkdf2Sync(Buffer.from(secret), Buffer.from(salt), 1000, 48, 'sha1');
// The derived bytes is of 48 bytes out of which 32 are key bytes and 16 are IV bytes
const key = derivedBytes.slice(0, 32);
const iv = derivedBytes.slice(32, 48);

// const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
// const output = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
// console.log(output.toString('base64'));

// Create the cipher
// use crypto.getCiphers() to know the list of ciphers supported by Node
// console.log(crypto.getCiphers())
crypto.getCiphers().forEach(cm => {
    try {
        const cipher = crypto.createCipheriv(cm, key, iv);
        const output = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
        console.log("Success - "+cm+" - "+output.toString('base64'));
    } catch (error) {
        // console.log("Failed - "+cm)
    }
})


if(result === expectedResult) {
    console.log("Successful - "+value+" -> "+result)
} else {
    console.log("Failed - "+value)
}


// public static string encryptServiceForMantra(string clearText)
//     {
//         string encryptionKey = "MAKV2SPBIYG2288";
//         byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
//         using (Aes encryptor = Aes.Create())
//         {
//             Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
//             encryptor.Key = pdb.GetBytes(32);
//             encryptor.IV = pdb.GetBytes(16);
//             using (MemoryStream ms = new MemoryStream())
//             {
//                 using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
//                 {
//                     cs.Write(clearBytes, 0, clearBytes.Length);
//                     cs.Close();
//                 }
//                 clearText = Convert.ToBase64String(ms.ToArray());
//             }
//         }
//         return clearText;
// }