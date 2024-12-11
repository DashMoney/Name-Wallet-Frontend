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

    let truncatedTimeStamp = new String(resp.reqTime).slice(0, -3);
    //
    let hdPrivateKeyChild = hdPrivateKey
      .deriveChild(`m/${truncatedTimeStamp}`)
      .privateKey.toString();
    //

    let hashPWD = SHA256(hdPrivateKeyChild).toString();
    //console.log(hashPWD);

    let ciphertext = resp.fromResp;
    let propObject;
    let bytes; // = AES.decrypt(ciphertext, hashPWD);
    // console.log(bytes);

    try {
      bytes = AES.decrypt(ciphertext, hashPWD);
      // console.log(bytes);
      let originalText = bytes.toString(enc.Utf8);
      // console.log(originalText); // 'my message'
      propObject = JSON.parse(originalText);
    } catch (e) {
      //console.warn(e);
      propObject = {
        txId: "",
        refund: "",
        sig: "",
        msgs: [],
        error: "Failure to Display",
      };

      decryptedResp.txId = propObject.txId;
      decryptedResp.refundTxId = propObject.refund;
      decryptedResp.sigObject = propObject.sig;
      decryptedResp.msgObject = propObject.msgs;
      decryptedResp.error = propObject.error;

      return decryptedResp;
    }

    decryptedResp.txId = propObject.txId;
    decryptedResp.refundTxId = propObject.refund;
    decryptedResp.sigObject = propObject.sig;
    decryptedResp.msgObject = propObject.msgs;
    decryptedResp.error = "";

    return decryptedResp;
  });

  return decryptedResps;
}
