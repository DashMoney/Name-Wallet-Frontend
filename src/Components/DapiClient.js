import LocalForage from "localforage";

export default function dapiClient(
  theNetwork,
  theMnemonic,
  theSkipSynchronizationBeforeHeight
) {
  if (theNetwork === "mainnet") {
    //console.log("mainnet dapiClient");
    //select random number from 1-19 and then add 2 or three to thedapiAddress? 0-18
    //
    // let x = Math.floor(Math.random() * 16);
    // let dapiAddrs = [
    //   "198.7.115.43:443",
    //   "149.28.241.190:443",
    //   "216.238.75.46:443",
    //   "134.255.182.186:443",
    //   // "51.83.234.203:443",
    //   "185.198.234.25:443",
    //   "37.60.236.151:443",
    //   "185.192.96.70:443",
    //   "37.27.83.17:443",
    //   "70.34.206.123:443",
    //   "51.83.191.208:443",
    //   "185.166.217.154:443",
    //   "108.160.135.149:443",
    //   "188.245.90.255:443",
    //   "95.179.139.125:443",
    //   "173.199.71.83:443",
    //   "50.116.28.103:443",
    //   "45.76.141.74:443",
    //   "37.27.67.164:443",
    // ];

    return {
      network: "mainnet",
      // dapiAddresses: [dapiAddrs[x], dapiAddrs[x + 1]],
      // dapiAddresses: [
      //   "149.28.241.190:443",
      //   "134.255.182.186:443",
      //   "185.198.234.25:443",
      // ],
      wallet: {
        mnemonic: theMnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: 2130000, //theSkipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DPNSContract: {
          contractId: "GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec",
        },
        ProxyContract: {
          contractId: "7Y342Md8nmw5qFBwBCmpnrbqV9ELhgUfRdNpiLjYkzLD",
        },
        // TwoPartyContract:{

        // },

        // DMIOContract: {
        //   contractId: "HSFUxLZqSgNLwYHDrMemhjgcZuP2yjqJWvzRoqGz6Z4w",
        // },

        // DGRContract: {
        //   contractId: "BWLc5EGfSEAwEcUqSddYa6BDeZ9TgyZEupSqmouWLB5i",
        // },
      },
    };
  } else {
    //THIS IS TESTNET PATH
    //console.log("testnet dapiClient");
    return {
      network: theNetwork,
      dapiAddresses: [
        // "35.165.50.126:1443",
        "52.10.229.11:1443",
        "54.149.33.167:1443",
        "52.24.124.162:1443",
        "54.187.14.232:1443",
      ],
      wallet: {
        mnemonic: theMnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: theSkipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DPNSContract: {
          contractId: "GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec",
        },
        ProxyContract: {
          contractId: "7Y342Md8nmw5qFBwBCmpnrbqV9ELhgUfRdNpiLjYkzLD",
        },
        TwoPartyContract: {
          contractId: "EDLpeKCEFKGXDieomj4DidpCBJzuKf8paAHXcc1kQ89T",
        },
        RENTALSContract: {
          contractId: "Czf3vDBKQZu8zNNsqTqVjxp2FoZEuhVfELULjkGV3S2B", //"HjHocG4oyLHgpnRMJEGagaTyrx6HaboCiGdcBzY3RKPU",
        },
        ONLINESTOREContract: {
          contractId: "DpMzroPo7NFXmACmAZHhsdzPTVCPxNG71PRe17xH7H9", //"E1pambYerWzGaGdQVQcf9tyL5qRKh9mKgiYW9mETupjQ", //"C7w3BAZHvoijzDrRv9MvsvAGgqdSBS2Nbc341kkrpovV",
        },

        DMIOContract: {
          contractId: "DftSJ4QDatQo4YNgWdRmYvg4fg2sMsyHSxmanvAKSjRr",
        },

        DGRContract: {
          contractId: "HLu6Q3RDpGF5dJSmJjuszRfx9nkdwV2DYoURx3jyXWv6",

          //"5HVk6JR8pCvN2aBdQM9UvbsB7ND254JSA18Ya5TTdgPZ"
          // ^^ new one on 01/2025 with DashMoney3
        },
      },
    };
  }
}

/*
dapiClient(
  this.state.whichNetwork,
  this.state.mnemonic,
  this.state.skipSynchronizationBeforeHeight
)


DataContractDSO: "7pn3AFQEZRY4TWJ8g52E593EpxxaXT64ovNMFFTkWnss",
      DataContractDGT: "ECQ3626MPZRFW3KgZm3iPdxUSjyALpndZmEbXnQWXh1p",
      DataContractDGM: "3E6tRUybFV4MXJfSS4dEHujs8SzWjco4thC9uUM6vKzx",
      DataContractDGP: "2ZRd4pPuVyX2KGEYyxLQFCUUkJZSPDVcqZ7zJzjHafsE",
      DataContractDMIO: "4o4FE66f5uo9pgQbpGx6BRs8YjEKFcE8JRmbPchQEWi2",
      DataContractP2P: "2YKHGWpZEApRoQjXqtqoD7YgVzRtCDvmL8tXvDZ25bzh",
      DataContractDGR: "D26rEM7r19R5nJ4Xjj3FkCK5uwrjsd2tHs6vuRcw3gZg",
      DataContractPOD: "6DY7aEQ9uNVuNUg1FnMPTjkWEWhzyei9RCcvK9msMYs",
      DataContractDPNS: "GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec",
      DataContractRAD: "2ZDicoSHYoXTbX3tbTHZwMyJZFdW6ZfEL8DZVkD8DMUY",

  */

// DataContractDSOTESTNET: "7pn3AFQEZRY4TWJ8g52E593EpxxaXT64ovNMFFTkWnss",
// DataContractDGTTESTNET: "ECQ3626MPZRFW3KgZm3iPdxUSjyALpndZmEbXnQWXh1p",
// DataContractDGMTESTNET: "3E6tRUybFV4MXJfSS4dEHujs8SzWjco4thC9uUM6vKzx",
// DataContractDGPTESTNET: "2ZRd4pPuVyX2KGEYyxLQFCUUkJZSPDVcqZ7zJzjHafsE",
// DataContractDMIOTESTNET: "4o4FE66f5uo9pgQbpGx6BRs8YjEKFcE8JRmbPchQEWi2",
// DataContractP2PTESTNET: "2YKHGWpZEApRoQjXqtqoD7YgVzRtCDvmL8tXvDZ25bzh",
// DataContractDGRTESTNET: "D26rEM7r19R5nJ4Xjj3FkCK5uwrjsd2tHs6vuRcw3gZg",
// DataContractPODTESTNET: "6DY7aEQ9uNVuNUg1FnMPTjkWEWhzyei9RCcvK9msMYs",
// DataContractDPNSTESTNET: "GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec",
// DataContractRADTESTNET: "2ZDicoSHYoXTbX3tbTHZwMyJZFdW6ZfEL8DZVkD8DMUY",
