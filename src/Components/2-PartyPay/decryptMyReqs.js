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

      return reqToReturn;
    } else {
      let reqToReturn = req;
      let timeStamp = req.$createdAt - 1729873000000;
      //
      let hdPrivateKeyChild = hdPrivateKey
        .deriveChild(`m/${timeStamp}`)
        .privateKey.toString();

      let hashPWD = SHA256(hdPrivateKeyChild).toString();
      //console.log(hashPWD);

      // let ciphertext = AES.encrypt(
      //   JSON.stringify(theRespInput),
      //   hashPWD
      // ).toString();
      //console.log(ciphertext);

      let ciphertext = req.fromReq;

      let bytes = AES.decrypt(ciphertext, hashPWD);
      // console.log(bytes);
      let originalText = bytes.toString(enc.Utf8);

      // console.log(originalText); // 'my message'

      let propObject = JSON.parse(originalText);

      // console.log(propObject);

      reqToReturn.txId = propObject.txId;
      reqToReturn.sigObject = propObject.sig;
      reqToReturn.msgObject = propObject.msgs;

      return reqToReturn;
    }
  });

  return decryptedReqs;
}
