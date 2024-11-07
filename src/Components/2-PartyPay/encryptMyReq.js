//const Dash = require("dash");
import Dash from "dash";
import { Buffer } from "buffer";
import { AES, enc, SHA256 } from "crypto-js";

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
  //   //`m/2147483647` <- LIMIT, will hit in 68 years
  //   .toObject().publicKey;

  let wallet = new Mnemonic(theMnemonic);

  let hdPrivateKey = wallet.toHDPrivateKey(undefined, whichNetwork);

  let hdPrivateKeyChild = hdPrivateKey
    .deriveChild(`m/2024'/5'/2'/${timeStamp}`)
    .privateKey.toString();

  let hashPWD = SHA256(hdPrivateKeyChild).toString();

  //console.log(hashPWD);

  let ciphertext = AES.encrypt(JSON.stringify(theReqInput), hashPWD).toString();

  //console.log(ciphertext);

  // let bytes = AES.decrypt(ciphertext, hashPWD);
  // console.log(bytes);
  // let originalText = bytes.toString(enc.Utf8);

  // console.log(originalText); // 'my message'

  let ResponsePublicKey = new HDPublicKey(theResponsePubKeyDoc.xpubkey)
    .deriveChild(`m/${timeStamp}`)
    .toObject().publicKey;

  //let hdPrivKeyChild = hdPrivateKeyChild.deriveChild(`m/${req.$createdAt}`);

  let data = Buffer.from(JSON.stringify(theReqInput));

  let encryptReq = encrypt(ResponsePublicKey, data, {
    symmetricAlgorithm: "xchacha20", // Use XChaCha20-Poly1305
  });

  // console.log(Buffer.from(decrypted).toString());

  let encyptedProps = { req: encryptReq, fromReq: ciphertext };

  return encyptedProps;
}
