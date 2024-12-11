//const Dash = require("dash");
import Dash from "dash";
import { Buffer } from "buffer";
import { AES, SHA256 } from "crypto-js";

globalThis.Buffer = Buffer; // polyfill manually

//const { encrypt } = require("eciesjs");
import { encrypt } from "eciesjs";

const {
  Core: { Mnemonic, HDPublicKey },
  //Essentials: { Buffer },
} = Dash;

export default function encryptMyReq(
  timeStamp,
  theReqInput,
  //theRequestPubKeyDoc,
  theResponsePubKeyDoc,
  theMnemonic,
  whichNetwork
) {
  // let RequestPublicKey = new HDPublicKey(theRequestPubKeyDoc.xpubkey)
  //   .deriveChild(`m/${timeStamp}`)
  // this is milliseconds *** -> truncate to fix
  //   //`m/2147483647` <- LIMIT, will hit in 68 years
  //   .toObject().publicKey;

  let truncatedTimeStamp = new String(timeStamp).slice(0, -3);

  let wallet = new Mnemonic(theMnemonic);

  let hdPrivateKey = wallet.toHDPrivateKey(undefined, whichNetwork);

  let hdPrivateKeyChild = hdPrivateKey
    .deriveChild(`m/2024'/5'/2'/${truncatedTimeStamp}`)
    .privateKey.toString();

  let hashPWD = SHA256(hdPrivateKeyChild).toString();

  //console.log(hashPWD);

  let ciphertext = AES.encrypt(JSON.stringify(theReqInput), hashPWD).toString();

  //console.log(ciphertext);

  // let bytes = AES.decrypt(ciphertext, hashPWD);
  // console.log(bytes);
  // let originalText = bytes.toString(enc.Utf8);

  // console.log(originalText); // 'my message'

  console.log(truncatedTimeStamp);

  let ResponsePublicKey = new HDPublicKey(theResponsePubKeyDoc.xpubkey)
    .deriveChild(`m/${truncatedTimeStamp}`)
    .toObject().publicKey;

  //let hdPrivKeyChild = hdPrivateKeyChild.deriveChild(`m/${req.$createdAt}`);

  let data = Buffer.from(JSON.stringify(theReqInput));

  let encryptReq = encrypt(ResponsePublicKey, data, {
    symmetricAlgorithm: "xchacha20", // Use XChaCha20-Poly1305
  });

  // console.log(Buffer.from(decrypted).toString());

  let encryptedProps = { req: encryptReq, fromReq: ciphertext };

  return encryptedProps;
}
