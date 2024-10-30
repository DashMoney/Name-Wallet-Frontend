import Dash from "dash";

const {
  Essentials: { Buffer },
  Core: {
    Mnemonic,
    // HDPrivateKey,
    HDPublicKey,
    PublicKey,
    Script,
    Address,
    Transaction,
    Signature,

    // Output,
  },
} = Dash;

export default function createFullTX(
  theRequest,
  theRequestPubKeyDoc,
  theResponse,
  theResponsePubKeyDoc,
  whichNetwork,
  theTx, //txId,script,amt
  theMnemonic,
  theAddress
) {
  //2,147,483,648 =  2^31 is deriveChild limit
  //1,729,873,503,663 TIMENOW
  //31,536,000 secsInYear
  //68 years this is how long until repeat - no just repeat, run out of room, will need to increase truncate
  //Just truncate - 1,729,873,000,000

  let timeStamp = theRequest.$createdAt - 1729873000000;

  //console.log("timeStamp", timeStamp);

  let RequestPublicKey = new HDPublicKey(theRequestPubKeyDoc.xpubkey)
    .deriveChild(`m/${timeStamp}`)
    //`m/2147483647` <- LIMIT, will hit in 68 years
    .toObject().publicKey;

  let ResponsePublicKey = new HDPublicKey(theResponsePubKeyDoc.xpubkey)
    .deriveChild(`m/${timeStamp}`)
    .toObject().publicKey;

  let redeemScript = Script.buildMultisigOut(
    [RequestPublicKey, ResponsePublicKey],
    2
  );
  //console.log("redeemScript: ", redeemScript);

  let scriptHashOut = redeemScript.toScriptHashOut();
  //console.log("ScriptHashOut: ", scriptHashOut.toString());

  console.log("whichNetwork", whichNetwork);

  let scriptAddress = Address.fromScript(scriptHashOut, whichNetwork);
  console.log("scriptAddress: ", scriptAddress.toString());

  // ////

  // TEST 5 - PAYOUT from MultiSig

  //https://github.com/dashpay/dashcore-lib/blob/master/docs/core-concepts/unspentoutput.md

  //Just get this ALL FROM THE TX ->

  let utxo = new Transaction.UnspentOutput({
    txid: theTx.hash,
    outputIndex: 0,
    address: scriptAddress.toString(),
    script: theTx.outputs[0].script,
    satoshis: theTx.outputs[0].satoshis,
  });

  let wallet = new Mnemonic(theMnemonic);

  let hdPrivateKey = wallet.toHDPrivateKey(undefined, whichNetwork); //in WIF??

  let hdPrivateKeyChild = hdPrivateKey.deriveChild(
    `m/2024'/5'/2'/${timeStamp}`
  );

  let multiSigTx = new Transaction()
    .from(utxo, [RequestPublicKey, ResponsePublicKey], 2)
    //.from(utxo, publicKeys, threshold) ///THIS IS THE INPUTS!!!
    //grab the testnet address for DM3
    .to(theAddress, theTx.outputs[0].satoshis - 10000) ///SO THIS IS OUTPUTS***
    .change(theAddress)
    .sign(hdPrivateKeyChild.privateKey);

  //theTx.outputs[0]

  //RECREATE THE SENDERS SIGNATURE OBJECT ->

  // create the pubkey

  //https://github.com/dashpay/dashcore-lib/blob/master/lib/transaction/signature.js
  console.log("sigObject", theResponse.sigObject);

  let signatureThe = {
    publicKey: new PublicKey(ResponsePublicKey),
    prevTxId: Buffer.from(theTx.hash, "hex"), //theTx.hash,
    outputIndex: 0,
    inputIndex: 0,
    signature: Dash.Core.crypto.Signature.fromDER(
      Buffer.from(theResponse.sigObject, "hex")
    ),
    sigtype: 2,
  };
  console.log("signature", signatureThe);

  let TxSig = new Transaction.Signature.fromObject(signatureThe);
  console.log("txSignature", TxSig);

  let theTransactionToPass = multiSigTx.applySignature(TxSig);

  console.log(
    "istheMultiSigTxfullySigned: ",
    theTransactionToPass.isFullySigned()
  );
  console.log(
    "getSerializationError: ",
    theTransactionToPass.getSerializationError()
  );

  console.log("hasAllUtxoInfo: ", theTransactionToPass.hasAllUtxoInfo());

  //console.log("isValidSignature: ", theTransactionToPass.isValidSignature());

  // console.log("istheMultiSigTxfullySigned: ", multiSigTx.isFullySigned());
  // console.log("getSerializationError: ", multiSigTx.getSerializationError());

  // console.log("hasAllUtxoInfo: ", multiSigTx.hasAllUtxoInfo());

  return theTransactionToPass;
}
