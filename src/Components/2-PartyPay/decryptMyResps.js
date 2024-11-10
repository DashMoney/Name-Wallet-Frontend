//const Dash = require("dash");
import Dash from "dash";
import { Buffer } from "buffer";
import { AES, enc, SHA256 } from "crypto-js";

globalThis.Buffer = Buffer; // polyfill manually

//const { decrypt } = require("eciesjs");
//import { decrypt } from "eciesjs";

const {
  Core: { Mnemonic },
} = Dash;

export default function decryptMyResps(theResps, theMnemonic, whichNetwork) {
  let decryptedResps = [];

  let wallet = new Mnemonic(theMnemonic);

  let hdPrivateKey = wallet
    .toHDPrivateKey(undefined, whichNetwork)
    .deriveChild(`m/2024'/5'/2'`);

  //START LOOP

  decryptedResps = theResps.map((resp) => {
    let decryptedResp = resp;
    //
    let hdPrivateKeyChild = hdPrivateKey
      .deriveChild(`m/${resp.reqTime}`)
      .privateKey.toString();
    //

    let hashPWD = SHA256(hdPrivateKeyChild).toString();
    //console.log(hashPWD);

    // let ciphertext = AES.encrypt(
    //   JSON.stringify(theRespInput),
    //   hashPWD
    // ).toString();
    //console.log(ciphertext);

    let ciphertext = resp.fromResp;

    let bytes = AES.decrypt(ciphertext, hashPWD);
    //console.log(bytes);
    let originalText = bytes.toString(enc.Utf8);

    //console.log(originalText); // 'my message'

    let propObject = JSON.parse(originalText);

    //console.log(propObject);

    // let propsToEncrypt = {
    //   txId: theTxId,
    //   refund: "",
    //   sig: "",
    //   msgs: theMsgObject,
    // };

    decryptedResp.txId = propObject.txId;
    decryptedResp.refundTxId = propObject.refund;
    decryptedResp.sigObject = propObject.sig;
    decryptedResp.msgObject = propObject.msgs;

    return decryptedResp;
    //
    // let decrypted = decrypt(
    //   hdPrivateKeyChild.toObject().privateKey,
    //   Buffer.from(resp.fromResp, "base64"),
    //   {
    //     symmetricAlgorithm: "xchacha20", // Use XChaCha20-Poly1305
    //   }
    // );
    //console.log(Buffer.from(decrypted).toString());
    //return Buffer.from(decrypted).toString();
  });

  return decryptedResps;
}
