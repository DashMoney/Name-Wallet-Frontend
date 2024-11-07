export default function checkWithdraw(scriptHashToCheckFor, walletTXs) {
  //WALLETHISTORY -> ARRAY
  //jUST PULL LAST 12
  //AND CAN EVEN SEPARATE DOWN TO SENT OR RECEIVED
  // FOR CHECK WITHDRAW -> RECEIVED
  // IF THE FROM HAS AN ADDRESS THAT MATCHES THEN RETURN THE txId <-***
  // AND IF NOT RETURN FALSE THEN SETsTATE AND ADD WITHDRAWN TO STATE BUTTON
  //   from": [
  //     {
  //         "address": "8pZPfMgWJEDtbuBB8UkA2iBKPwyVcn1uEZ",
  //         "addressType": "unknown"
  //     }
  // ],
  /*{
    "from": [
        {
            "address": "yeJfck5ESnphEtRhdVStG58VbCJmskstBQ",
            "addressType": "internal"
        },
        {
            "address": "yjU8SS8MUTffUgwdFwoNY6VC4zuZ5yMrGy",
            "addressType": "external"
        },
        {
            "address": "yU3Q3MDpscX8aqDFYDYim1fNHojTNY5w8v",
            "addressType": "external"
        }
    ],
    "to": [
        {
            "address": "8jECxYYTt6P8uAGD63Qi1TW5WvhjyGhgkN",
            "satoshis": 50000000,
            "addressType": "unknown"
        },
        {
            "address": "yjZVSAzGoT1iQZAuBZJtUhrWRpUK8RN57o",
            "satoshis": 276997066,
            "addressType": "internal"
        }
    ],
    "type": "sent",
    "time": "2024-10-30T00:20:28.000Z",
    "txId": "2e9ecf96d6f889e74eb076060b91aa0273ea4af8c5f16cc258ed2e4712cc6669",
    "blockHash": "000001808f4004206c015d65716497316af1f94086e0a7f87a24dd73decca25e",
    "isChainLocked": false,
    "isInstantLocked": false,
    "satoshisBalanceImpact": -50000000,
    "feeImpact": 540
}
   *
{
    "from": [
        {
            "address": "8pZPfMgWJEDtbuBB8UkA2iBKPwyVcn1uEZ",
            "addressType": "unknown"
        }
    ],
    "to": [
        {
            "address": "yU3Q3MDpscX8aqDFYDYim1fNHojTNY5w8v",
            "satoshis": 299990000,
            "addressType": "external"
        },
        {
            "address": "yU3Q3MDpscX8aqDFYDYim1fNHojTNY5w8v",
            "satoshis": 9000,
            "addressType": "external"
        }
    ],
    "type": "received",
    "time": "2024-10-29T23:45:17.000Z",
    "txId": "af4e45376d0ad132ad322dc5862334a713bf15d422f45b4f08b31a57b2af4364",
    "blockHash": "00000085123258053ae17e0861c81933829b846f8151658cfc6c6ad4698fcbed",
    "isChainLocked": false,
    "isInstantLocked": false,
    "satoshisBalanceImpact": 299999000,
    "feeImpact": 0
}
   */

  //or return false
  return txId;
}
