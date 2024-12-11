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

export default function encryptMyResp(
  timeStamp,
  theRespInput,
  theRequestPubKeyDoc,
  //theResponsePubKeyDoc
  theMnemonic,
  whichNetwork
) {
  // let ResponsePublicKey = new HDPublicKey(theResponsePubKeyDoc.xpubkey)
  //   .deriveChild(`m/${timeStamp}`)
  //   .toObject().publicKey;

  let truncatedTimeStamp = new String(timeStamp).slice(0, -3);

  let wallet = new Mnemonic(theMnemonic);

  let hdPrivateKey = wallet.toHDPrivateKey(undefined, whichNetwork);

  let hdPrivateKeyChild = hdPrivateKey
    .deriveChild(`m/2024'/5'/2'/${truncatedTimeStamp}`)
    .privateKey.toString();

  //console.log("hdPrivateKeyChild: ", hdPrivateKeyChild);

  let hashPWD = SHA256(hdPrivateKeyChild).toString();

  //console.log(hashPWD);

  let ciphertext = AES.encrypt(
    JSON.stringify(theRespInput),
    hashPWD
  ).toString();

  //console.log(ciphertext);

  // let bytes = AES.decrypt(ciphertext, hashPWD);
  // console.log(bytes);
  // let originalText = bytes.toString(enc.Utf8);

  // console.log(originalText); // 'my message'

  //{txId:'',sig:'',msg:[]} //Requests
  //{txId:'',sig:'',refund:'',msg:[]} //Responses

  // ****  ****  ****
  // const encrypted = await encrypt(publicKey, data, {
  //   symmetricAlgorithm: 'xchacha20' // Use XChaCha20-Poly1305
  // });
  // ****  ****  ****

  // console.log(theRespInput);

  // console.log(data);
  // with Dash Buffer = Uint8Array
  // let encryptFromResp = encrypt(ResponsePublicKey, data, {
  //   symmetricAlgorithm: "xchacha20", // Use XChaCha20-Poly1305
  // });

  let RequestPublicKey = new HDPublicKey(theRequestPubKeyDoc.xpubkey)
    .deriveChild(`m/${truncatedTimeStamp}`)
    //`m/2147483647` <- LIMIT, will hit in 68 years
    .toObject().publicKey;

  // console.log(RequestPublicKey);

  let data = Buffer.from(JSON.stringify(theRespInput));

  // add the Dash.Core.crypto.Random.getRandomBuffer(16) //random bytes
  // JUST USE CHACHA!

  let encryptResp = encrypt(RequestPublicKey, data, {
    symmetricAlgorithm: "xchacha20", // Use XChaCha20-Poly1305
  });

  // console.log(Buffer.from(decrypted).toString());

  let encryptedProps = {
    resp: encryptResp,
    fromResp: ciphertext, //encryptFromResp
  };

  return encryptedProps;
}
//From Uint8array(240) to 320
// AES was 216 chars vs 320
