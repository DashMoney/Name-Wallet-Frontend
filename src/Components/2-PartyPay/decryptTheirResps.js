import Dash from "dash";
import { Buffer } from "buffer";
//import { AES, enc, SHA256 } from "crypto-js";

globalThis.Buffer = Buffer; // polyfill manually

//const { decrypt } = require("eciesjs");
import { decrypt } from "eciesjs";

const {
  Core: { Mnemonic },
} = Dash;
export default function decryptTheirResps(theResps, theMnemonic, whichNetwork) {
  let wallet = new Mnemonic(theMnemonic);

  let hdPrivateKey = wallet
    .toHDPrivateKey(undefined, whichNetwork)
    .deriveChild(`m/2024'/5'/2'`);

  //START LOOP

  let decryptedResps = theResps.map((resp) => {
    let respToReturn = resp;
    // let timeStamp = resp.$createdAt - 1729873000000;

    let hdPrivateKeyChild = hdPrivateKey.deriveChild(`m/${resp.reqTime}`);

    let decrypted = decrypt(
      hdPrivateKeyChild.toObject().privateKey,
      Buffer.from(resp.resp, "base64"),
      {
        symmetricAlgorithm: "xchacha20", // Use XChaCha20-Poly1305
      }
    );

    let decryptedObject = JSON.parse(Buffer.from(decrypted).toString());
    //this ^^^ will return an stringified object

    console.log(decryptedObject);

    //console.log(Buffer.from(decrypted).toString());
    //return Buffer.from(decrypted).toString();

    respToReturn.txId = decryptedObject.txId;
    respToReturn.refundTxId = decryptedObject.refund;
    respToReturn.sigObject = decryptedObject.sig;
    respToReturn.msgObject = decryptedObject.msgs;

    return respToReturn;
  });

  return decryptedResps;
}
