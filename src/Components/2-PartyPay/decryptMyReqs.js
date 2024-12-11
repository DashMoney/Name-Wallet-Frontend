import Dash from "dash";
import { AES, enc, SHA256 } from "crypto-js";

//const { decrypt, encrypt } = require("eciesjs");

const {
  Core: { Mnemonic },
} = Dash;

export default function decryptMyReqs(theReqs, theMnemonic, whichNetwork) {
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
      reqToReturn.error = "";

      return reqToReturn;
    } else {
      let reqToReturn = req;
      let timeStamp = req.$createdAt - 1729873000000;
      let truncatedTimeStamp = new String(timeStamp).slice(0, -3);
      //
      let hdPrivateKeyChild = hdPrivateKey
        .deriveChild(`m/${truncatedTimeStamp}`)
        .privateKey.toString();

      let hashPWD = SHA256(hdPrivateKeyChild).toString();
      //console.log(hashPWD);

      let ciphertext = req.fromReq;
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
          sig: "",
          msgs: [],
          error: "Failure to Display",
        };

        reqToReturn.txId = propObject.txId;
        reqToReturn.sigObject = propObject.sig;
        reqToReturn.msgObject = propObject.msgs;
        reqToReturn.error = propObject.error;

        return reqToReturn;
      }

      // console.log(propObject);

      reqToReturn.txId = propObject.txId;
      reqToReturn.sigObject = propObject.sig;
      reqToReturn.msgObject = propObject.msgs;
      reqToReturn.error = "";

      return reqToReturn;
    }
  });

  return decryptedReqs;
}
