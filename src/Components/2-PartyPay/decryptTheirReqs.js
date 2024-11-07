import Dash from "dash";
import { Buffer } from "buffer";
//import { AES, enc, SHA256 } from "crypto-js";

globalThis.Buffer = Buffer; // polyfill manually

//const { decrypt } = require("eciesjs");
import { decrypt } from "eciesjs";

const {
  Core: { Mnemonic },
} = Dash;

export default function decryptTheirReqs(theReqs, theMnemonic, whichNetwork) {
  let wallet = new Mnemonic(theMnemonic);

  let hdPrivateKey = wallet
    .toHDPrivateKey(undefined, whichNetwork)
    .deriveChild(`m/2024'/5'/2'`);

  //START LOOP

  let decryptedReqs = theReqs.map((req) => {
    if (req.$createdAt === req.$updatedAt) {
      let reqToReturn = req;

      reqToReturn.txId = "";
      reqToReturn.sigObject = "";
      reqToReturn.msgObject = [];

      return reqToReturn;
    } else {
      let reqToReturn = req;
      let timeStamp = req.$createdAt - 1729873000000;

      let hdPrivateKeyChild = hdPrivateKey.deriveChild(`m/${timeStamp}`);

      let decrypted = decrypt(
        hdPrivateKeyChild.toObject().privateKey,
        Buffer.from(req.req, "base64"),
        {
          symmetricAlgorithm: "xchacha20", // Use XChaCha20-Poly1305
        }
      );

      let decryptedObject = JSON.parse(Buffer.from(decrypted).toString());
      //this ^^^ will return an stringified object

      // console.log(decryptedObject);

      //console.log(Buffer.from(decrypted).toString());
      //return Buffer.from(decrypted).toString();

      reqToReturn.txId = decryptedObject.txId;
      reqToReturn.sigObject = decryptedObject.sig;
      reqToReturn.msgObject = decryptedObject.msgs;

      return reqToReturn;
    }
  });

  return decryptedReqs;
}
