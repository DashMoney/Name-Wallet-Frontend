import React from "react";
import LocalForage from "localforage";

import Image from "react-bootstrap/Image";

import DashBkgd from "./Images/dash_digital-cash_logo_2018_rgb_for_screens.png";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import TopNav from "./Components/TopNav/TopNav";

//import WhyMoney from "./Components/WhyMoney";

import "./App.css";
import LoginForm from "./Components/0-LoginPage/LoginForm";
import AccountLogin from "./Components/0-LoginPage/AccountLogin";
import IdentityControlPage from "./Components/0-LoginPage/IdentityControlPage";

//import MessagesPage from "./Components/5-Messages/MessagesPage";

// import GroupsPage from "./Components/6-Groups/GroupsPage";
// import Group from "./Components/6-Groups/Group";

import WalletPage from "./Components/9-Wallet/WalletPage";

import ReviewsPage from "./Components/7-Reviews/ReviewsPage";

import ProofsPage from "./Components/8-ProofOfFunds/ProofsPage";

import TopUpIdentityModal from "./Components/TopUpIdentityModal";

import NameWalletExplaination from "./Components/NameWalletExplaination";

import CreateNewWalletModal from "./Components/0-LoginPage/CreateNewWalletModal";
import RegisterIdentityModal from "./Components/0-LoginPage/RegisterIdentityModal";

import RegisterNameModal from "./Components/0-LoginPage/RegisterNameModal";

import SendFundsModal from "./Components/0-LoginPage/SendFundsModal";
import LogoutModal from "./Components/0-LoginPage/LogoutModal";

import ProxyPage from "./Components/1-ProxyAccounts/ProxyPage";

import AddProxyModal from "./Components/1-ProxyAccounts/AddProxyModal";
import EditProxyModal from "./Components/1-ProxyAccounts/EditProxyModal";
import DeleteProxyModal from "./Components/1-ProxyAccounts/DeleteProxyModal";

import TwoPartyPage from "./Components/2-PartyPay/TwoPartyPage";

import CreateGroupModal from "./Components/6-Groups/CreateGroupModal";
import JoinGroupModal from "./Components/6-Groups/JoinGroupModal";
import DeleteGroupModal from "./Components/6-Groups/DeleteGroupModal";

import ConfirmAddrPaymentModal from "./Components/9-Wallet/ConfirmAddrPaymentModal";
import RegisterDGMModal from "./Components/RegisterDGMModal";
import ThreadModal_WALLET from "./Components/9-Wallet/ThreadModal_WALLET";
import WalletTXModal from "./Components/WalletTXModal";
import PayRequestModal from "./Components/9-Wallet/PayRequestModal";
import RejectReqModal from "./Components/9-Wallet/RejectReqModal";

import CreateReviewModal from "./Components/7-Reviews/ReviewModals/CreateReviewModal";
import EditReviewModal from "./Components/7-Reviews/ReviewModals/EditReviewModal";
import CreateReplyModal from "./Components/7-Reviews/ReviewModals/CreateReplyModal";
import EditReplyModal from "./Components/7-Reviews/ReviewModals/EditReplyModal";

import CreateProofModal from "./Components/8-ProofOfFunds/YourProofs/CreateProofModal";
import DeleteProofModal from "./Components/8-ProofOfFunds/YourProofs/DeleteProofModal";

import dapiClient from "./Components/DapiClient";
import dapiClientNoWallet from "./Components/DapiClientNoWallet";

//const Dash = require("dash");
import Dash from "dash";

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      mode: import.meta.env.VITE_BKGD,
      //mode: "dark", //from .env -> import.meta.env.VITE_BKGD

      unit: "base", //or 'micro', //or 'hecto', //μ OR hd, no.. hD  hecto-Duff yes

      //feeAmountBaseNumber: 10000000 - Math.floor(Math.random() * 5000), //CHANGED BY REMOVE 00 BC 100 = 1.00% NOW
      //Needs to be determined by env var and needs a random part to vary the input so state transistion already in chain is not triggered.
      //feeAmountBaseNumber: 100000 - Math.floor(Math.random() * 5000),

      //ACCOUNT 'LOGIN' PAGE STATE
      isLoadingIdentity: true,
      isLoadingIdInfo: true,
      isLoadingCreditTransfer: false,

      isLoadingName: true,
      isLoadingAlias: false,

      isLoadingWallet: true, //For wallet for topup

      isIdentityControlShowing: false,

      identityRegisterCount: 0,
      identityError: false,
      idInfoError: false,
      nameError: false,
      aliasError: false,
      //ACCOUNT 'LOGIN' PAGE STATE^^^^^^

      //PROXY PAGE

      isLoadingProxy: false,

      ProxyController: { proxyList: [] }, //[],
      ProxyDocs: [
        // {
        //   $ownerId: "ha84h9aguia4khai4",
        //   controlId: "thisIdentity",
        //   $createdAt: Date.now() - 1000000,
        // },
      ],
      ProxyIdentities: [],

      //Controller -> own separate query
      Proxy1: false, // ProxyDocs
      Proxy2: false, // ProxyIdentities

      InitialPullPROXY: true,

      selectedProxyTuple: "",
      selectedProxyTupleIndex: "",

      //PROXY PAGE STATE^^^^^

      //MESSAGES PAGE
      // isLoading={this.state.isLoading}
      whichMessagesTab: "Everyone",

      isLoadingRefresh: false, //-> WHAT IS THIS CONNECTED TO ? -> a single spinner on MessagesPage , can I get rid of this because I think i had it for the manual updating but there is now auto updateing with messages ? =>
      errorToDisplay: false,

      isLoadingEveryone: true,

      isLoadingForYou: true,

      EveryoneMsgs: [
        {
          $ownerId: "4h5j6j",
          $id: "7ku98rj",
          msg: "Thanks for trying out the dapps! You can even host the front end yourself and earn Dash.",
          sh: "out",
          $createdAt: Date.now() - 1000000,
        },
      ],
      EveryoneNames: [
        {
          $ownerId: "4h5j6j",
          label: "Miles",
        },
      ],

      Everyone1: false, //2 threads -> msg names and thread names
      Everyone2: false,

      ForYou1: false, //4 threads -> 2 by 2 path but could have zero on either of the paths?? ->
      ForYou2: false,
      ForYou3: false,
      ForYou4: false,

      ByYouMsgs: [], //MESSAGES
      ByYouNames: [],

      FromTagsMsgs: [],
      FromTagsNames: [],

      //Below is the new Thread state
      EveryoneThreads: [
        {
          $ownerId: "hw7o5fh4w",
          $id: "wg7w54b5l9",
          msg: "Well that sounds interesting. How do I do that?",
          msgId: "7ku98rj",

          $createdAt: Date.now() - 800000,
        },
        {
          $ownerId: "4h5j6j",
          $id: "7ku98rj",
          msg: 'Just click on the "1% of TopUp" in the Navigation menu.',
          msgId: "7ku98rj",
          $createdAt: Date.now() - 500000,
        },
      ],
      EveryoneThreadsNames: [
        {
          $ownerId: "hw7o5fh4w",
          label: "Alice",
        },
        {
          $ownerId: "4h5j6j",
          label: "Miles",
        },
      ],

      ByYouThreads: [],
      ByYouThreadsNames: [],

      FromTagsThreads: [],
      FromTagsThreadsNames: [],

      ThreadMessageId: "",
      //BELOW Most Recent Initial For You
      InitialMessages1: false,
      InitialMessages2: false,
      InitialMessages3: false,
      InitialMessages4: false,

      InitialByYouMsgs: [],
      InitialByYouNames: [],

      InitialFromTagsMsgs: [],
      InitialFromTagsNames: [],

      InitialByYouThreads: [],
      InitialByYouThreadsNames: [],

      InitialFromTagsThreads: [],
      InitialFromTagsThreadsNames: [],

      //ABOVE Most Recent Initial For You
      //BELOW AutoUpdate Arrays
      NewSO1: false,
      NewSO2: false,

      NewSONames: [],
      NewSOMsgs: [],

      NewSOThreadsNames: [],
      NewSOThreads: [],

      NewDM1: false,
      NewDM2: false,
      NewDM3: false,

      //NewDMByYouNames: [], //Not required bc user would make themselves
      //NewDMByYouMsgs: [],

      NewDMByYouThreadsNames: [],
      NewDMByYouThreads: [],

      NewDMFromTagsNames: [],
      NewDMFromTagsMsgs: [],

      NewDMFromTagsThreadsNames: [],
      NewDMFromTagsThreads: [],

      //Above AutoUpdate Arrays^^^^

      // SubmitMessages1: false, <- NOT USED?
      // SubmitMessages2: false, <- NOT USED?

      //DocumentSubmissionSeparatation^^^^

      // handleThread={this.handleThread}
      // pushNewSOtoView={this.pushNewSOtoView}
      // pushNewDMtoView={this.pushNewDMtoView}

      //MESSAGES PAGE STATE^^^^^

      //GROUPS PAGE

      isLoadingGroups: false, //Invite Pull, Active(Msgs) Pull, creating Group, deleting group, accepting invite
      isLoadingGroup: false, // Msgs Pull, Members pull, sending msg,
      //But that is done in Group -> !!???

      isLoadingActiveGroups: true, //Separate spinner for Active so not lumped in with Groups.

      isLoadingGroupInvite: false, //Control and alert in Groups and on GroupPage because that is the only way you will know if an invite was sent. sending invite,

      InitialPullGROUPS: true,

      dgtInvites: [], //Gets selfinvites && ToYouinvites
      //dO THE MAP AND FILTERING ON THE ACTUAL DISPLAY COMPONENT

      dgtInvitesNames: [],

      dgtActiveGroups: [],

      selectedGroup: "",
      isGroupShowing: false,

      GroupsMsgsToAdd: [], //handle in Group so not too difficult, just add together and use set for unique docId ->

      sentGroupMsgError: false, //Thread to Group, all the below
      sentGroupInviteError: false,
      sentGroupInviteSuccess: false,
      sendToNameInvite: "", //For invite

      //GROUPS PAGE STATE^^^^^

      //WALLET PAGE

      WALLET_whichTab: "Your Wallet",

      WALLET_whichPayType: "Pay",

      isLoadingButtons_WALLET: true,
      isLoadingForm_WALLET: false,

      isLoadingRefresh_WALLET: false, // This is not implemented maybe use to consolidate the confirmations, Buttons and Form?? or just add another?? -> So I think that the purpose of the refresh is currently only to keep the msgs viewable while the page reload/finishes the queries ->

      isLoadingMsgs_WALLET: true,

      isLoadingAddresses_WALLET: true, //Addresses of others, not mine

      dgmDocuments: [], //MOVE TO GENERAL BC USED IN MY STORE <=
      //WALLET_Login7 <= use this to control the "Enable Pay to Name" so doesn't show up before its been checked.

      WALLET_sendToName: "",
      WALLET_requestPmtNameDoc: "",
      WALLET_requestPmtReqDoc: "",
      WALLET_sendToAddress: "",
      WALLET_amountToSend: 0,
      WALLET_messageToSend: "",
      WALLET_sendToDGMAddressDoc: "",

      WALLET_sendSuccess: false,
      WALLET_sendFailure: false,

      WALLET_nameSuccess: "",
      WALLET_amtSuccess: 0,

      WALLET_sendMsgSuccess: false,
      WALLET_sendMsgFailure: false,

      WALLET_sendPmtMsgSuccess: false,
      WALLET_sendPmtMsgFailure: false,

      //*** *** *** *** ***

      WALLET_Login1: false,
      WALLET_Login2: false,
      WALLET_Login3: false,
      WALLET_Login4: false,
      WALLET_Login5: false,
      WALLET_Login6: false,
      WALLET_Login7: false,

      WALLET_ByYouMsgs: [],
      WALLET_ByYouNames: [],
      WALLET_ByYouThreads: [],

      WALLET_ToYouMsgs: [],
      WALLET_ToYouNames: [],
      WALLET_ToYouThreads: [],

      //BELOW Most Recent Initial
      // WALLET_Initial1: false,
      // WALLET_Initial2: false,
      // WALLET_Initial3: false,
      // WALLET_Initial4: false,
      // WALLET_Initial5: false,
      // WALLET_Initial6: false,

      // WALLET_InitialDGMAddr: "",
      // WALLET_InitialIdentityInfo: "",
      // WALLET_InitialIdentityRaw: "",

      // WALLET_InitialByYouMsgs: [],
      // WALLET_InitialByYouNames: [],
      // WALLET_InitialByYouThreads: [],

      // WALLET_InitialToYouMsgs: [],
      // WALLET_InitialToYouNames: [],
      // WALLET_InitialToYouThreads: [],

      //ABOVE Most Recent Initial

      //BELOW Refresh
      WALLET_Refresh1: false,
      WALLET_Refresh2: false,
      WALLET_Refresh3: false,
      WALLET_Refresh4: false,
      WALLET_Refresh5: false,
      WALLET_Refresh6: false,

      WALLET_RefreshIdentityInfo: "",
      WALLET_RefreshIdentityRaw: "",

      WALLET_RefreshByYouMsgs: [],
      WALLET_RefreshByYouNames: [],
      WALLET_RefreshByYouThreads: [],

      WALLET_RefreshToYouMsgs: [],
      WALLET_RefreshToYouNames: [],
      WALLET_RefreshToYouThreads: [],

      //ABOVE Refresh

      //*** *** *** *** ***

      WALLET_ThreadMessageId: "",
      WALLET_messageToWhomName: "",

      //WALLET PAGE STATE^^^^^^

      //REVIEWS PAGE
      whichReviewsTab: "Search", //Search and Your Reviews

      isLoadingReviewsSearch: false,
      isLoadingYourReviews: true,

      nameToSearch: "",
      nameFormat: false,

      SearchReviews1: false,
      SearchReviews2: false,

      // SearchedNameDoc_EXCHANGE: [],  WRONG SPOT
      // SearchedNameOffers_EXCHANGE: [],

      isTooLongNameError: false, //Pass to form and add ->

      YourReviews1: false,
      YourReviews2: false,

      YourReviews: [],
      YourReviewNames: [],

      YourReplies: [],
      //^^ Doesn't need names because they are only your replies.. -> yes

      SearchedNameDoc: {
        $ownerId: "JAdeE9whiXXdxzSrz7Rd1i8aHC3XFh5AvuV7cpxcFAKE",
        label: "BurgerJoint",
      },

      SearchedReviews: [
        {
          $ownerId: "4h5j6j",
          $id: "7ku98rj",
          review: "Good service, would eat here again!",
          rating: 5,
          toId: "fjghtyru",
          $createdAt: Date.now() - 1000000,
        },
      ],

      SearchedReviewNames: [
        {
          $ownerId: "4h5j6j",
          label: "Alice",
        },
      ],

      SearchedReplies: [
        {
          $ownerId: "JAdeE9whiXXdxzSrz7Rd1i8aHC3XFh5AvuV7cpxcYYmN",
          $id: "klsui4312",
          reply: "Thanks Alice",
          reviewId: "7ku98rj",
          $createdAt: Date.now() - 300000,
        },
      ],

      reviewToEdit: [], //use a function to find and pass to modal ->
      reviewToEditIndex: "",

      replyReview: [], //This is for the create reply reviewId
      replyToEdit: [],
      replyingToName: "",

      //REVIEWS PAGE STATE^^^^^^

      //PROOFS PAGE
      whichTab_POD: "Search",

      isLoadingSearch_POD: false,

      isLoadingYourProofs: true,

      nameToSearch_POD: "",
      nameFormat_POD: false,
      isTooLongNameError_POD: false, // <- not connected to anything

      SearchedNameDoc_POD: {
        $ownerId: "4h5j6j",
        label: "Alice",
      },

      SearchedProofs: [
        {
          $ownerId: "4h5j6j",
          $id: "7ku98rj",

          address: "yadAMKzCFruDYg7bsvLVFfjXuVsN4rPqzw",
          message: "Its a me, Mario! I mean Alice lol",
          signature:
            "H2KKtQ1vdvAMeGHATxCa8Scj+xwscwzbIfpGKE20Ff1+PQQ+3vYZCKOoynzZ+SP9Wkv7k7es0XjFsgt4eK/7d0g=",

          $createdAt: Date.now() - 1000000,
        },
      ],

      YourProofs: [],

      selectedYourProof: "",
      selectedYourProofIndex: "",

      //PROOFS PAGE STATE^^^^^^

      selectedDapp: "Login",

      InitialPullReviews: true,
      InitialPullProofs: true,

      presentModal: "",
      isModalShowing: false,
      whichNetwork: import.meta.env.VITE_NETWORK, //"testnet" or 'mainnet',

      mnemonic: "",
      identity: "",
      identityInfo: "",
      identityRaw: "",
      uniqueName: "",
      aliasList: [],

      accountBalance: "",
      accountHistory: "",
      accountAddress: "",
      walletId: "",

      //BELOW IS OTHERS ADDRESSES

      WALLET_addresses: [],
      WALLET_addressesNames: [],

      platformLogin: false,

      //LocalForageKeys: [],
      DashMoneyLFKeys: [],
      FrontendFee: 0,
      validFrontendFee: true,

      //InitialWhyMoney: true,

      skipSynchronizationBeforeHeight: 1029000,

      //skipSynchronizationBeforeHeightMAINNET: 2130000,
      //skipSynchronizationBeforeHeightTESTNET: 1029000,

      expandedTopNav: false,
    };
  }

  closeTopNav = () => {
    this.setState({
      expandedTopNav: false,
    });
  };

  toggleTopNav = () => {
    if (this.state.expandedTopNav) {
      this.setState({
        expandedTopNav: false,
      });
    } else {
      this.setState({
        expandedTopNav: true,
      });
    }
  };

  handleSelectedDapp = (theDapp) => {
    this.setState({
      selectedDapp: theDapp,
      // InitialWhyMoney: false, //handles the Initial
      expandedTopNav: false,
    });
  };

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleMode = () => {
    if (this.state.mode === "primary")
      this.setState(
        {
          mode: "dark",
        },
        () => this.setFrontendLFmode()
      );
    else {
      this.setState(
        {
          mode: "primary",
        },
        () => this.setFrontendLFmode()
      );
    }
  };

  setFrontendLFmode = () => {
    let DashFrontend = LocalForage.createInstance({
      name: "dash-frontend",
    });
    DashFrontend.setItem("mode", this.state.mode)
      .then((d) => {
        console.log("Return from LF setitem:", d);
      })
      .catch((err) => {
        console.error("Something went wrong setting to localForage:\n", err);
      });
  };

  hideIdentityControlPage = () => {
    this.setState({
      isIdentityControlShowing: false,
    });
  };

  showIdentityControlPage = () => {
    this.setState({
      isIdentityControlShowing: true,
    });
  };

  handleLogout = () => {
    window.location.reload();
  };

  componentDidMount() {
    LocalForage.config({
      name: "dash-frontend",
    });
    let DashFrontend = LocalForage.createInstance({
      name: "dash-frontend",
    });
    DashFrontend.getItem("mode")
      .then((modeVal) => {
        if (modeVal !== null) {
          this.setState({
            mode: modeVal,
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    //
    //2) GET WALLETID KEYS FOR OBTAINING IDENTITY
    //
    LocalForage.config({
      name: "dashmoney-platform-login",
    });
    let DashMoneyLF = LocalForage.createInstance({
      name: "dashmoney-platform-login",
    });

    DashMoneyLF.keys()
      .then((keys) => {
        this.setState({
          DashMoneyLFKeys: keys,
        });
        console.log(keys);
      })
      .catch(function (err) {
        console.log(err);
      });

    //NEED TO ADD THE TESTNET/MAINNET VERIFY AND CHANGE IF TESTNET ->
    this.verifyFrontendFeeAndNetworkAndSkipSync();

    //HAVE TO HAVE THE NETWORK SET FIRST ->
    //this.getDSOEveryoneDocs(); //WHY NOT MOVE TO ONSELECT LIKE OTHERS -> it doesn't cause that much of an issue.
  }

  //ACCOUNT LOGIN FUNCTIONS => SIMPLE LOGIN FIRST
  triggerNameLoading = () => {
    this.setState({
      isLoadingName: true,
    });
  };

  triggerNameNotLoading = () => {
    this.setState({
      isLoadingName: false,
    });
  };

  triggerAliasLoading = () => {
    this.setState({
      isLoadingAlias: true,
    });
  };

  triggerAliasNotLoading = () => {
    this.setState({
      isLoadingAlias: false,
    });
  };

  //TRIGGER THE LOGIN PROCESS ->
  handleAccountLogin = (theMnemonic) => {
    if (this.state.DashMoneyLFKeys.length === 0) {
      this.setState(
        {
          isLoggedIn: true,
          mnemonic: theMnemonic,
        },
        () => this.getWalletAndIdentitywithMnem(theMnemonic)
      );
    } else {
      this.setState(
        {
          isLoggedIn: true,
          mnemonic: theMnemonic,
        },
        () => this.checkPlatformOnlyLogin(theMnemonic)
      );
    }
  };

  checkPlatformOnlyLogin = (theMnemonic) => {
    console.log("Called Check Platform Login");

    let clientOpts = {};
    if (this.state.whichNetwork === "mainnet") {
      clientOpts = {
        network: this.state.whichNetwork,
        dapiAddresses: [
          //'149.28.241.190:443',
          "134.255.182.186:443",
          "185.198.234.25:443",
        ],
        wallet: {
          mnemonic: theMnemonic,
          offlineMode: true,
        },
      };
    } else {
      clientOpts = {
        network: this.state.whichNetwork,

        wallet: {
          mnemonic: theMnemonic,
          offlineMode: true,
        },
      };
    }

    const client = new Dash.Client(clientOpts);

    const getWalletId = async () => {
      const account = await client.getWalletAccount();

      //console.log("walletIdToTry:", walletIdToTry);

      return account.walletId;
    };

    getWalletId()
      .then((walletIdToTry) => {
        let isKeyAvail = this.state.DashMoneyLFKeys.includes(walletIdToTry);
        // console.log(`DashMoneyLF Test -> ${isKeyAvail}`);

        if (isKeyAvail) {
          console.log("This here is a login skip!!");
          //************* */
          let DashMoneyLF = LocalForage.createInstance({
            name: "dashmoney-platform-login",
          });

          DashMoneyLF.getItem(walletIdToTry)
            .then((val) => {
              //  console.log("Value Retrieved", val);
              if (
                val !== null ||
                typeof val.identity !== "string" ||
                val.identity === "" ||
                val.name === "" ||
                typeof val.name !== "string"
              ) {
                // console.log(val.identity);
                this.setState(
                  {
                    platformLogin: true,
                    identity: val.identity,
                    uniqueName: val.name,
                    walletId: walletIdToTry,
                    isLoadingName: false,
                    isLoadingIdentity: false,
                  },
                  () => this.handlePlatformLoginSeq(val.identity, theMnemonic)
                );
              } else {
                console.log("platform login FROM LF failed");
                //JUST DO NORMAL FULL LOGIN
                //IF LF FAILS FOR SOME REASON JUST DOES NORMAL LOGIN
                this.setState(
                  {
                    platformLogin: false,
                    identity: "",
                    uniqueName: "",
                    walletId: walletIdToTry,
                  },
                  () => this.getWalletAndIdentitywithMnem(theMnemonic)
                );
              }
            })
            .catch((err) => {
              console.error(
                "Something went wrong getting from DashMoneyLF:\n",
                err
              );
            });
        } else {
          console.log("platform login FROM LF failed");
          //JUST DO NORMAL FULL LOGIN
          //FOR LOGIN WITH NEW MNEN BUT NOT IN LF
          this.setState(
            {
              platformLogin: false,
              walletId: walletIdToTry,
            },
            () => this.getWalletAndIdentitywithMnem(theMnemonic)
          );
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  handlePlatformLoginSeq = (theIdentity, theMnemonic) => {
    //
    this.getIdentityInfo(theIdentity);
    this.getWalletPlatformLogin(theMnemonic);
    // this.getNamefromIdentity(theIdentity); DONT NEED <=
    //this.getAliasfromIdentity(theIdentity); // NO MORE ALIASES
    //
    //  ----   ----   ----   ----   ----    ----   ----
    //
    //After(Identity/Name) -> trigger added to 2 Functions ABOVE
    // ForYou(Messages)
    //this.startMessagesQuerySeq(theIdentity);
    // DGM msgs(to&from) && //DGM AddressesFromWallet!
    //this.handleLoginQueries_WALLET(theIdentity);
  };

  handleAccountRetry = () => {
    this.setState(
      {
        isLoadingIdentity: true,
        isLoadingWallet: true,
      },
      () => this.getWalletAndIdentitywithMnem(this.state.mnemonic)
    );
  };
  //
  // BELOW STANDARD LOGIN
  getWalletAndIdentitywithMnem = (theMnemonic) => {
    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        theMnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
      //   {
      //   network: this.state.whichNetwork,

      //   dapiAddresses: ["44.233.44.95:1443"], // <= *****

      //   wallet: {
      //     mnemonic: theMnemonic,
      //     adapter: LocalForage.createInstance,
      //     unsafeOptions: {
      //       skipSynchronizationBeforeHeight:
      //         this.state.skipSynchronizationBeforeHeight,
      //     },
      //   },
      // }
    );

    //console.log(this.state.whichNetwork);
    //console.log(this.state.skipSynchronizationBeforeHeight);

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      //console.log(account.getTotalBalance());
      // console.log(account.getUnusedAddress().address);
      //console.log(account.getTransactionHistory());

      this.setState({
        accountBalance: account.getTotalBalance(),
        accountAddress: account.getUnusedAddress().address,
        accountHistory: account.getTransactionHistory(),
        walletId: account.walletId,
      });

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        //  console.log("Mnemonic identities:\n", d);
        if (d.length === 0) {
          this.setState({
            isLoadingIdentity: false,
            isLoadingWallet: false,

            //These are not called so end loading
            isLoadingIdInfo: false,
            isLoadingAlias: false,
            isLoadingName: false,

            identity: "no identity",
            //uniqueName: '', //Kicks out of platform login if identity is disabled but LF still retains.
          });
        } else {
          this.setState(
            {
              identity: d[0],
              isLoadingIdentity: false,
              isLoadingWallet: false,
              //maintain Loading bc continuing to other functions
            },
            () => this.conductFullLogin(d[0])
          );
        }
      })
      .catch((e) => {
        console.error(
          "Something went wrong getWalletAndIdentitywithMnem:\n",
          e
        );
        this.setState({
          identityError: true,
          isLoadingIdentity: false,
        });
      })
      .finally(() => client.disconnect());
  };
  conductFullLogin = (theIdentity) => {
    // <= Called from above func..
    // if (!this.state.platformLogin) { //Disconnected bc no platformlogin for now
    //   this.handleLoginAndLFobjectCreate(theIdentity);
    // }

    //THIS SHOULD CALL IDINFO, NAMES, AND ALIASES
    this.getIdentityInfo(theIdentity);
    this.getNamefromIdentity(theIdentity);
    // this.getAliasfromIdentity(theIdentity); NO MORE ALIASES?
  }; //Many LF, mostRecent and other functions have not been incorporated yet
  //
  //
  // BELOW PLATFORM LOGIN - WALLET PART
  getWalletPlatformLogin = (theMnemonic) => {
    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        theMnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      //console.log(account.getTotalBalance());
      // console.log(account.getUnusedAddress().address);
      //console.log(account.getTransactionHistory());

      this.setState({
        accountBalance: account.getTotalBalance(),
        accountAddress: account.getUnusedAddress().address,
        accountHistory: account.getTransactionHistory(),
        //walletId: account.walletId,
      });

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        //  console.log("Mnemonic identities:\n", d);
        //if (d.length === 0) {
        // NEED TO HANDLE IF RETURN IS EMPTY BUT I HAVE A KEY IN LF.
        // SHOULD I JUST NOT RETURN IDENTITY? OR
        // NEED ENTIRE NEW FUNCTION TO HANDLE CHANGING OF LF
        //   this.setState({
        //     isLoadingIdentity: false,
        //     isLoadingWallet: false,

        //     //These are not called so end loading
        //     isLoadingIdInfo: false,
        //     isLoadingAlias: false,
        //     isLoadingName: false,

        //     identity: "no identity",
        //     uniqueName: "", //Kicks out of platform login if identity is disabled but LF still retains.
        //   });
        // }
        if (this.state.identity === d[0]) {
          //SHOULD IT NOT EVEN WORRY ABOUT THE IDENTITY?
          this.setState(
            {
              identity: d[0],
              isLoadingIdentity: false,
              isLoadingWallet: false,
            } //,() => this.getAddresses_WALLET()
            //  CALL -> this.getAddresses_WALLET();
            // BC REQUIRES -> this.state.accountHistory
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong getWalletPlatformLogin:\n", e);
      })
      .finally(() => client.disconnect());
  };

  getIdentityInfo = (theIdentity) => {
    console.log("Called get identity info");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const retrieveIdentity = async () => {
      return client.platform.identities.get(theIdentity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        if (d !== null) {
          console.log("Identity retrieved:\n", d.toJSON());
          let idInfo = d.toJSON();
          this.setState({
            isLoadingIdInfo: false,
            identityInfo: idInfo,
            identityRaw: d,
          });
        } else {
          console.log("No Identity Info retrieved");
          //If I have an identity then there will be something but if there isn't an identity than this is not called? ->
        }
      })
      .catch((e) => {
        console.error(
          "Something went wrong in retrieving the identityinfo:\n",
          e
        );
        this.setState({
          isLoadingIdInfo: false,
          idInfoError: true, //NEED TO HANDLE SO CAN DISPLAY ->
        });
      })
      .finally(() => client.disconnect());
  };

  handleName = (nameToAdd) => {
    //From Name Purchase
    this.setState(
      {
        uniqueName: nameToAdd,
        isLoadingName: false,
      },
      () => this.LOGINCOMPLETEQueryTrigger(this.state.identity)
    );
    //
    this.loadIdentityCredits(); //Send Fee and update credits
    //
    //ADDS IDENTITY/NAME TO LF AFTER PURCHASE OF NAME
    //  //******************** */
    let DashMoneyLF = LocalForage.createInstance({
      name: "dashmoney-platform-login",
    });
    let lfObject = {
      identity: this.state.identity,
      name: nameToAdd,
    };

    DashMoneyLF.setItem(this.state.walletId, lfObject)
      .then((d) => {
        //return DashMoneyLF.getItem(walletId);
        console.log("Return from LF setitem:", d);
      })
      .catch((err) => {
        console.error("Something went wrong setting to DashMoneyLF:\n", err);
      });
    // //******************** */
  };

  getNamefromIdentity = (theIdentity) => {
    console.log(theIdentity);
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //const client = new Dash.Client({ network: "testnet" });

    const retrieveNameByRecord = async () => {
      // Retrieve by a name's identity ID
      return client.platform.names.resolveByRecord(
        "identity",
        // "dashUniqueIdentityId", record === 'identity'
        theIdentity // Your identity ID
      );
    };

    retrieveNameByRecord()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no Names.");
          this.setState({
            //Should catch the new name and aliases and stop spinner
            isLoadingName: false,
            uniqueName: "no name",
          });
        } else {
          let nameRetrieved = d[0].toJSON();
          //
          //  //******************** */
          //ADDS IDENTITY/NAME TO LF AFTER NORMAL LOGIN IF WALLETID IS NOT IN LF
          if (!this.state.platformLogin) {
            let DashMoneyLF = LocalForage.createInstance({
              name: "dashmoney-platform-login",
            });
            let lfObject = {
              identity: theIdentity,
              name: nameRetrieved.label,
            };

            DashMoneyLF.setItem(this.state.walletId, lfObject)
              .then((d) => {
                //return DashMoneyLF.getItem(walletId);
                //   console.log("Return from LF setitem:", d);
              })
              .catch((err) => {
                console.error(
                  "Something went wrong setting to DashMoneyLF:\n",
                  err
                );
              });
          }
          //******************** */
          console.log("Name retrieved:\n", nameRetrieved);
          this.setState(
            {
              uniqueName: nameRetrieved.label,
              isLoadingName: false,
            },
            () => this.LOGINCOMPLETEQueryTrigger(theIdentity)
          );
        }
      })
      .catch((e) => {
        this.setState({
          isLoadingName: false,
          nameError: true,
        });
        console.error("Something went wrong getting names:\n", e);
        // this.getAliasfromIdentity(theIdentity);
      })
      .finally(() => client.disconnect());
  };

  LOGINCOMPLETEQueryTrigger = (theIdentity) => {
    //After(Identity/Name) -> trigger added to 2 Functions ABOVE
    // ForYou(Messages)
    // this.startMessagesQuerySeq(theIdentity);
    // DGM msgs(to&from) && //DGM AddressesFromWallet!
    // this.handleLoginQueries_WALLET(theIdentity);
    //
    //if(this.state.platformLogin){}
    // this.getAddresses_WALLET(); //REQUIRES -> this.state.accountHistory
    // NEED TO CALL ^^^ AFTER THE WALLET IS PULLED <=
  };

  // ####  ####  WRITE ACTIONS BELOW  #### ####

  registerIdentity = () => {
    //REIMPLEMENT LFOBJ CREATE WHEN GET TO THAT POINT <-

    this.setState({
      isLoadingIdentity: true,
      isLoadingIdInfo: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const createIdentity = async () => {
      return client.platform.identities.register();
    };

    createIdentity()
      .then((d) => {
        console.log("Registered Identity:\n", d.toJSON());
        let idInfo = d.toJSON();
        this.setState(
          {
            identity: idInfo.id,
            identityInfo: idInfo,
            identityRaw: d,
            uniqueName: "no name", //This sets up the next step
            isLoadingIdentity: false,
            isLoadingIdInfo: false,
            //accountBalance: this.state.accountBalance - 1400000
          },
          () => this.getWalletAfterIdentityRegister()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          identityRegisterCount: this.state.identityRegisterCount + 1,
          isLoadingIdentity: false,
          isLoadingIdInfo: false,
          identityError: true,
        });
      })
      .finally(() => client.disconnect());
  };

  getWalletAfterIdentityRegister = () => {
    this.setState({
      isLoadingWallet: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const retrieveWallet = async () => {
      const account = await client.getWalletAccount();

      this.setState({
        accountBalance: account.getTotalBalance(),
        accountHistory: account.getTransactionHistory(),
      });

      return true;
    };

    retrieveWallet()
      .then((d) => {
        console.log("Wallet Reloaded:\n", d);
        this.setState({
          isLoadingWallet: false,
        });
      })
      .catch((e) => {
        console.error(
          "Something went wrong reloading WalletAfterIdentityRegister:\n",
          e
        );
        this.setState({
          isLoadingWallet: false,
        });
      })
      .finally(() => client.disconnect());
  };

  doTopUpIdentity = (numOfCredits) => {
    this.setState({
      isLoadingIdInfo: true,
      identityInfo: "",
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const topupIdentity = async () => {
      const identityId = this.state.identity; // Your identity ID
      const topUpAmount = numOfCredits; // Number of duffs ie 1000

      // await client.platform.identities.topUp(identityId, topUpAmount);
      // return client.platform.identities.get(identityId);
      return client.platform.identities.topUp(identityId, topUpAmount);
    };

    topupIdentity()
      .then((d) => {
        //console.log("Identity credit balance: ", d.balance);
        //Just manually add the topup amount
        this.setState(
          {
            identityInfo: "", //d.toJSON(),
            //identityRaw: d,
            isLoadingIdInfo: false,
            accountBalance: this.state.accountBalance - 1000000,
          },
          () => this.updateIdentityInfo()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingIdInfo: false,
          //Add error state to handle identityInfo being set to '' or else will be stuck in loading state.. ->
        });
      })
      .finally(() => client.disconnect());
  };
  //Name and Alias purchase is done in the modal.

  //ACCOUNT LOGIN FUNCTIONS^^^

  /*
   * PROXY FUNCTIONS
   *
   *   ################
   *   ###          ####
   *   ################
   *   ###
   *   ###
   */
  //
  //CHANGE TO PROXY ->
  //
  pullInitialTriggerPROXY = () => {
    if (this.state.InitialPullPROXY) {
      this.getProxyController();

      this.setState({
        InitialPullPROXY: false,
      });
    }
  };

  addProxyToController = (theProxyTuple) => {
    if (
      this.state.ProxyController.proxyList.length === 0 &&
      this.state.ProxyController.$id === undefined
    ) {
      this.createProxyController(theProxyTuple);
    } else {
      this.addProxyToController(theProxyTuple);
    }
  };

  createProxyController = (proxyTuple) => {
    // console.log("Called Create ProxyController");

    this.setState({
      isLoadingProxy: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitProxyDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      let proxyProperties = {
        proxyList: JSON.stringify([
          proxyTuple,
          // ...this.state.ProxyController.proxyList,
        ]),
      };

      console.log("controller to Create: ", proxyProperties);

      // Create the document
      const proxyDocument = await platform.documents.create(
        "ProxyContract.controller",
        identity,
        proxyProperties
      );

      //############################################################
      //This below disconnects the document sending..***

      //return proxyDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [proxyDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return proxyDocument;
    };

    submitProxyDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        //console.log("Document:\n", returnedDoc);

        // returnedDoc.replyId = Identifier.from(
        //   returnedDoc.replyId,
        //   "base64"
        // ).toJSON();
        returnedDoc.proxyList = JSON.parse(returnedDoc.proxyList);

        console.log("ControllerDocument:\n", returnedDoc);

        this.setState(
          {
            ProxyController: returnedDoc,
            //  isLoadingProxy: false,
          },
          () => this.loadIdentityCredits()
        );
        this.startProxyRace(returnedDoc);
      })
      .catch((e) => {
        console.error("Something went wrong with controller creation:\n", e);
      })
      .finally(() => client.disconnect());
  };

  addProxyToController = (proxyTuple) => {
    this.setState({
      isLoadingProxy: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitControllerDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const [document] = await client.platform.documents.get(
        "ProxyContract.controller",
        {
          where: [["$id", "==", this.state.ProxyController.$id]],
        }
      );

      let editedProxyList = [
        proxyTuple,
        ...this.state.ProxyController.proxyList,
      ];

      document.set("proxyList", JSON.stringify(editedProxyList));

      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;

      //############################################################
      //This below disconnects the document editing..***
      // console.log("Edited ProxyList");
      // return document;

      //This is to disconnect the Document editing***
      //############################################################
    };

    submitControllerDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        //console.log("Document:\n", returnedDoc);

        // returnedDoc.replyId = Identifier.from(
        //   returnedDoc.replyId,
        //   "base64"
        // ).toJSON();
        returnedDoc.proxyList = JSON.parse(returnedDoc.proxyList);

        console.log("ControllerDocument:\n", returnedDoc);

        this.setState(
          {
            ProxyController: returnedDoc,
            // isLoadingProxy: false,
          },
          () => this.loadIdentityCredits()
        );
        this.startProxyRace(returnedDoc);
      })
      .catch((e) => {
        console.error("Something went wrong with controller add:\n", e);
      })
      .finally(() => client.disconnect());
  };
  //attach this to the button on ProxyPage
  handleEditProxy = (proxyTuple, index) => {
    this.setState(
      {
        selectedProxyTuple: proxyTuple,
        selectedProxyTupleIndex: index,
      },
      () => this.showModal("EditProxyModal")
    );
  };
  //attach this to the button on the EditProxyModal
  //this is just edit
  editProxyController = (theProxyTuple) => {
    //If the items are not stringified, then need to stringify before saving

    //  console.log("Called Edit Item");
    this.setState({
      isLoadingProxy: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitControllerDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const [document] = await client.platform.documents.get(
        "ProxyContract.controller",
        {
          where: [["$id", "==", this.state.ProxyController.$id]],
        }
      );

      let editedProxyList = [...this.state.ProxyController.proxyList];

      editedProxyList.splice(
        this.state.selectedProxyTupleIndex,
        1,
        theProxyTuple
      );

      //need deep compare. change to string and compare..
      if (
        JSON.stringify(editedProxyList) !==
        JSON.stringify(this.state.ProxyController.proxyList)
      ) {
        document.set("proxyList", JSON.stringify([...editedProxyList]));

        await platform.documents.broadcast({ replace: [document] }, identity);
        return document;

        //############################################################
        //This below disconnects the document editing..***
        // console.log("Edited ProxyList");
        // return document;

        //This is to disconnect the Document editing***
        //############################################################
      } else {
        return document;
      }
    };

    submitControllerDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        //console.log("Document:\n", returnedDoc);

        // returnedDoc.replyId = Identifier.from(
        //   returnedDoc.replyId,
        //   "base64"
        // ).toJSON();
        returnedDoc.proxyList = JSON.parse(returnedDoc.proxyList);

        console.log("ControllerDocument:\n", returnedDoc);

        this.setState(
          {
            ProxyController: returnedDoc,
            isLoadingProxy: false,
          },
          () => this.loadIdentityCredits()
        );
        this.startProxyRace(returnedDoc);
      })
      .catch((e) => {
        console.error("Something went wrong with controller edit:\n", e);
      })
      .finally(() => client.disconnect());
  };

  handleDeleteProxy = (proxyTuple, index) => {
    this.setState(
      {
        selectedProxyTuple: proxyTuple,
        selectedProxyTupleIndex: index,
      },
      () => this.showModal("DeleteProxyModal")
    );
  };
  //this is the delete
  removeProxyFromController = () => {
    this.setState({
      isLoadingProxy: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    let editedProxyList = [...this.state.ProxyController.proxyList];

    const editControllerDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const [document] = await client.platform.documents.get(
        "ProxyContract.controller",
        {
          where: [["$id", "==", this.state.ProxyController.$id]],
        }
      );

      editedProxyList.splice(this.state.selectedProxyTupleIndex, 1);

      document.set("proxyList", JSON.stringify([...editedProxyList]));

      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;

      //############################################################
      //This below disconnects the document editing..***

      //return document;

      //This is to disconnect the Document editing***
      //############################################################
    };

    editControllerDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        //console.log("Document:\n", returnedDoc);

        // returnedDoc.replyId = Identifier.from(
        //   returnedDoc.replyId,
        //   "base64"
        // ).toJSON();
        returnedDoc.proxyList = JSON.parse(returnedDoc.proxyList);

        console.log("ControllerDocument:\n", returnedDoc);

        this.setState(
          {
            ProxyController: returnedDoc,
            isLoadingProxy: false,
          },
          () => this.loadIdentityCredits()
        );
        this.startProxyRace(returnedDoc);
      })
      .catch((e) => {
        console.error(
          "Something went wrong with delete proxy from controller:\n",
          e
        );
      })
      .finally(() => client.disconnect());
  };

  //
  //CHANGE TO PROXY ->
  //
  //What is the Queries -> ControllerDoc, (Proxies - to verify connected), and identity(credits)

  //THIS NEEDS TO BE GET THE PROXY CONTROLLER ->

  getProxyController = () => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      console.log("Called Query ProxyController");

      return client.platform.documents.get("ProxyContract.controller", {
        where: [["$ownerId", "==", this.state.identity]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no ProxyController.");
          this.setState({
            isLoadingProxy: false,
          });
        } else {
          let controllerRetrieved = d[0].toJSON();

          controllerRetrieved.proxyList = JSON.parse(
            controllerRetrieved.proxyList
          );

          console.log("Controller retrieved:\n", controllerRetrieved);
          this.setState(
            {
              ProxyController: controllerRetrieved,
              //isLoadingProxy: false,
            },
            () => this.startProxyRace(controllerRetrieved)
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  //WRITE SO CAN REUSE, FOR NAME WALLET WHEN CONNECTING PROXY
  startProxyRace = (theControlDoc) => {
    if (!this.state.isLoadingProxy) {
      this.setState({ isLoadingProxy: true });
    }

    let arrayOfProxyIds = theControlDoc.proxyList.map((tuple) => {
      return tuple[0];
    });
    if (arrayOfProxyIds.length !== 0) {
      this.getProxyDocs(arrayOfProxyIds);
      //this.getProxyBalances(arrayOfProxyIds);
    } else {
      this.setState({
        ProxyDocs: [],
        isLoadingProxy: false,
      });
    }
  };

  proxyRace = () => {
    if (
      this.state.Proxy1 //&& this.state.Proxy2
    ) {
      this.setState({
        Proxy1: false,
        Proxy2: false,
        isLoadingProxy: false,
      });
    }
  };

  getProxyDocs = (theProxyIdList) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      console.log("Called Query ProxyDocs");

      return client.platform.documents.get("ProxyContract.proxy", {
        where: [["$ownerId", "in", theProxyIdList]],

        orderBy: [["$ownerId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        // if (d.length === 0) {
        //   console.log("There are no ProxyDoc.");
        //   this.setState({
        //     isLoadingProxy: false,
        //   });
        // } else {
        //   let proxyRetrieved = d[0].toJSON();

        //   console.log("Proxy retrieved:\n", proxyRetrieved);
        //   this.setState(
        //     {
        //       ProxyDoc: proxyRetrieved,
        //       //isLoadingProxy: false,
        //     },
        //     () => this.startProxyRace(proxyRetrieved)
        //   );
        // }

        if (d.length === 0) {
          console.log("There are no Proxy Docs.");
          this.setState(
            {
              Proxy1: true,
            },
            () => this.proxyRace()
          );
        } else {
          let docArray = [];

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Proxy:\n", returnedDoc);
            returnedDoc.controlId = Identifier.from(
              returnedDoc.controlId,
              "base64"
            ).toJSON();
            //console.log("newProxy:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }

          this.setState(
            {
              ProxyDocs: docArray,
              Proxy1: true,
            },
            () => this.proxyRace()
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  //THIS NEEDS TO BE GET IDENTITIES OR CREDIT BALANCES -> not in the JS SDK library yet.

  //
  getProxyBalances = (theProxyIdList) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    async function dapiClientMethods() {
      let ProxyIdentifiers = theControlDoc.proxyList.map((id) => {
        return Identifier.from(id);
      });

      let result = await client
        .getDAPIClient()
        .platform.getIdentitiesBalances(ProxyIdentifiers);

      return result;
    }

    dapiClientMethods()
      .then((d) => {
        console.log("identitiesBalances:\n", d);
        // "entries": [
        //   {
        //     "identity_id": "jspLy7OhJKsoOv1C2tO9sgd7OAlll4ig8dr/zlufAB8=",
        //     "balance": 1000000
        //   },
        //   {
        //     "identity_id": "dUuJ2ujbIPxM7l462wexRtfv5Qimb6Co4QlGdbnao14=",
        //     "balance": 2500000
        //   }
        if (d.length === 0) {
          console.log("There are no Proxy Docs.");
          this.setState(
            {
              Proxy1: true,
            },
            () => this.proxyRace()
          );
        } else {
          // let docArray = [];

          // for (const n of d) {
          //   let returnedDoc = n.toJSON();
          //   //console.log("Invite:\n", returnedDoc);
          //   returnedDoc.toId = Identifier.from(
          //     returnedDoc.toId,
          //     "base64"
          //   ).toJSON();
          //   //console.log("newInvite:\n", returnedDoc);
          //   docArray = [...docArray, returnedDoc];
          // }

          let proxyControllerRetrieved = d[0].toJSON();

          console.log("Name retrieved:\n", proxyControllerRetrieved);
          this.setState(
            {
              ProxyController: proxyControllerRetrieved,
              Proxy1: true,
            },
            () => this.proxyRace()
          );
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  /* PROXY FUNCTIONS^^^^^
   *
   *                                  ################
   *                                  ###          ####
   *                                  ################
   *                                  ###
   *                                  ###
   *
   
   *
   */

  /*

   *      #############
   *     ####        ###
   *     ###
   *     ###     ########
   *     #####      ####
   *      #############
   */
  //GROUP FUNCTIONS

  //NOT QUITE WHAT i WANT BECAUSE WANT TO PULL EACH PULL.. OR DO I
  // I WNANT THE GROUPS TO APPEAR BUT ALSO i WANT
  pullInitialTriggerGROUPS = () => {
    //DOES THE STATE MAINTAIN AS i PULL NEW? -> and not show loading?
    this.getDGTInvites(this.state.identity); //invites and names.
    //will loading state protect if events pulled first?

    if (this.state.InitialPullGROUPS) {
      this.getActiveGroups();
      this.setState({
        InitialPullGROUPS: false, //ADD
      });
    }
  };

  handleSelectedJoinGroup = (groupName) => {
    this.setState(
      {
        selectedGroup: groupName,
      },
      () => this.showModal("JoinGroupModal")
    );
  };

  hideGroupPage = () => {
    this.setState({
      isGroupShowing: false,
    });
  };

  showGroupPage = (groupName) => {
    this.setState({
      selectedDapp: "Groups", // ADDED THIS FOR THE EVENT FUNCTIONALITY
      isModalShowing: false, // ADDED THIS FOR THE EVENT FUNCTIONALITY
      selectedGroup: groupName,
      isGroupShowing: true,
    });
  };
  //BELOW should not require the names, but can I still use the same state?
  //Which invites do I need.. just the ones that I sent my self and not invites from others or that I sent to others.

  getDGTInvitesForEvents = () => {
    if (!this.state.isLoadingGroupEvents) {
      this.setState({
        isLoadingGroupEvents: true,
      });
    }

    console.log("Calling DGTInvitesForEvents");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    //DGTInvite Query
    const getDocuments = async () => {
      return client.platform.documents.get("DGTContract.dgtinvite", {
        where: [
          ["toId", "==", this.state.identity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no DGTInvites");
          this.setState({
            dgtInvitesForEvents: [],
            isLoadingGroupEvents: false,
          });
        } else {
          let docArray = [];

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Invite:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newInvite:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }

          this.setState({
            dgtInvitesForEvents: docArray,
            isLoadingGroupEvents: false,
          });
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingGroupEvents: false,
        });
      })

      .finally(() => client.disconnect());
  };

  getDGTInvites = (theIdentity) => {
    this.setState({
      isLoadingGroups: true,
    });

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    //DGTInvite Query
    const getDocuments = async () => {
      return client.platform.documents.get("DGTContract.dgtinvite", {
        where: [
          ["toId", "==", theIdentity],
          //["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no DGTInvites");
          this.setState({
            isLoadingGroups: false,
          });
        } else {
          let docArray = [];

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Invite:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newInvite:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }

          this.getDGTInvitesNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))

      .finally(() => client.disconnect());
  };

  getDGTInvitesNames = (docArray) => {
    //console.log("Calling getNamesforDGTInvites");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    let arrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(arrayOfOwnerIds)];

    arrayOfOwnerIds = [...setOfOwnerIds];

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }

        this.setState({
          dgtInvitesNames: nameDocArray,
          dgtInvites: docArray,
          isLoadingGroups: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingGroups: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getActiveGroups = () => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    //DGTInvite Query
    const getDocuments = async () => {
      return client.platform.documents.get("DGTContract.dgtmsg", {
        limit: 60,
        where: [["$createdAt", "<=", Date.now()]],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no DGTInvites");
          this.setState({
            isLoadingActiveGroups: false,
          });
        } else {
          let docArray = [];

          // for (const n of d) {
          //   let returnedDoc = n.toJSON();
          //   //console.log("Doc:\n", returnedDoc);
          //   returnedDoc.msgId = Identifier.from(
          //     returnedDoc.msgId,
          //     "base64"
          //   ).toJSON();
          //   //console.log("newDoc:\n", returnedDoc);
          //   docArray = [...docArray, returnedDoc];
          // }

          for (const n of d) {
            //console.log("Invite Documents:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
            //DOES ANY PART OF DOCUMENT NEED CONVERTING? LIKE THE TOID? ->
          }

          let arrayOfGroups = docArray.map((doc) => {
            return doc.group;
          });

          let setOfGroups = [...new Set(arrayOfGroups)];

          let arrayOfUniqueGroups = [...setOfGroups];

          let uniqueActiveGroups = arrayOfUniqueGroups.map((grpName) => {
            return docArray.find((doc) => doc.group === grpName);
          });

          this.setState({
            dgtActiveGroups: uniqueActiveGroups,
            isLoadingActiveGroups: false,
          });
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))

      .finally(() => client.disconnect());
  };

  //Dont need to, the names are in the messages..! And just use the createdAt for the time =>

  submitCreateGroup = (newGroup) => {
    //Its just a name.
    this.setState({
      isLoadingGroups: true,
    });

    //Makes sure I dont send 2nd invite to myself

    let document = this.state.dgtInvites.find((invite) => {
      return (
        newGroup === invite.group && invite.$ownerId === this.state.identity
      );
    });

    if (document !== undefined) {
      this.setState({
        isLoadingGroups: false,
      });
    } else {
      //ADD INVITE TO DISPLAY AND CONTINUE TO DISPLAY UNTIL RETURNED

      // const clientOpts = {
      //   network: this.state.whichNetwork,
      //   wallet: {
      //     mnemonic: this.state.mnemonic,
      //     adapter: LocalForage.createInstance,
      //     unsafeOptions: {
      //       skipSynchronizationBeforeHeight:
      //         this.state.skipSynchronizationBeforeHeight,
      //       //change to what the actual block height
      //     },
      //   },
      //   apps: {
      //     DGTContract: {
      //       contractId: this.state.DataContractDGT,
      //     },
      //   },
      // };
      const client = new Dash.Client(
        dapiClient(
          this.state.whichNetwork,
          this.state.mnemonic,
          this.state.skipSynchronizationBeforeHeight
        )
      );

      const submitInvite = async () => {
        const { platform } = client;

        //const identity = await platform.identities.get(this.state.identity); // Your identity ID
        //const identity = this.state.identityRaw;
        let identity = "";
        if (this.state.identityRaw !== "") {
          identity = this.state.identityRaw;
        } else {
          identity = await platform.identities.get(this.state.identity);
        } // Your identity ID

        const docProperties = {
          group: newGroup,
          //toId: Buffer.from(Identifier.from(this.state.identity)),
          // handle on return or what? did i change it right?
          toId: this.state.identity,
          dgt: "self",
        };

        // Create the note document
        const dgtDocument = await platform.documents.create(
          "DGTContract.dgtinvite",
          identity,
          docProperties
        );

        const documentBatch = {
          create: [dgtDocument], // Document(s) to create
        };
        // Sign and submit the document(s)
        await platform.documents.broadcast(documentBatch, identity);
        return dgtDocument;
      };

      submitInvite()
        .then((d) => {
          let submittedDoc = d.toJSON();

          this.setState(
            {
              dgtInvites: [submittedDoc, ...this.state.dgtInvites],
              dgtInvitesForEvents: [
                submittedDoc,
                ...this.state.dgtInvitesForEvents,
              ],
              isLoadingGroups: false,
            },
            () => this.loadIdentityCredits()
          );
        })
        .catch((e) => {
          console.error("Something went wrong:\n", e);
          this.setState({
            isLoadingGroups: false,
            errorGroupsAdd: true, //Needs to add to state and handle
          });
        })
        .finally(() => client.disconnect());
    } // This is the close of the else statment
  };

  deleteGroup = (groupRemove) => {
    this.setState({
      isLoadingGroups: true,
      isGroupShowing: false,
    });

    //create a group to remove array for before display ->
    //Find the groupName of the doc and return the docId -> DONE

    let documentJSON = this.state.dgtInvites.find((invite) => {
      return (
        groupRemove === invite.group && invite.$ownerId === this.state.identity
      );
    });
    console.log(documentJSON);

    //let documentId = document.$id;

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const deleteDocument = async () => {
      const { platform } = client;
      const identity = this.state.identityRaw;

      const [document] = await client.platform.documents.get(
        "DGTContract.dgtinvite",
        { where: [["$id", "==", documentJSON.$id]] }
      );

      // Sign and submit the document delete transition
      await platform.documents.broadcast({ delete: [document] }, identity);
      return document;
    };

    deleteDocument()
      .then((d) => {
        console.log("Document deleted:\n", d.toJSON());

        let indexToDelete = this.state.dgtInvites.findIndex((invite) => {
          return invite.$id === d.toJSON().$id && invite.dgt === "self";
        });

        let mutableArray = this.state.dgtInvites;
        mutableArray.splice(indexToDelete, 1);

        this.setState({
          dgtInvites: mutableArray,
          dgtInvitesForEvents: mutableArray,
          isLoadingGroups: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingGroups: false,
          //Add Error alert ->
        });
      })
      .finally(() => client.disconnect());
  };

  joinGroup = (groupName) => {
    //HAHAH
    // IS THIS THE SAME AS SUBMITCREATEGROUP ABOVE???
    this.setState({
      isLoadingGroups: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitInvite = async () => {
      const { platform } = client;

      //const identity = await platform.identities.get(this.state.identity); // Your identity ID
      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      const docProperties = {
        group: groupName,
        //toId: Buffer.from(Identifier.from(this.state.identity)),
        // handle on return or what? did i change it right?
        toId: this.state.identity,
        dgt: "self",
      };

      // Create the note document
      const dgtDocument = await platform.documents.create(
        "DGTContract.dgtinvite",
        identity,
        docProperties
      );

      const documentBatch = {
        create: [dgtDocument], // Document(s) to create
      };
      // Sign and submit the document(s)
      await platform.documents.broadcast(documentBatch, identity);
      return dgtDocument;
    };

    submitInvite()
      .then((d) => {
        let submittedDoc = d.toJSON();

        this.setState(
          {
            dgtInvites: [submittedDoc, ...this.state.dgtInvites],
            dgtInvitesForEvents: [
              submittedDoc,
              ...this.state.dgtInvitesForEvents,
            ],
            isLoadingGroups: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingGroups: false,
          errorGroupsAdd: true, //Needs to be more specific
        });
      })
      .finally(() => client.disconnect());
  };

  // BELOW - Moved here from Group.jsx
  // Must also move the **state** here as well ->
  //Just go through the functions and pass the state that is there to app.js ->

  submitDGTmessage = (groupName, msgText) => {
    this.setState({
      isLoadingGroup: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    let docProperties = {
      group: groupName,
      message: msgText,
    };

    const submitMsgDocument = async () => {
      const { platform } = client;
      //const identity = this.state.identityRaw; // Your identity ID
      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      // Create the note document
      const dgtDocument = await platform.documents.create(
        "DGTContract.dgtmsg", // <- CHECK THIS
        identity,
        docProperties
      );

      const documentBatch = {
        create: [dgtDocument], // Document(s) to create
      };
      // Sign and submit the document(s)
      await platform.documents.broadcast(documentBatch, identity);
      return dgtDocument;
    };

    submitMsgDocument()
      .then((d) => {
        //console.log(d.toJSON());

        this.setState(
          {
            isLoadingGroup: false,
            GroupsMsgsToAdd: [d.toJSON(), ...this.state.GroupsMsgsToAdd],
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingGroup: false,
          sentGroupMsgError: true,
        });
      })
      .finally(() => client.disconnect());
  };

  submitDGTinvite = (dpnsDoc) => {
    //have to get the id of the name like DGM

    //Invite Sent alert ??? also add loading

    this.setState({
      isLoadingGroupInvite: true,
      // isLoadingGroup: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitInviteDocument = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      const docProperties = {
        toId: dpnsDoc.$ownerId,
        group: this.state.selectedGroup,
        dgt: "inv",
      };

      // Create the note document
      const dgtDocument = await platform.documents.create(
        "DGTContract.dgtinvite", // <- CHECK THIS
        identity,
        docProperties
      );

      const documentBatch = {
        create: [dgtDocument], // Document(s) to create
      };
      // Sign and submit the document(s)
      await platform.documents.broadcast(documentBatch, identity);
      return dgtDocument;
    };

    submitInviteDocument()
      .then((d) => {
        console.log(d.toJSON());
        this.setState(
          {
            isLoadingGroupInvite: false,
            sentGroupInviteSuccess: true,
            sendToNameInvite: dpnsDoc.label,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingGroupInvite: false,
          sentGroupInviteError: true,
        });
      })
      .finally(() => client.disconnect());
  };

  /*
  *GROUP FUNCTIONS^^^^
   *                             #############
   *                            ####        ###
   *                            ###
   *                            ###     ########
   *                            #####      ####
   *                             #############
   *##       ###    ###
   * ###    ####   ##
   *  ###  ## ## ###
   *   ## ##  ####
   *    ###   ###
   

   */ //WALLET FUNCTIONS

  handleTab_WALLET = (eventKey) => {
    if (eventKey === "Payments")
      this.setState({
        WALLET_whichTab: "Payments",
      });
    else {
      this.setState({
        WALLET_whichTab: "Your Wallet",
      });
    }
  };

  triggerPayButton = () => {
    this.setState({
      WALLET_whichPayType: "Pay",
    });
  };

  triggerRequestButton = () => {
    this.setState({
      WALLET_whichPayType: "Request",
    });
  };

  showAddrConfirmModal_WALLET = (inputAddr, inputNumber) => {
    this.setState(
      {
        WALLET_sendSuccess: false,
        WALLET_sendFailure: false,
        WALLET_sendMsgSuccess: false,
        WALLET_sendMsgFailure: false,
        WALLET_amountToSend: Number((inputNumber * 100000000).toFixed(0)),
        WALLET_sendToAddress: inputAddr,
        WALLET_sendToName: "",
        WALLET_messageToSend: "",
        presentModal: "ConfirmAddrPaymentModal",
        isModalShowing: true,
      } //,
      //() => {
      // console.log(this.state.sendToAddress);
      // console.log(this.state.amountToSend);
      //}
    );
  };

  showConfirmModal_WALLET = (
    inputName,
    inputNumber,
    dgmAddressDoc,
    message
  ) => {
    this.setState(
      {
        WALLET_sendSuccess: false,
        WALLET_sendFailure: false,
        WALLET_sendMsgSuccess: false,
        WALLET_sendMsgFailure: false,
        WALLET_sendToName: inputName,
        WALLET_amountToSend: Number((inputNumber * 100000000).toFixed(0)), //Number(inputNumber).toFixed(3),<- Old way // put in sats!! -> DONE
        WALLET_sendToAddress: dgmAddressDoc.address,
        WALLET_sendToDGMAddressDoc: dgmAddressDoc,
        WALLET_messageToSend: message,
        presentModal: "ConfirmPaymentModal",
        isModalShowing: true,
      } //,() => {
      // console.log(this.state.sendToName);
      // console.log(this.state.amountToSend);
      // console.log(this.state.messageToSend);
      // }
    );
  };
  // BELOW - PAYMENT REQUEST
  showRequestModal_WALLET = (inputNameDoc, inputNumber, message) => {
    this.setState(
      {
        WALLET_sendPmtMsgSuccess: false,
        WALLET_sendPmtMsgFailure: false,
        WALLET_requestPmtNameDoc: inputNameDoc,
        WALLET_sendToName: inputNameDoc.label,
        WALLET_amountToSend: Number((inputNumber * 100000000).toFixed(0)),
        WALLET_messageToSend: message,
        presentModal: "ConfirmRequestModal",
        isModalShowing: true,
      } //,() => {
      // console.log(this.state.sendToName);
      // console.log(this.state.amountToSend);
      // console.log(this.state.messageToSend);
      // }
    );
  };

  showPayRequestModal_WALLET = (
    inputNameDoc, //name and OwnerId
    reqMsgDoc //NEED FOR MSGID
    //inputNumber //Should already be in duffs
  ) => {
    //THIS IS AFTER YOU CLICK PAY ON PAYMENT REQUEST
    this.setState(
      {
        WALLET_sendSuccess: false,
        WALLET_sendFailure: false,
        WALLET_sendMsgSuccess: false,
        WALLET_sendMsgFailure: false,
        WALLET_sendPmtMsgSuccess: false,
        WALLET_sendPmtMsgFailure: false,
        WALLET_requestPmtNameDoc: inputNameDoc,
        WALLET_requestPmtReqDoc: reqMsgDoc,
        WALLET_sendToName: inputNameDoc.label,
        WALLET_amountToSend: Number(reqMsgDoc.amt), //Number((inputNumber * 100000000).toFixed(0)), //Number(inputNumber).toFixed(3),<- Old way // put in sats!! -> DONE
        // WALLET_sendToAddress: dgmAddressDoc.address,
        // WALLET_sendToDGMAddressDoc: dgmAddressDoc,
        // WALLET_messageToSend: message,
        presentModal: "PayRequestModal",
        isModalShowing: true,
      } //,() => {
      // console.log(this.state.sendToName);
      // console.log(this.state.amountToSend);
      // console.log(this.state.messageToSend);
      // }
    );
  };
  showRejectReplyReqModal_WALLET = (
    inputNameDoc, //name and OwnerId
    reqMsgDoc //NEED FOR MSGID***
    //inputNumber //Should already be in duffs
  ) => {
    this.setState(
      {
        WALLET_sendSuccess: false,
        WALLET_sendFailure: false,
        WALLET_sendMsgSuccess: false,
        WALLET_sendMsgFailure: false,
        WALLET_sendPmtMsgSuccess: false,
        WALLET_sendPmtMsgFailure: false,
        WALLET_requestPmtNameDoc: inputNameDoc,
        WALLET_requestPmtReqDoc: reqMsgDoc,
        WALLET_sendToName: inputNameDoc.label,
        WALLET_amountToSend: Number(reqMsgDoc.amt), //Number((inputNumber * 100000000).toFixed(0)), //Number(inputNumber).toFixed(3),<- Old way // put in sats!! -> DONE
        // WALLET_sendToAddress: dgmAddressDoc.address,
        // WALLET_sendToDGMAddressDoc: dgmAddressDoc,
        // WALLET_messageToSend: message,
        presentModal: "RejectReqModal",
        isModalShowing: true,
      } //,() => {
      // console.log(this.state.sendToName);
      // console.log(this.state.amountToSend);
      // console.log(this.state.messageToSend);
      // }
    );
  };

  // ^^^^ - PAYMENT REQUEST
  handleSuccessAlert_WALLET = () => {
    this.setState({
      WALLET_sendSuccess: false,
      WALLET_sendMsgSuccess: false,
    });
  };

  handleFailureAlert_WALLET = () => {
    this.setState({
      WALLET_sendFailure: false,
    });
  };

  handleFailureMsgAlert_WALLET = () => {
    this.setState({
      WALLET_sendMsgFailure: false,
    });
  };
  // BELOW - PAYMENT REQUEST
  handleFailurePmtMsgAlert_WALLET = () => {
    this.setState({
      WALLET_sendPmtMsgFailure: false,
    });
  };

  handleSuccessPmtMsgAlert_WALLET = () => {
    this.setState({
      WALLET_sendPmtMsgSuccess: false,
    });
  };
  // ^^^^ - PAYMENT REQUEST
  handleLoginforPostPaymentWallet_WALLET = () => {
    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const retrieveWallet = async () => {
      const account = await client.getWalletAccount();

      console.log(account.getTotalBalance());
      console.log(account);

      this.setState({
        accountBalance: account.getTotalBalance(),
        //accountAddress: account.getUnusedAddress().address,
        accountHistory: account.getTransactionHistory(),
      });

      return account;
    };

    retrieveWallet()
      .then((d) => {
        //console.log("Wallet Account:\n", d);
        this.setState(
          {
            isLoadingWallet: false,
            isLoadingButtons_WALLET: false,
            isLoadingRefresh_WALLET: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting Wallet:\n", e);
        this.setState({
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingRefresh_WALLET: false,
        });
      })
      .finally(() => client.disconnect());
  };

  handleThread_WALLET = (msgDocId, toName) => {
    if (!this.state.isLoadingRefresh_WALLET) {
      this.setState(
        {
          WALLET_ThreadMessageId: msgDocId,
          WALLET_messageToWhomName: toName,
        },
        () => this.showModal("ThreadModal_WALLET")
      );
    }
  };

  queryDGMDocument = (theIdentity) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      console.log("Called Query DGM Documents.");

      return client.platform.documents.get("DGMContract.dgmaddress", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          // console.log("address:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            dgmDocuments: docArray,
            WALLET_Login7: true,
          },
          () => this.checkLoginRace_WALLET()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  handleRefresh_WALLET = () => {
    this.setState({
      isLoadingWallet: true,
      isLoadingRefresh_WALLET: true,
      isLoadingButtons_WALLET: true,
      isLoadingMsgs_WALLET: true,
      WALLET_sendSuccess: false,
      WALLET_sendFailure: false,
      WALLET_sendMsgSuccess: false,
      WALLET_sendMsgFailure: false,
    });

    this.getRefreshByYou(this.state.identity);
    this.getRefreshToYou(this.state.identity);
    this.getRefreshIdentityInfo(this.state.identity);
    this.refreshWallet_WALLET();
  };

  checkRefreshRace = () => {
    if (
      this.state.WALLET_Refresh1 &&
      this.state.WALLET_Refresh2 &&
      this.state.WALLET_Refresh3 &&
      this.state.WALLET_Refresh4 &&
      this.state.WALLET_Refresh5 &&
      this.state.WALLET_Refresh6
    ) {
      this.setState({
        WALLET_ByYouMsgs: this.state.WALLET_RefreshByYouMsgs,
        WALLET_ByYouNames: this.state.WALLET_RefreshByYouNames,
        WALLET_ByYouThreads: this.state.WALLET_RefreshByYouThreads,

        WALLET_ToYouMsgs: this.state.WALLET_RefreshToYouMsgs,
        WALLET_ToYouNames: this.state.WALLET_RefreshToYouNames,
        WALLET_ToYouThreads: this.state.WALLET_RefreshToYouThreads,

        identityInfo: this.state.WALLET_RefreshIdentityInfo,
        identityRaw: this.state.WALLET_RefreshIdentityRaw,

        isLoadingWallet: false,
        isLoadingRefresh_WALLET: false,
        isLoadingButtons_WALLET: false,
        isLoadingMsgs_WALLET: false,

        WALLET_Refresh1: false,
        WALLET_Refresh2: false,
        WALLET_Refresh3: false,
        WALLET_Refresh4: false,
        WALLET_Refresh5: false,
        WALLET_Refresh6: false,
      });
    }
  };

  refreshWallet_WALLET = () => {
    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const retrieveWallet = async () => {
      const account = await client.getWalletAccount();

      this.setState({
        accountBalance: account.getTotalBalance(),
        //accountAddress: account.getUnusedAddress().address,
        accountHistory: account.getTransactionHistory(),
      });

      return account;
    };

    retrieveWallet()
      .then((d) => {
        //console.log("Wallet Account:\n", d);

        this.setState(
          {
            WALLET_Refresh6: true,
          },
          () => this.checkRefreshRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong RefreshWallet:\n", e);
      })
      .finally(() => client.disconnect());
  };

  getRefreshIdentityInfo = (theIdentity) => {
    console.log("Called get Refresh Identity Info");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const retrieveIdentity = async () => {
      return client.platform.identities.get(theIdentity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        console.log("Identity retrieved:\n", d.toJSON());
        let idInfo = d.toJSON();
        this.setState(
          {
            WALLET_RefreshIdentityInfo: idInfo,
            WALLET_RefreshIdentityRaw: d,
            WALLET_Refresh5: true,
          },
          () => this.checkRefreshRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong in getRefreshIdentityInfo:\n", e);
      })
      .finally(() => client.disconnect());
  };

  getRefreshByYou = (theIdentity) => {
    //Add the thread call
    //console.log("Calling getRefreshByYou");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("DGMContract.dgmmsg", {
        limit: 60,
        where: [
          ["$ownerId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no ForyouByyouMsgs");

          this.setState(
            {
              WALLET_Refresh1: true,
              WALLET_Refresh2: true,
            },
            () => this.checkRefreshRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting ForyouByyouMsgs");
          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Msg:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newMsg:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getRefreshByYouNames(docArray);
          this.getRefreshByYouThreads(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getRefreshByYouNames = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //START OF NAME RETRIEVAL - ToId not the ownerId!!!

    let ownerarrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(ownerarrayOfToIds)];

    let arrayOfToIds = [...setOfToIds];

    //console.log("Calling getRefreshByYouNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfToIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            WALLET_RefreshByYouNames: nameDocArray,
            WALLET_RefreshByYouMsgs: docArray,
            WALLET_Refresh1: true,
          },
          () => this.checkRefreshRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting RefreshByYou Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getRefreshByYouThreads = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    // This Below is to get unique set of ByYou msg doc ids
    let arrayOfMsgIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfMsgIds);

    let setOfMsgIds = [...new Set(arrayOfMsgIds)];

    arrayOfMsgIds = [...setOfMsgIds];

    //console.log("Array of order ids", arrayOfMsgIds);

    const getDocuments = async () => {
      //console.log("Called Get RefreshByYou Threads");

      return client.platform.documents.get("DGMContract.dgmthr", {
        where: [
          ["msgId", "in", arrayOfMsgIds],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [
          ["msgId", "asc"],
          ["$createdAt", "desc"],
        ],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.msgId = Identifier.from(
            returnedDoc.msgId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        if (docArray.length === 0) {
          this.setState(
            {
              WALLET_Refresh2: true,
            },
            () => this.checkRefreshRace()
          );
        } else {
          //this.getRefreshByYouThreadsNames(docArray); //Name Retrieval
          this.setState(
            {
              WALLET_RefreshByYouThreads: docArray,
              WALLET_Refresh2: true,
            },
            () => this.checkRefreshRace()
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong RefreshByYouThreads:\n", e);
        this.setState({
          WALLET_RefreshByYouThreadsError: true, //handle error ->
        });
      })
      .finally(() => client.disconnect());
  };

  getRefreshToYou = (theIdentity) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      // console.log("Called getRefreshToYou");

      return client.platform.documents.get("DGMContract.dgmmsg", {
        where: [
          ["toId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no ForyouByyouMsgs");

          this.setState(
            {
              WALLET_Refresh3: true,
              WALLET_Refresh4: true,
            },
            () => this.checkRefreshRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting getRefreshToYou");
          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Msg:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newMsg:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getRefreshToYouNames(docArray);
          this.getRefreshToYouThreads(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getRefreshToYouNames = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    //console.log("Calling getRefreshToYouNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //  console.log("INIT TOYOU NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            WALLET_RefreshToYouNames: nameDocArray,
            WALLET_RefreshToYouMsgs: docArray,
            WALLET_Refresh3: true,
          },
          () => this.checkRefreshRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting RefreshByYou Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getRefreshToYouThreads = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    // This Below is to get unique set of ByYou msg doc ids
    let arrayOfMsgIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfMsgIds);

    let setOfMsgIds = [...new Set(arrayOfMsgIds)];

    arrayOfMsgIds = [...setOfMsgIds];

    //console.log("Array of order ids", arrayOfMsgIds);

    const getDocuments = async () => {
      //console.log("Called Get RefreshByYou Threads");

      return client.platform.documents.get("DGMContract.dgmthr", {
        where: [
          ["msgId", "in", arrayOfMsgIds],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [
          ["msgId", "asc"],
          ["$createdAt", "desc"],
        ],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.msgId = Identifier.from(
            returnedDoc.msgId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        if (docArray.length === 0) {
          this.setState(
            {
              WALLET_Refresh4: true,
            },
            () => this.checkRefreshRace()
          );
        } else {
          this.setState(
            {
              WALLET_RefreshToYouThreads: docArray,
              WALLET_Refresh4: true,
            },
            () => this.checkRefreshRace()
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong RefreshToYouThreads:\n", e);
        this.setState({
          WALLET_RefreshByYouThreadsError: true, //handle error ->
        });
      })
      .finally(() => client.disconnect());
  };

  handleLoginQueries_WALLET = (theIdentity) => {
    //Add the GET ADDRESSES

    if (this.state.dgmDocuments.length === 0) {
      this.queryDGMDocument(theIdentity);
      // this.setState({
      //   WALLET_Login7: true,
      // });
    }
    this.getByYou_WALLET(theIdentity);
    this.getToYou_WALLET(theIdentity);
  };

  getAddresses_WALLET = () => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      console.log("Called getAddresses.");

      //CREATE A FUNCTION THAT GETS ALL THE ADDRESS FROM WALLET HISTORY ->
      //2 sides -> send to AND received from
      //NO ^^ ONLY SEND TO. CANT BE SURE WHERE RECIEVED IS FROM BUT I ONLY NEED THE SEND TO RESEND THE MSG AND ORDERS!
      //*** BUT  *** THEN CAN USE THE PLATFORM DATA **txId** FOR THE RECEIVED?? <= ??

      // let the component do the sorting for display
      // console.log(this.state.accountHistory);
      let addresses = [];
      this.state.accountHistory.forEach((tx, index) => {
        if (tx.type === "sent") {
          let addressToUse = tx.to.find((addr) => {
            // console.log(addr);
            return addr.addressType === "unknown";
          });
          // console.log(`AddressFromWallet:${addressToUse}`);
          if (addressToUse.address !== "false") {
            addresses.push(addressToUse.address);
          }
        }
      });

      // console.log(addresses);

      //SET UNIQUE!!
      let setOfAddresses = [...new Set(addresses)];

      let arrayOfAddresses = [...setOfAddresses];

      if (addresses !== undefined && addresses.length !== 0) {
        return client.platform.documents.get("DGMContract.dgmaddress", {
          where: [["address", "in", arrayOfAddresses]],
          orderBy: [["address", "asc"]],
        });
      } else {
        return [];
      }
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no Addresses_WALLET");
          this.setState({
            isLoadingAddresses_WALLET: false,
          });
        } else {
          let docArray = [];
          //console.log("Getting Addresses_WALLET");
          for (const n of d) {
            let returnedDoc = n.toJSON();
            // console.log("Addr Doc:\n", returnedDoc);

            docArray = [...docArray, returnedDoc];
          }
          this.getAddressesNames_WALLET(docArray);
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  getAddressesNames_WALLET = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    //console.log("Calling getByYouNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        // if (d.length === 0) {
        //   console.log("No DPNS domain documents retrieved.");
        // }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState({
          WALLET_addressesNames: nameDocArray,
          WALLET_addresses: docArray,
          isLoadingAddresses_WALLET: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong getting address Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  addAddress_WALLET = () => {}; //USE TO UPDATE addresses_WALLET once pmt is made! ->

  checkLoginRace_WALLET = () => {
    if (
      this.state.WALLET_Login1 &&
      this.state.WALLET_Login2 &&
      this.state.WALLET_Login3 &&
      this.state.WALLET_Login4 &&
      // this.state.WALLET_Login5 &&
      // this.state.WALLET_Login6 &&
      this.state.WALLET_Login7
    ) {
      this.setState({
        isLoadingMsgs_WALLET: false,
        isLoadingButtons_WALLET: false,
        // WALLET_Login1: false,
        // WALLET_Login2: false,
        // WALLET_Login3: false,
        // WALLET_Login4: false,
        // // WALLET_Login5: false,
        // // WALLET_Login6: false,
        // WALLET_Login7: false,
      });
    }
  };

  getByYou_WALLET = (theIdentity) => {
    //console.log("Calling getByYou");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("DGMContract.dgmmsg", {
        limit: 60,
        where: [
          ["$ownerId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no ForyouByyouMsgs");

          this.setState(
            {
              WALLET_Login1: true,
              WALLET_Login2: true,
            },
            () => this.checkLoginRace_WALLET()
          );
        } else {
          let docArray = [];
          //console.log("Getting ForyouByyouMsgs");
          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Msg:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newMsg:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getByYouNames_WALLET(docArray);
          this.getByYouThreads_WALLET(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getByYouNames_WALLET = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //START OF NAME RETRIEVAL - ToId not the ownerId!!!

    let ownerarrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(ownerarrayOfToIds)];

    let arrayOfToIds = [...setOfToIds];

    //console.log("Calling getByYouNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfToIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          // console.log("No DPNS domain documents retrieved.getByYouNames");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            WALLET_ByYouNames: nameDocArray,
            WALLET_ByYouMsgs: docArray,
            WALLET_Login1: true,
          },
          () => this.checkLoginRace_WALLET()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting ByYou Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  }; //Need to get the ToId not the ownerId ->

  getByYouThreads_WALLET = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    // This Below is to get unique set of ByYou msg doc ids
    let arrayOfMsgIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfMsgIds);

    let setOfMsgIds = [...new Set(arrayOfMsgIds)];

    arrayOfMsgIds = [...setOfMsgIds];

    //console.log("Array of order ids", arrayOfMsgIds);

    const getDocuments = async () => {
      //console.log("Called Get ByYou Threads");

      return client.platform.documents.get("DGMContract.dgmthr", {
        where: [
          ["msgId", "in", arrayOfMsgIds],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [
          ["msgId", "asc"],
          ["$createdAt", "desc"],
        ],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        //THERE ISN'T NECESSARY MESSAGE TO GRAB SO COULD BE ZERO SO STILL NEED TO END LOADING ->

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.msgId = Identifier.from(
            returnedDoc.msgId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        if (docArray.length === 0) {
          this.setState(
            {
              WALLET_Login2: true,
            },
            () => this.checkLoginRace_WALLET()
          );
        } else {
          //this.getByYouThreadsNames(docArray); //Name Retrieval
          this.setState(
            {
              WALLET_ByYouThreads: docArray,
              WALLET_Login2: true,
            },
            () => this.checkLoginRace_WALLET()
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong ByYouThreads:\n", e);
      })
      .finally(() => client.disconnect());
  };

  getToYou_WALLET = (theIdentity) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      console.log("Called getToYou");

      return client.platform.documents.get("DGMContract.dgmmsg", {
        where: [
          ["toId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no ForyouByyouMsgs");

          this.setState(
            {
              WALLET_Login3: true,
              WALLET_Login4: true,
            },
            () => this.checkLoginRace_WALLET()
          );
        } else {
          let docArray = [];
          //console.log("Getting getToYou");
          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("ToYou Msg:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newMsg:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getToYouNames_WALLET(docArray);
          this.getToYouThreads_WALLET(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getToYouNames_WALLET = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    //console.log("Calling getToYouNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            WALLET_ToYouNames: nameDocArray,
            WALLET_ToYouMsgs: docArray,
            WALLET_Login3: true,
          },
          () => this.checkLoginRace_WALLET()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting ByYou_WALLET Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getToYouThreads_WALLET = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    // This Below is to get unique set of ByYou msg doc ids
    let arrayOfMsgIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfMsgIds);

    let setOfMsgIds = [...new Set(arrayOfMsgIds)];

    arrayOfMsgIds = [...setOfMsgIds];

    //console.log("Array of order ids", arrayOfMsgIds);

    const getDocuments = async () => {
      //console.log("Called Get ByYou Threads");

      return client.platform.documents.get("DGMContract.dgmthr", {
        where: [
          ["msgId", "in", arrayOfMsgIds],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [
          ["msgId", "asc"],
          ["$createdAt", "desc"],
        ],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        //THERE ISN'T NECESSARY MESSAGE TO GRAB SO COULD BE ZERO SO STILL NEED TO END LOADING ->

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.msgId = Identifier.from(
            returnedDoc.msgId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        if (docArray.length === 0) {
          this.setState(
            {
              WALLET_Login4: true,
            },
            () => this.checkLoginRace_WALLET()
          );
        } else {
          this.setState(
            {
              WALLET_ToYouThreads: docArray,
              WALLET_Login4: true,
            },
            () => this.checkLoginRace_WALLET()
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong ToYouThreads_WALLET:\n", e);
      })
      .finally(() => client.disconnect());
  };

  //CREATING DOCUMENTS AND MAKING PAYMENTS

  RegisterDGMAddress_WALLET = () => {
    console.log("Called Register DGM Address");
    this.setState({
      isLoadingButtons_WALLET: true,
      isLoadingRefresh_WALLET: true,
      isLoadingForm_WALLET: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitNoteDocument = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      const docProperties = {
        address: this.state.accountAddress,
      };

      // Create the note document
      const dgmDocument = await platform.documents.create(
        "DGMContract.dgmaddress",
        identity,
        docProperties
      );

      const documentBatch = {
        create: [dgmDocument], // Document(s) to create
        replace: [], // Document(s) to update
        delete: [], // Document(s) to delete
      };
      // Sign and submit the document(s)
      await platform.documents.broadcast(documentBatch, identity);
      return dgmDocument;
    };

    submitNoteDocument()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Document:\n", returnedDoc);

        this.setState(
          {
            dgmDocuments: [returnedDoc],
            DGMAddress: [returnedDoc],
            isLoadingButtons_WALLET: false,
            isLoadingRefresh_WALLET: false,
            isLoadingForm_WALLET: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingButtons_WALLET: false,
          isLoadingRefresh_WALLET: false,
          isLoadingForm_WALLET: false,
        });
      })
      .finally(() => client.disconnect());
  };
  //FROM: https://dashpay.github.io/platform/Wallet-library/account/createTransaction/

  sendDashtoAddress_WALLET = () => {
    this.setState({
      isLoadingRefresh_WALLET: true,
      isLoadingButtons_WALLET: true,
      isLoadingWallet: true,
      isLoadingForm_WALLET: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const payToRecipient = async () => {
      const account = await client.getWalletAccount();

      let dashAmt = this.state.WALLET_amountToSend;
      console.log("sats sent in TX:", dashAmt);
      console.log(typeof dashAmt);

      // let amt = dashAmt.toFixed(0).toString();
      // console.log(amt);
      // console.log(typeof amt);

      const transaction = account.createTransaction({
        recipient: this.state.WALLET_sendToAddress,
        satoshis: dashAmt, //Must be a string!!
      });
      //return transaction;//Use to disable TX
      return account.broadcastTransaction(transaction);
    };

    payToRecipient()
      .then((d) => {
        console.log("Payment TX:\n", d);

        this.setState(
          {
            isLoadingRefresh_WALLET: false,
            isLoadingWallet: false,
            isLoadingButtons_WALLET: false,
            isLoadingForm_WALLET: false,
            WALLET_sendSuccess: true,
          },
          () => this.handleLoginforPostPaymentWallet_WALLET()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingRefresh_WALLET: false,
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingForm_WALLET: false,
          WALLET_sendFailure: true,
        });
      });
    //.finally(() => client.disconnect()); // <- Caused Error -> YES error dont use
  };

  sendDashtoName_WALLET = () => {
    this.setState({
      isLoadingRefresh_WALLET: true,
      isLoadingButtons_WALLET: true,
      isLoadingWallet: true,
      isLoadingForm_WALLET: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const payToRecipient = async () => {
      const account = await client.getWalletAccount();

      let dashAmt = this.state.WALLET_amountToSend;
      console.log("sats sent in TX:", dashAmt);
      console.log(typeof dashAmt);

      // let amt = dashAmt.toFixed(0).toString();
      // console.log(amt);
      // console.log(typeof amt);

      const transaction = account.createTransaction({
        recipient: this.state.WALLET_sendToAddress,
        satoshis: dashAmt, //Must be a string!!
      });
      //return transaction;//Use to disable TX
      return account.broadcastTransaction(transaction);
    };

    payToRecipient()
      .then((d) => {
        console.log("Payment TX:\n", d);

        this.setState(
          {
            // isLoadingWallet: false,
            // isLoadingButtons: false,
            // isLoadingForm: false,
            WALLET_sendSuccess: true,
          },
          () => this.handlePostPayment_WALLET(d)
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingRefresh_WALLET: false,
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingForm_WALLET: false,
          WALLET_sendFailure: true,
        });
      });
    //.finally(() => client.disconnect()); // <- Caused Error in the past, added back seems to fix more recent payment error. -> YES error dont use
  };
  //
  //3 BELOW FOR PAYMENT REQUESTS**

  requestDashfromName_WALLET = () => {
    //console.log("Called Submit Request Pmt Doc");

    this.setState({
      isLoadingRefresh_WALLET: true,
      isLoadingButtons_WALLET: true,
      isLoadingForm_WALLET: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    let docProperties = {};

    const submitDocument = async () => {
      const { platform } = client;
      // const identity = await platform.identities.get(this.state.identity); // Your identity ID

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      docProperties = {
        msg: this.state.WALLET_messageToSend,
        toId: this.state.WALLET_requestPmtNameDoc.$ownerId,
        txId: "", //Blank txId means Pmt Request
        amt: this.state.WALLET_amountToSend,
      };

      //console.log(docProperties);

      // Create the note document
      const dgmDocument = await platform.documents.create(
        "DGMContract.dgmmsg",
        identity,
        docProperties
      );

      console.log(dgmDocument.toJSON());

      //############################################################
      //This below disconnects the document sending..***

      //return dgmDocument;

      //This is to disconnect the Document Creation***

      //############################################################

      const documentBatch = {
        create: [dgmDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgmDocument;
    };

    submitDocument()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Msg Document:\n", returnedDoc);

        let newMsg;

        // required:['toId','txId',"$createdAt", "$updatedAt"],

        newMsg = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          toId: this.state.WALLET_requestPmtNameDoc.$ownerId,
          txId: "",
          msg: this.state.WALLET_messageToSend,
          amt: returnedDoc.amt,
          $createdAt: returnedDoc.$createdAt,
          $updatedAt: returnedDoc.$updatedAt,
        };

        this.setState(
          {
            WALLET_ByYouMsgs: [newMsg, ...this.state.WALLET_ByYouMsgs],
            isLoadingRefresh_WALLET: false,
            isLoadingButtons_WALLET: false,
            isLoadingForm_WALLET: false,
            WALLET_sendPmtMsgSuccess: true,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        this.setState({
          isLoadingRefresh_WALLET: false,
          isLoadingButtons_WALLET: false,
          isLoadingForm_WALLET: false,
          WALLET_sendPmtMsgFailure: true,
        });

        console.error("Something went wrong creating new PmtReq:\n", e);
      })
      .finally(() => client.disconnect());

    //THIS BELOW IS THE NAME DOC ADD, SO PROCESSES DURING DOC SUBMISSION ***

    //NOT ME BUT WHO I AM SENDING TO!! <- Fixed!

    let nameDoc = {
      $ownerId: this.state.WALLET_requestPmtNameDoc.$ownerId,
      label: this.state.WALLET_requestPmtNameDoc.label,
    };

    this.setState({
      WALLET_ByYouNames: [nameDoc, ...this.state.WALLET_ByYouNames],
    });
    //END OF NAME DOC ADD***
  };

  payDashtoRequest_WALLET = (theDGMAddr, addedMessage) => {
    //console.log(theDGMAddr);
    // console.log(addedMessage);
    this.setState({
      isLoadingRefresh_WALLET: true,
      isLoadingButtons_WALLET: true,
      isLoadingWallet: true,
      isLoadingForm_WALLET: true,
      isLoadingMsgs_WALLET: true,
      WALLET_messageToSend: "MSGFORpaidthr",
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const payToRecipient = async () => {
      const account = await client.getWalletAccount();

      let dashAmt = this.state.WALLET_amountToSend;
      console.log("sats sent in TX:", dashAmt);
      console.log(typeof dashAmt);

      // let amt = dashAmt.toFixed(0).toString();
      // console.log(amt);
      // console.log(typeof amt);

      const transaction = account.createTransaction({
        recipient: theDGMAddr,
        satoshis: dashAmt, //Must be a string!!
      });
      //return transaction; //Use to disable TX
      return account.broadcastTransaction(transaction);
    };

    payToRecipient()
      .then((d) => {
        console.log("Payment TX:\n", d);

        this.setState(
          {
            // isLoadingWallet: false,
            // isLoadingButtons: false,
            // isLoadingForm: false,
            WALLET_sendSuccess: true,
          },
          () => this.submitDGMThreadforRequest_WALLET(d, addedMessage)
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingRefresh_WALLET: false,
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingMsgs_WALLET: false,
          isLoadingForm_WALLET: false,
          WALLET_sendFailure: true,
        });
      });
    //.finally(() => client.disconnect()); // <- Caused Error in the past, added back seems to fix more recent payment error. -> YES error dont use
  };
  submitDGMThreadforRequest_WALLET = (theTxId, addedMessage) => {
    this.setState({
      isLoadingRefresh_WALLET: true,
      isLoadingWallet: true,
      isLoadingButtons_WALLET: true,
      isLoadingForm_WALLET: true,
      isLoadingMsgs_WALLET: true,
    });

    //console.log(addedMessage);

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    let docProperties = {};

    const submitDocuments = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      docProperties = {
        msg: addedMessage,
        msgId: this.state.WALLET_requestPmtReqDoc.$id,
        txId: theTxId,
      };

      // Create the note document
      const dgmDocument = await platform.documents.create(
        "DGMContract.dgmthr",
        identity,
        docProperties
      );

      //console.log(dsoDocument.toJSON());

      //############################################################
      //This below disconnects the document sending..***

      //return dgmDocument;

      //This is to disconnect the Document Creation***

      //############################################################

      const documentBatch = {
        create: [dgmDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgmDocument;
    };

    submitDocuments()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Thread Documents:\n", returnedDoc);

        let newThread;

        // required: [' 'msg','msgId', "$createdAt", "$updatedAt"],

        newThread = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          msgId: this.state.WALLET_requestPmtReqDoc.$id,
          msg: addedMessage,
          txId: theTxId,
          $createdAt: returnedDoc.$createdAt,
        };

        this.setState(
          {
            WALLET_ByYouThreads: [newThread, ...this.state.WALLET_ByYouThreads],
            //BELOW 3 are handle in the POSTPAYMENTWallet function.
            //isLoadingRefresh_WALLET: false,
            //isLoadingWallet: false,
            //isLoadingButtons_WALLET: false,
            isLoadingForm_WALLET: false,
            WALLET_sendMsgSuccess: true,
            isLoadingMsgs_WALLET: false,
          },
          () => this.handleLoginforPostPaymentWallet_WALLET()
        );
      })
      .catch((e) => {
        this.setState(
          {
            isLoadingRefresh_WALLET: false,
            isLoadingWallet: false,
            isLoadingButtons_WALLET: false,
            isLoadingForm_WALLET: false,
            WALLET_sendMsgFailure: true,
            isLoadingMsgs_WALLET: false,
          },
          () => this.handleLoginforPostPaymentWallet_WALLET()
        );

        console.error("Something went wrong creating new thread:\n", e);
      })
      .finally(() => client.disconnect());
    // THIS BELOW IS THE NAME DOC ADD, SO PROCESSES DURING DOC SUBMISSION ***

    // NOT ME BUT WHO I AM SENDING TO!! <- Fixed!

    let nameDoc = {
      $ownerId: this.state.WALLET_requestPmtNameDoc.$ownerId,
      label: this.state.WALLET_requestPmtNameDoc.label,
    };

    this.setState({
      WALLET_ByYouNames: [nameDoc, ...this.state.WALLET_ByYouNames],
    });
    //END OF NAME DOC ADD***
  };

  rejectOrReplyRequestThread_WALLET = (addedMessage, ifReject) => {
    this.setState({
      isLoadingRefresh_WALLET: true,
      isLoadingWallet: true,

      isLoadingButtons_WALLET: true,
      isLoadingForm_WALLET: true,
      isLoadingMsgs_WALLET: true,
    });

    //console.log(addedMessage);

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    let docProperties = {};

    const submitDocuments = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID
      if (ifReject) {
        docProperties = {
          msg: addedMessage,
          msgId: this.state.WALLET_requestPmtReqDoc.$id,
          txId: "rej",
        };
      } else {
        docProperties = {
          msg: addedMessage,
          msgId: this.state.WALLET_requestPmtReqDoc.$id,
        };
      }

      // Create the note document
      const dgmDocument = await platform.documents.create(
        "DGMContract.dgmthr",
        identity,
        docProperties
      );

      //console.log(dsoDocument.toJSON());

      //############################################################
      //This below disconnects the document sending..***

      // return dgmDocument;

      //This is to disconnect the Document Creation***

      //############################################################

      const documentBatch = {
        create: [dgmDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgmDocument;
    };

    submitDocuments()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Thread Documents:\n", returnedDoc);

        let newThread;

        // required: [' 'msg','msgId', "$createdAt", "$updatedAt"],
        if (ifReject) {
          newThread = {
            $ownerId: returnedDoc.$ownerId,
            $id: returnedDoc.$id,
            msgId: this.state.WALLET_requestPmtReqDoc.$id,
            msg: addedMessage,
            $createdAt: returnedDoc.$createdAt,
            txId: "rej",
          };
        } else {
          newThread = {
            $ownerId: returnedDoc.$ownerId,
            $id: returnedDoc.$id,
            msgId: this.state.WALLET_requestPmtReqDoc.$id,
            msg: addedMessage,
            $createdAt: returnedDoc.$createdAt,
          };
        }

        this.setState({
          WALLET_ByYouThreads: [newThread, ...this.state.WALLET_ByYouThreads],

          isLoadingRefresh_WALLET: false,
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingForm_WALLET: false,

          isLoadingMsgs_WALLET: false,
        });
      })
      .catch((e) => {
        this.setState({
          isLoadingRefresh_WALLET: false,
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingForm_WALLET: false,

          isLoadingMsgs_WALLET: false,
        });

        console.error("Something went wrong creating new thread:\n", e);
      })
      .finally(() => client.disconnect());
  };
  //
  // ^^^ FOR PAYMENT REQUESTS**
  //
  handlePostPayment_WALLET = (txId) => {
    if (this.state.WALLET_messageToSend === "") {
      this.setState(
        {
          isLoadingForm_WALLET: false,
        },
        () => this.handleLoginforPostPaymentWallet_WALLET()
      );
    } else {
      this.submitDGMMessage_WALLET(txId);
    }
  };
  //BELOW  handle the msg fail to send in the below function and change the wording/create an new alert that handles. <= do it =>
  submitDGMMessage_WALLET = (theTXId) => {
    console.log("Called Submit DGM MSG Doc");

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    let docProperties = {};

    const submitDocument = async () => {
      const { platform } = client;
      // const identity = await platform.identities.get(this.state.identity); // Your identity ID

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      docProperties = {
        msg: this.state.WALLET_messageToSend,
        toId: this.state.WALLET_sendToDGMAddressDoc.$ownerId,
        txId: theTXId,
      };

      //console.log(docProperties);

      // Create the note document
      const dgmDocument = await platform.documents.create(
        "DGMContract.dgmmsg",
        identity,
        docProperties
      );

      console.log(dgmDocument.toJSON());

      //############################################################
      //This below disconnects the document sending..***

      // return dgmDocument;

      //This is to disconnect the Document Creation***

      //############################################################

      const documentBatch = {
        create: [dgmDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgmDocument;
    };

    submitDocument()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Msg Document:\n", returnedDoc);

        let newMsg;

        // required:['toId','txId',"$createdAt", "$updatedAt"],

        newMsg = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          toId: this.state.WALLET_sendToDGMAddressDoc.$ownerId,
          txId: theTXId,
          msg: this.state.WALLET_messageToSend,
          $createdAt: returnedDoc.$createdAt,
        };

        this.setState(
          {
            WALLET_ByYouMsgs: [newMsg, ...this.state.WALLET_ByYouMsgs],
            isLoadingForm_WALLET: false,
            WALLET_sendMsgSuccess: true,
          },
          () => this.handleLoginforPostPaymentWallet_WALLET()
        );
      })
      .catch((e) => {
        this.setState(
          {
            isLoadingForm_WALLET: false,
            WALLET_sendMsgFailure: true,
          },
          () => this.handleLoginforPostPaymentWallet_WALLET()
        );

        console.error("Something went wrong creating new msg:\n", e);
      })
      .finally(() => client.disconnect());

    //THIS BELOW IS THE NAME DOC ADD, SO PROCESSES DURING DOC SUBMISSION ***

    //NOT ME BUT WHO I AM SENDING TO!! <- Fixed!

    let nameDoc = {
      $ownerId: this.state.WALLET_sendToDGMAddressDoc.$ownerId,
      label: this.state.WALLET_sendToName,
    };

    this.setState({
      WALLET_ByYouNames: [nameDoc, ...this.state.WALLET_ByYouNames],
    });
    //END OF NAME DOC ADD***
  };

  submitDGMThread_WALLET = (addedMessage) => {
    this.setState({
      isLoadingRefresh_WALLET: true,
      isLoadingWallet: true,
      isLoadingButtons_WALLET: true,
      isLoadingForm_WALLET: true,
      isLoadingMsgs_WALLET: true,
    });

    //console.log(addedMessage);

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    let docProperties = {};

    const submitDocuments = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      docProperties = {
        msg: addedMessage,
        msgId: this.state.WALLET_ThreadMessageId,
      };

      // Create the note document
      const dgmDocument = await platform.documents.create(
        "DGMContract.dgmthr",
        identity,
        docProperties
      );

      //console.log(dsoDocument.toJSON());

      //############################################################
      //This below disconnects the document sending..***

      // return dgmDocument;

      //This is to disconnect the Document Creation***

      //############################################################

      const documentBatch = {
        create: [dgmDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgmDocument;
    };

    submitDocuments()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Thread Documents:\n", returnedDoc);

        let newThread;

        // required: [' 'msg','msgId', "$createdAt", "$updatedAt"],

        newThread = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          msgId: this.state.WALLET_ThreadMessageId,
          msg: addedMessage,
          $createdAt: returnedDoc.$createdAt,
        };

        this.setState({
          WALLET_ByYouThreads: [newThread, ...this.state.WALLET_ByYouThreads],

          isLoadingRefresh_WALLET: false,
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingForm_WALLET: false,

          isLoadingMsgs_WALLET: false,
        });
      })
      .catch((e) => {
        this.setState({
          isLoadingRefresh_WALLET: false,
          isLoadingWallet: false,
          isLoadingButtons_WALLET: false,
          isLoadingForm_WALLET: false,

          isLoadingMsgs_WALLET: false,
        });

        console.error("Something went wrong creating new thread:\n", e);
      })
      .finally(() => client.disconnect());
  };

  /*
   *WALLET FUNCTIONS^^^^
   *                            ##       ###    ###
   *                             ###    ####   ##
   *                              ###  ## ## ###
   *                               ## ##  ####
   *                                ###   ###
   *
   *   ###       ###
   *    ###     ###
   *      #######
   *        ###
   *        ###
   *        ###
   */
  //YOUR STORE FUNCTIONS

  getWalletForNewOrder = () => {
    //For Merchant to Load New Orders. But also Buyer for wallet reload after purchase

    this.setState({
      isLoadingWallet: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      this.setState({
        accountBalance: account.getTotalBalance(),
        accountHistory: account.getTransactionHistory(),
      });

      return true;
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Wallet Reloaded:\n", d);
        this.setState({
          isLoadingWallet: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong reloading Wallet:\n", e);
        this.setState({
          isLoadingWallet: false,
          walletReloadError: true, //Add this to state and handle ->
        });
      })
      .finally(() => client.disconnect());
  };

  /*
   *SHOPPING FUNCTIONS^^^^
   *                             #############
   *                            ###
   *                             #############
   *                                        ###
   *                             #############
   *
   *
   *      ################
   *      ###
   *      ################
   *      ###
   *      ################
   */
  //EXCHANGE FUNCTIONS

  /*
   *EXCHANGE FUNCTIONS^^^^
   *                                 ################
   *                                 ###
   *                                 ################
   *                                 ###
   *                                 ################
   *
   *
   *   ################
   *   ###          ####
   *   ################
   *   ###          ####
   *   ###           ####
   */

  //REVIEWS FUNCTIONS
  handleReviewsTab = (eventKey) => {
    if (eventKey === "Search")
      this.setState({
        whichReviewsTab: "Search",
      });
    else {
      this.setState({
        whichReviewsTab: "Your Reviews",
      });
    }
  };

  handleReviewsOnChangeValidation = (event) => {
    // this.setState({
    //   isTooLongNameError:false,
    // });

    if (event.target.id === "validationCustomName") {
      this.nameValidate(event.target.value);
    }
  };

  nameValidate = (nameInput) => {
    let regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    let valid = regex.test(nameInput);

    if (valid) {
      this.setState({
        nameToSearch: nameInput,
        nameFormat: true,
      });
    } else {
      //isTooLongNameError => Add if statement here =>
      this.setState({
        nameToSearch: nameInput,
        nameFormat: false,
      });
    }
  };

  searchName_REVIEW = () => {
    //add spinner start -> connect ->
    // clear previous results ->

    this.setState({
      isLoadingReviewsSearch: true,
      SearchedReviews: [],
    });

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const retrieveName = async () => {
      // Retrieve by full name (e.g., myname.dash)
      //console.log(this.state.nameToSearch);
      return client.platform.names.resolve(`${this.state.nameToSearch}.dash`);
    };

    retrieveName()
      .then((d) => {
        if (d === null) {
          console.log("No DPNS Document for this Name.");
          this.setState({
            SearchedNameDoc: "No NameDoc", //Handle if name fails ->
            isLoadingReviewsSearch: false,
          });
        } else {
          let nameDoc = d.toJSON();
          console.log("Name retrieved:\n", nameDoc);

          this.startSearch_REVIEW(nameDoc.$ownerId);

          this.setState({
            SearchedNameDoc: nameDoc,
          });
        }
      })
      .catch((e) => {
        this.setState({
          SearchedNameDoc: "No NameDoc",
          isLoadingReviewsSearch: false,
        });
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  handleEditReview = (review, index) => {
    this.setState(
      {
        reviewToEdit: review,
        reviewToEditIndex: index,
      },
      () => this.showModal("EditReviewModal")
    );
  };

  //PUT THE QUERY SEARCHES HERE
  startSearch_REVIEW = (identityToSearch) => {
    //Called from name doc pulled ->
    this.getSearchReviews(identityToSearch);
  };

  searchReviewsRace = () => {
    if (this.state.SearchReviews1 && this.state.SearchReviews2) {
      this.setState({
        SearchReviews1: false,
        SearchReviews2: false,
        //DONT HAVE TO ADD STATE TO PUSH TO DISPLAY BECAUSE THE REVIEWS AND NAMES PUSHED TOGETHER AND THEN THREADS APPEAR <- SO DO I WANT TO QUERY NAME FIRST THEN?
        isLoadingReviewsSearch: false,
      });
    }
  };

  getSearchReviews = (theIdentity) => {
    //console.log("Calling getSearchReviews");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("DGRContract.dgrreview", {
        where: [
          ["toId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no SearchReviews");

          this.setState(
            {
              SearchReviews1: true,
              SearchReviews2: true,
              SearchedReviews: [],
            },
            () => this.searchReviewsRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting Search Reviews");

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Review:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newReview:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getSearchReviewNames(docArray);
          this.getSearchReplies(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getSearchReviewNames = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    // Start of Setting Unique reviews
    let arrayOfReviews = arrayOfOwnerIds.map((id) => {
      return docArray.find((doc) => id === doc.$ownerId);
    });
    // End of Setting Unique reviews

    // arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
    //   Buffer.from(Identifier.from(item))
    // );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            SearchedReviewNames: nameDocArray,
            SearchedReviews: arrayOfReviews, //This is a unique set of reviews only single review per reviewer
            SearchReviews1: true,
          },
          () => this.searchReviewsRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting Search Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getSearchReplies = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    // This Below is to get unique set of ByYou review doc ids
    let arrayOfReviewIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfReviewIds);

    let setOfReviewIds = [...new Set(arrayOfReviewIds)];

    arrayOfReviewIds = [...setOfReviewIds];

    //console.log("Array of order ids", arrayOfReviewIds);

    const getDocuments = async () => {
      //console.log("Called Get Search Replies");

      return client.platform.documents.get("DGRContract.dgrreply", {
        where: [["reviewId", "in", arrayOfReviewIds]], // check reviewId ->
        orderBy: [["reviewId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.reviewId = Identifier.from(
            returnedDoc.reviewId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        this.setState(
          {
            SearchReviews2: true,
            SearchedReplies: docArray,
          },
          () => this.searchReviewsRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong Search Replies:\n", e);
      })
      .finally(() => client.disconnect());
  };

  pullInitialTriggerREVIEWS = () => {
    this.getYourReviews(this.state.identity);
    this.setState({
      InitialPullReviews: false,
    });
  };

  yourReviewsRace = () => {
    if (this.state.YourReviews1 && this.state.YourReviews2) {
      this.setState({
        YourReviews1: false,
        YourReviews2: false,

        isLoadingYourReviews: false,
      });
    }
  };

  getYourReviews = (theIdentity) => {
    //console.log("Calling getYourReviews");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("DGRContract.dgrreview", {
        where: [
          ["toId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no YourReviews");

          this.setState(
            {
              YourReviews1: true,
              YourReviews2: true,
            },
            () => this.yourReviewsRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting YourReviews Reviews");

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Review:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newReview:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getYourReviewNames(docArray);
          this.getYourReplies(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getYourReviewNames = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    // arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
    //   Buffer.from(Identifier.from(item))
    // );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            YourReviewNames: nameDocArray,
            YourReviews: docArray,
            YourReviews1: true,
          },
          () => this.yourReviewsRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting YourReview Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getYourReplies = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    // This Below is to get unique set of ByYou review doc ids
    let arrayOfReviewIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfReviewIds);

    let setOfReviewIds = [...new Set(arrayOfReviewIds)];

    arrayOfReviewIds = [...setOfReviewIds];

    //console.log("Array of order ids", arrayOfReviewIds);

    const getDocuments = async () => {
      //console.log("Called Get Search Replies");

      return client.platform.documents.get("DGRContract.dgrreply", {
        where: [["reviewId", "in", arrayOfReviewIds]], // check reviewId ->
        orderBy: [["reviewId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.reviewId = Identifier.from(
            returnedDoc.reviewId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        this.setState(
          {
            YourReviews2: true,
            YourReplies: docArray,
          },
          () => this.yourReviewsRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong Search Replies:\n", e);
      })
      .finally(() => client.disconnect());
  };

  handleYourReply = (reviewDoc, revieweeLabel) => {
    //First search and see if there is already a reply for the review
    let replyDoc = this.state.YourReplies.find((doc) => {
      return doc.reviewId === reviewDoc.$id;
    });

    if (replyDoc !== undefined) {
      this.setState(
        {
          replyReview: reviewDoc,
          replyToEdit: replyDoc,
          replyingToName: revieweeLabel,
        },
        () => this.showModal("EditReplyModal")
      );
    } else {
      this.setState(
        {
          replyReview: reviewDoc,
          replyToEdit: [],
          replyingToName: revieweeLabel,
        },
        () => this.showModal("CreateReplyModal")
      );
    }
  };

  createReview = (reviewObject) => {
    //console.log("Called Create Review");

    this.setState({
      isLoadingReviewsSearch: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitReviewDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const reviewProperties = {
        toId: this.state.SearchedNameDoc.$ownerId,
        review: reviewObject.review,
        rating: reviewObject.rating,
      };
      //console.log('Review to Create: ', reviewProperties);

      // Create the note document
      const dgrDocument = await platform.documents.create(
        "DGRContract.dgrreview",
        identity,
        reviewProperties
      );

      //############################################################
      //This below disconnects the document sending..***

      // return dgrDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [dgrDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgrDocument;
    };

    submitReviewDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        //console.log("Document:\n", returnedDoc);

        let review = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,

          review: reviewObject.review,
          rating: reviewObject.rating,

          $createdAt: returnedDoc.$createdAt,
        };

        this.setState(
          {
            SearchedReviews: [review, ...this.state.SearchedReviews],
            isLoadingReviewsSearch: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong with review creation:\n", e);
      })
      .finally(() => client.disconnect());

    //THIS BELOW IS THE NAME DOC ADD, SO PROCESSES DURING DOC SUBMISSION ***
    let nameDoc = {
      $ownerId: this.state.identity,
      label: this.state.uniqueName,
    };

    this.setState({
      SearchedReviewNames: [nameDoc, ...this.state.SearchedReviewNames],
    });
    //END OF NAME DOC ADD***
  };

  editReview = (reviewObject) => {
    //console.log("Called Edit Review");

    this.setState({
      isLoadingReviewsSearch: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitReviewDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const [document] = await client.platform.documents.get(
        "DGRContract.dgrreview",
        {
          where: [["$id", "==", this.state.reviewToEdit.$id]],
        }
      );

      if (this.state.reviewToEdit.review !== reviewObject.review) {
        document.set("review", reviewObject.review);
      }

      if (this.state.reviewToEdit.rating !== reviewObject.rating) {
        document.set("review", reviewObject.rating);
      }

      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;

      //############################################################
      //This below disconnects the document editing..***

      //return document;

      //This is to disconnect the Document editing***
      //############################################################
    };

    submitReviewDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        //console.log("Edited Review Doc:\n", returnedDoc);

        let review = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,

          review: reviewObject.review,
          rating: reviewObject.rating,

          $createdAt: returnedDoc.$createdAt,
          $updatedAt: returnedDoc.$updatedAt,
        };

        let editedReviews = this.state.SearchedReviews;

        editedReviews.splice(this.state.reviewToEditIndex, 1, review);

        this.setState(
          {
            SearchedReviews: editedReviews,
            isLoadingReviewsSearch: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong with review edit:\n", e);
      })
      .finally(() => client.disconnect());
  };

  createReply = (replyObject) => {
    //console.log("Called Create Reply");

    this.setState({
      isLoadingYourReviews: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitReviewDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const replyProperties = {
        reviewId: this.state.replyReview.$id,
        reply: replyObject.reply,
      };
      //console.log('Reply to Create: ', replyProperties);

      // Create the note document
      const dgrDocument = await platform.documents.create(
        "DGRContract.dgrreply",
        identity,
        replyProperties
      );

      //############################################################
      //This below disconnects the document sending..***

      // return dgrDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [dgrDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgrDocument;
    };

    submitReviewDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Document:\n", returnedDoc);

        let reply = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          $createdAt: returnedDoc.$createdAt,

          reviewId: this.state.replyReview.$id,
          reply: replyObject.reply,
        };

        this.setState(
          {
            YourReplies: [reply, ...this.state.YourReplies],
            isLoadingYourReviews: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong with reply creation:\n", e);
      })
      .finally(() => client.disconnect());
  };

  editReply = (replyObject) => {
    console.log("Called Edit Reply");

    this.setState({
      isLoadingYourReviews: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitReplyDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const [document] = await client.platform.documents.get(
        "DGRContract.dgrreply",
        {
          where: [["$id", "==", this.state.replyToEdit.$id]],
        }
      );

      if (this.state.replyToEdit.reply !== replyObject.reply) {
        document.set("reply", replyObject.reply);
      }

      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;

      //############################################################
      //This below disconnects the document editing..***

      //return document;

      //This is to disconnect the Document editing***
      //############################################################
    };

    submitReplyDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Edited Reply Doc:\n", returnedDoc);

        let editedReply = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          $updatedAt: returnedDoc.$updatedAt,
          $createdAt: returnedDoc.$createdAt,

          reviewId: this.state.replyReview.$id,
          reply: replyObject.reply,
        };

        let indexOfReply = this.state.YourReplies.findIndex((reply) => {
          return reply.$id === editedReply.$id;
        });

        let editedReplies = this.state.YourReplies;

        editedReplies.splice(indexOfReply, 1, editedReply);

        this.setState(
          {
            YourReplies: editedReplies,
            isLoadingYourReviews: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong with reply creation:\n", e);
      })
      .finally(() => client.disconnect());
  };

  /*
  * REVIEWS FUNCTIONS^^^^
   *                                         ################
   *                                         ###          ####
   *                                         ################
   *                                         ###          ####
   *                                         ###           ####
   *
        ################
   *    ###          ###
   *    ################
   *    ###          
   *    ### 
   */

  //PROOF OF FUNDS FUNCTIONS

  handleTab_POD = (eventKey) => {
    if (eventKey === "Search")
      this.setState({
        whichTab_POD: "Search",
      });
    else {
      this.setState({
        whichTab_POD: "Your Proofs",
      });
    }
  };

  handleDeleteYourProof = (index) => {
    this.setState(
      {
        selectedYourProof: this.state.YourProofs[index],

        selectedYourProofIndex: index,
      },
      () => this.showModal("DeleteProofModal")
    );
  };

  // FORM Functions
  handleOnChangeValidation_POD = (event) => {
    this.setState({
      isError: false,
    });

    if (event.target.id === "validationCustomName") {
      this.nameValidate_POD(event.target.value);
    }
  };

  nameValidate_POD = (nameInput) => {
    let regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    let valid = regex.test(nameInput);

    if (valid) {
      this.setState({
        nameToSearch_POD: nameInput,
        nameFormat_POD: true,
      });
    } else {
      this.setState({
        nameToSearch_POD: nameInput,
        nameFormat_POD: false,
      });
    }
  };

  searchName_POD = () => {
    this.setState({
      isLoadingSearch_POD: true,
      SearchedNameDoc_POD: "",
      SearchedProofs: [],
    });

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const retrieveName = async () => {
      // Retrieve by full name (e.g., myname.dash)
      return client.platform.names.resolve(
        `${this.state.nameToSearch_POD}.dash`
      );
    };

    retrieveName()
      .then((d) => {
        if (d === null) {
          //console.log("No DPNS Document for this Name.");
          this.setState({
            SearchedNameDoc_POD: "No NameDoc", //Handle if name fails ->
            isLoadingSearch_POD: false,
          });
        } else {
          let nameDoc = d.toJSON();
          // console.log("Name retrieved:\n", nameDoc);

          this.searchForProofs(nameDoc.$ownerId);

          this.setState({
            SearchedNameDoc_POD: nameDoc,
          });
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingSearch_POD: false,
        });
      })
      .finally(() => client.disconnect());
  };
  // FORM Functions ^^^

  // Trigger -> this.getYourProofs(theIdentity);

  searchForProofs = (theIdentity) => {
    //console.log("Calling getSearchProofs");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("PODContract.podproof", {
        where: [
          ["$ownerId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no SearchProofs");

          this.setState({
            //SearchedProofs: [],
            isLoadingSearch_POD: false,
          });
        } else {
          let docArray = [];
          //console.log("Getting Search Proofs");

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Review:\n", returnedDoc);
            // returnedDoc.toId = Identifier.from( //NOT FOR POD PROOFS
            //   returnedDoc.toId,
            //   "base64"
            // ).toJSON();
            //console.log("newReview:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.setState({
            SearchedProofs: docArray,
            isLoadingSearch_POD: false,
          });
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  pullInitialTriggerPROOFS = () => {
    this.getYourProofs(this.state.identity);
    this.setState({
      InitialPullProofs: false,
    });
  };

  getYourProofs = (theIdentity) => {
    //console.log("Calling getYourProofs");

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("PODContract.podproof", {
        where: [
          ["$ownerId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no Your Proofs");

          this.setState({
            isLoadingYourProofs: false,
          });
        } else {
          let docArray = [];
          //console.log("GettingYour Proofs");
          for (const n of d) {
            // console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }

          this.setState({
            YourProofs: docArray,
            isLoadingYourProofs: false,
          });
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  //$$  $$   $$$  $$  $  $$  $$$  $$$  $$  $$

  createYourProof = (proofObject) => {
    // console.log("Called Create Proof");

    this.setState({
      isLoadingYourProofs: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const submitProofDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const proofProperties = {
        address: proofObject.address,
        message: proofObject.message,
        signature: proofObject.signature,
      };
      //console.log('Proof to Create: ', proofProperties);

      // Create the note document
      const podDocument = await platform.documents.create(
        "PODContract.podproof",
        identity,
        proofProperties
      );

      //############################################################
      //This below disconnects the document sending..***

      // return podDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [podDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return podDocument;
    };

    submitProofDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        //console.log("Document:\n", returnedDoc);

        let proof = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          $updatedAt: returnedDoc.$updatedAt,
          $createdAt: returnedDoc.$createdAt,

          address: proofObject.address,
          message: proofObject.message,
          signature: proofObject.signature,
        };

        this.setState(
          {
            YourProofs: [proof, ...this.state.YourProofs],
            isLoadingYourProofs: false,
          },
          () => this.loadIdentityCredits()
        );
      })
      .catch((e) => {
        console.error("Something went wrong with proof creation:\n", e);
        this.setState({
          isLoadingYourProofs: false,
        });
      })
      .finally(() => client.disconnect());
  };

  deleteYourProof = () => {
    //console.log("Called Delete Proof");

    this.setState({
      isLoadingYourProofs: true,
    });

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const deleteNoteDocument = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const documentId = this.state.selectedYourProof.$id;

      // Retrieve the existing document

      //JUST PUT IN THE DOCUMENT THAT i ALREADY HAVE... => Done
      // Wrong ^^^ Can not use because changed to JSON

      const [document] = await client.platform.documents.get(
        "PODContract.podproof",
        { where: [["$id", "==", documentId]] }
      );
      //const document = this.state.selectedYourProof;

      // Sign and submit the document delete transition
      await platform.documents.broadcast({ delete: [document] }, identity);
      return document;
    };

    deleteNoteDocument()
      .then((d) => {
        // console.log("Document deleted:\n", d.toJSON());

        let editedProofs = this.state.YourProofs;

        editedProofs.splice(this.state.selectedYourProofIndex, 1);

        this.setState({
          YourProofs: editedProofs,
          isLoadingYourProofs: false,
        });
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  /**
PROOF OF FUNDS FUNCTIONS^^^^
                                             ################
   *                                         ###          ###
   *                                         ################
   *                                         ###          
   *                                         ###           
   *
   *    ################
   *          ###
   *          ###
   *          ###
   *          ###
   */

  //TRANSFER FUNCTIONS

  verifyFrontendFeeAndNetworkAndSkipSync = () => {
    // RUN CompDidMount

    //ALREADY SET IN COMPONENT PROPS
    // whichNetwork: import.meta.env.VITE_NETWORK,

    if (this.state.whichNetwork !== "mainnet") {
      this.setState(
        {
          whichNetwork: "testnet",

          // skipSynchronizationBeforeHeight:
          //   this.state.skipSynchronizationBeforeHeightTESTNET,
        } //,() => this.getDSOEveryoneDocs()
      );
    } else {
      // this.getDSOEveryoneDocs();
    }

    // let regex = /^[0-9]{1,4}$|^10000$/;

    // let valid = regex.test(
    //   import.meta.env.VITE_FEE_AMOUNT_AS_PERCENT_OF_A_TOPUP
    // );

    // if (Number(import.meta.env.VITE_FEE_AMOUNT_AS_PERCENT_OF_A_TOPUP) === 0) {
    //   valid = false;
    // }

    // if (valid) {
    //   this.setState({
    //     FrontendFee: import.meta.env.VITE_FEE_AMOUNT_AS_PERCENT_OF_A_TOPUP,
    //     validFrontendFee: true,
    //   });
    // } else {
    //   this.setState({
    //     FrontendFee: 0,
    //     validFrontendFee: false,
    //   });
    // }
  };

  //https://github.com/dashpay/platform/blob/v1.0-dev/packages/js-dash-sdk/src/SDK/Client/Platform/methods/identities/creditTransfer.ts
  // see above ^^^
  // sendFrontendFee = () => {
  //   const recipientId = import.meta.env.VITE_IDENTITY_TO_RECEIVE_FEE; //.env input

  //   if (this.state.identity !== recipientId) {
  //     this.setState({
  //       isLoadingIdInfo: true, //wHAT DOES THIS DO? -> because does not control the identity state that is with identityInfo, controls account page ->

  //       isLoadingCreditTransfer: true,

  //       identityInfo: "", //bC THIS IS WHAT CONTROLS THE TOPUP CREDITS AND WILL THAT MESS WITH THE FUNCTION BELOW -> No
  //     });
  //     console.log(this.state.identityInfo.balance);

  //     const client = new Dash.Client(
  //       dapiClient(
  //         this.state.whichNetwork,
  //         this.state.mnemonic,
  //         this.state.skipSynchronizationBeforeHeight
  //       )
  //     );

  //     const identityCreditTransfer = async () => {
  //       //const identity = this.state.identityRaw; //YourIdentity

  //       let identity = "";
  //       if (this.state.identityRaw !== "") {
  //         identity = this.state.identityRaw;
  //       } else {
  //         identity = await platform.identities.get(this.state.identity);
  //       } // Your identity ID

  //       // const identityId = 'identity ID of the sender goes here';
  //       // const identity = await client.platform.identities.get(
  //       //   this.state.identity
  //       // );

  //       //add to state the variable : feeAmountBaseNumber = 10000000 and the subtract 1 from each time..
  //       // SUBTRACT IN THE STATE SET AFTER TRANSITION.

  //       //BUT WILL THE -1 CHANGE THE TRANSFER AMOUNT AFTER THE TOFIXED(0) SO THAT IT IS CHANGED IN THE STATE TRANSITION? I THINK YES..

  //       if (this.state.validFrontendFee && this.state.FrontendFee > 0) {
  //         const feeAmount = //100,000,000 duffs in a Dash * 1000 duffs to credits * .01 for % // Not .01 for % but .01 for TopUp(fixed amount) // actually, So TopUp and % are included in the calculation
  //           // 100,000,000 duffs in a dash * 1000 credits in a duff = 100,000,000,000
  //           // .01 topup is amt in dash -> 1,000,000,000
  //           // .01 change to % -> 10,000,000
  //           //
  //           // (NEW) -> feeAmt Change from 1 = 1% to 100 = 1.00%
  //           //
  //           (
  //             this.state.feeAmountBaseNumber *
  //             //import.meta.env.VITE_FEE_AMOUNT_AS_PERCENT_OF_A_TOPUP
  //             this.state.FrontendFee
  //           ) //1 <=
  //             .toFixed(0);

  //         console.log(feeAmount);

  //         // fee amount need to augment just a little.. I think it is using the logic just like the core so need to be different.
  //         //So like have a fee amount in state aand subtract 1 from it each time.. <= ****

  //         await client.platform.identities.creditTransfer(
  //           identity,
  //           //Identifier.from(this.state.identity),
  //           recipientId,
  //           //Number(feeAmount)
  //           feeAmount
  //         );
  //       } //End of If statement
  //       return client.platform.identities.get(this.state.identity);
  //     };

  //     identityCreditTransfer()
  //       .then((d) => {
  //         console.log(
  //           "Identity credit balance after credit transfer: ",
  //           d.balance
  //         );
  //         this.setState({
  //           identityInfo: d.toJSON(),
  //           identityRaw: d,
  //           isLoadingIdInfo: false,
  //           isLoadingCreditTransfer: false,
  //           feeAmountBaseNumber: this.state.feeAmountBaseNumber - 1,
  //         });

  //         //credit transfer
  //         // get the identity balance after whatever write function and then set the state.
  //       })
  //       .catch((e) => {
  //         console.error("Something went wrong:\n", e);
  //         this.setState({
  //           identityInfo: this.state.identityRaw.toJSON(), //Test <-
  //           isLoadingIdInfo: false,
  //           isLoadingCreditTransfer: false,
  //           feeAmountBaseNumber: this.state.feeAmountBaseNumber - 20,
  //         });
  //       })
  //       .finally(() => client.disconnect());
  //   } else {
  //     //end if of same ownerId and userId
  //     this.loadIdentityCredits();
  //     //just update credits
  //   }
  // };

  loadIdentityCredits = () => {
    console.log("Called loadIdentityCredits");

    this.setState({
      identityInfo: "",
    });

    const client = new Dash.Client(dapiClientNoWallet(this.state.whichNetwork));

    const retrieveIdentity = async () => {
      return client.platform.identities.get(this.state.identity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        //console.log("Identity retrieved:\n", d.toJSON());

        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  withdrawalCredits = () => {
    console.log("Called withdraw Credits");

    this.setState({
      identityInfo: "",
      isLoadingWallet: true,
      isLoadingIdInfo: true, //for account page
      //investigate some more
    });
    console.log(this.state.identityInfo.balance);

    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const withdrawCredits = async () => {
      //const identity = this.state.identityRaw; //YourIdentity

      // let identity = "";
      // if (this.state.identityRaw !== "") {
      //   identity = this.state.identityRaw;
      // } else {
      //   identity = await platform.identities.get(this.state.identity);
      // } // Your identity ID

      const identity = await client.platform.identities.get(
        this.state.identity
      );
      const toAddress = this.state.accountAddress; // Dash L1 address to receive the withdrawn credits
      const amount = 10000000000; //.1 Dash // Amount of credits to withdraw
      // .01 Dash =      1000 000 000

      await client.platform.identities.creditWithdrawal(
        identity,
        amount,
        toAddress,
        { signingKeyIndex: 2 }
      );

      // await client.platform.identities.creditTransfer(
      //   identity,
      //   //Identifier.from(this.state.identity),
      //   recipientId,
      //   //Number(feeAmount)
      //   feeAmount
      // );
      //return client.platform.identities.get(this.state.identity);
    };

    withdrawCredits()
      .then((d) => {
        console.log(
          "Identity credit balance after credit withdrawal: ",
          d.balance
        );
        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
          isLoadingIdInfo: false,
        });

        // get the identity balance after whatever write function and then set the state.
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          identityInfo: this.state.identityRaw.toJSON(),
          isLoadingIdInfo: false,
        });
      })
      .finally(() => client.disconnect());
  };

  disableIdentityMasterKey = () => {
    const client = new Dash.Client(
      dapiClient(
        this.state.whichNetwork,
        this.state.mnemonic,
        this.state.skipSynchronizationBeforeHeight
      )
    );

    const updateIdentityDisableKey = async () => {
      //const identityId = "an identity ID goes here";
      // const keyId = "a public key ID goes here"; // One of the identity's public key IDs

      // Retrieve the identity to be updated and the public key to disable
      const existingIdentity = await client.platform.identities.get(
        this.state.identity
      );
      //
      const publicKeyToDisable = existingIdentity.getPublicKeyById(1); //keyId

      //The current SDK version signs all state transitions with public key id 1. If it is disabled, the SDK will be unable to use the identity. Future SDK versions will provide a way to also sign using keys added in an identity update.

      const updateDisable = {
        disable: [publicKeyToDisable],
      };

      await client.platform.identities.update(existingIdentity, updateDisable);
      return client.platform.identities.get(this.state.identity);
    };

    updateIdentityDisableKey()
      .then((d) => {
        console.log("Identity disabled:\n", d.toJSON());
        //Then logout
        this.handleLogout();
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  render() {
    this.state.mode === "primary"
      ? (document.body.style.backgroundColor = "rgb(280,280,280)")
      : (document.body.style.backgroundColor = "rgb(20,20,20)");

    this.state.mode === "primary"
      ? (document.body.style.color = "black")
      : (document.body.style.color = "white");

    let isLoginComplete =
      this.state.uniqueName !== "" && this.state.uniqueName !== "no name";

    // let showWhyMoney = false;

    // if (
    //   import.meta.env.VITE_FRONTEND_NAME === "DashMoney" &&
    //   this.state.InitialWhyMoney
    // ) {
    //   showWhyMoney = true;
    // }

    return (
      <>
        <TopNav
          handleMode={this.handleMode}
          mode={this.state.mode}
          showModal={this.showModal}
          whichNetwork={this.state.whichNetwork}
          isLoggedIn={this.state.isLoggedIn}
          toggleTopNav={this.toggleTopNav}
          expandedTopNav={this.state.expandedTopNav}
          selectedDapp={this.state.selectedDapp}
          handleSelectedDapp={this.handleSelectedDapp}
          uniqueName={this.state.uniqueName}
          identityInfo={this.state.identityInfo}
          FrontendFee={this.state.FrontendFee}
          validFrontendFee={this.state.validFrontendFee}
        />
        <Image fluid="true" id="dash-bkgd" src={DashBkgd} alt="Dash Logo" />
        <Container className="g-0">
          <Row className="justify-content-md-center">
            <Col md={9} lg={8} xl={7} xxl={6}>
              {/* {this.state.selectedDapp === "Login" && showWhyMoney ? (
                <>
                  <WhyMoney handleSelectedDapp={this.handleSelectedDapp} />
                </>
              ) : (
                <></>
              )} */}
              {this.state.selectedDapp === "Login" ? (
                // && !showWhyMoney
                <>
                  {!this.state.isLoggedIn ? (
                    <>
                      <LoginForm
                        handleAccountLogin={this.handleAccountLogin}
                        DashMoneyLFKeys={this.state.DashMoneyLFKeys}
                        showModal={this.showModal}
                        mode={this.state.mode}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.state.isLoggedIn &&
                  !this.state.isIdentityControlShowing ? (
                    <>
                      <AccountLogin
                        isLoginComplete={isLoginComplete}
                        whichNetwork={this.state.whichNetwork}
                        mnemonic={this.state.mnemonic}
                        handleAccountRetry={this.handleAccountRetry}
                        showModal={this.showModal}
                        toggleTopNav={this.toggleTopNav}
                        isLoadingIdentity={this.state.isLoadingIdentity}
                        isLoadingIdInfo={this.state.isLoadingIdInfo}
                        isLoadingName={this.state.isLoadingName}
                        isLoadingAlias={this.state.isLoadingAlias}
                        isLoadingWallet={this.state.isLoadingWallet}
                        identity={this.state.identity}
                        identityRaw={this.state.identityRaw}
                        identityInfo={this.state.identityInfo}
                        uniqueName={this.state.uniqueName}
                        aliasList={this.state.aliasList}
                        accountBalance={this.state.accountBalance}
                        mode={this.state.mode}
                        showIdentityControlPage={this.showIdentityControlPage}
                        identityRegisterCount={this.state.identityRegisterCount}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {/* IDENTITY CONTROL PAGE */}
                  {this.state.isLoggedIn &&
                  this.state.isIdentityControlShowing ? (
                    <>
                      <IdentityControlPage
                        withdrawalCredits={this.withdrawalCredits}
                        disableIdentityMasterKey={this.disableIdentityMasterKey}
                        identity={this.state.identity}
                        identityRaw={this.state.identityRaw}
                        identityInfo={this.state.identityInfo}
                        mode={this.state.mode}
                        hideIdentityControlPage={this.hideIdentityControlPage}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
              {this.state.selectedDapp === "Proxy Accounts" ? (
                <>
                  <ProxyPage
                    isLoginComplete={isLoginComplete}
                    isLoadingProxy={this.state.isLoadingProxy}
                    identity={this.state.identity}
                    identityInfo={this.state.identityInfo}
                    uniqueName={this.state.uniqueName}
                    mode={this.state.mode}
                    showModal={this.showModal}
                    //InitialPullPROXY={this.state.InitialPullPROXY}
                    pullInitialTriggerPROXY={this.pullInitialTriggerPROXY}
                    ProxyController={this.state.ProxyController}
                    ProxyDocs={this.state.ProxyDocs}
                    ProxyIdentities={this.state.ProxyIdentities}
                    handleEditProxy={this.handleEditProxy}
                    handleDeleteProxy={this.handleDeleteProxy}
                  />
                </>
              ) : (
                <></>
              )}

              {this.state.selectedDapp === "2-Party Pay" ? (
                <>
                  <TwoPartyPage
                    isLoginComplete={isLoginComplete}
                    // isLoadingProxy={this.state.isLoadingProxy}
                    identity={this.state.identity}
                    identityInfo={this.state.identityInfo}
                    uniqueName={this.state.uniqueName}
                    mode={this.state.mode}
                    showModal={this.showModal}
                  />
                </>
              ) : (
                <></>
              )}

              {/* {this.state.selectedDapp === "Groups" ? (
                //SO THIS WILL BE A 2 PAGE SETUP INSTEAD OF ONE AND ITS NOT A BAD IDEA i SUPPOSE SO THAT WHEN YOU CLICK OFF ITS NOT LOST... ->
                <> */}
              {/* {this.state.isGroupShowing ? (
                    <>
                      <Group
                        //isGroupShowing: true,
                        uniqueName={this.state.uniqueName}
                        identityRaw={this.state.identityRaw}
                        isLoadingGroup={this.state.isLoadingGroup}
                        //IS THIS DOING ANYTHING?? -> msg submission and invite sending ->
                        isLoadingGroupInvite={this.state.isLoadingGroupInvite}
                        submitDGTmessage={this.submitDGTmessage}
                        GroupsMsgsToAdd={this.state.GroupsMsgsToAdd}
                        submitDGTinvite={this.submitDGTinvite}
                        showModal={this.showModal}
                        selectedGroup={this.state.selectedGroup}
                        whichNetwork={this.state.whichNetwork}
                        mode={this.state.mode}
                        hideGroupPage={this.hideGroupPage}
                        sentGroupInviteError={this.state.sentGroupInviteError}
                        sentGroupInviteSuccess={
                          this.state.sentGroupInviteSuccess
                        }
                        sendToNameInvite={this.state.sendToNameInvite}
                      />
                    </>
                  ) : (
                    <GroupsPage
                      isLoginComplete={isLoginComplete}
                      pullInitialTriggerGROUPS={this.pullInitialTriggerGROUPS}
                      InitialPullGROUPS={this.state.InitialPullGROUPS}
                      identityInfo={this.state.identityInfo}
                      uniqueName={this.state.uniqueName}
                      showModal={this.showModal}
                      identity={this.state.identity}
                      showGroupPage={this.showGroupPage}
                      handleSelectedJoinGroup={this.handleSelectedJoinGroup}
                      mode={this.state.mode}
                      isLoadingGroups={this.state.isLoadingGroups}
                      isLoadingGroup={this.state.isLoadingGroup}
                      isLoadingActiveGroups={this.state.isLoadingActiveGroups}
                      isLoadingGroupInvite={this.state.isLoadingGroupInvite}
                      dgtInvites={this.state.dgtInvites}
                      dgtInvitesNames={this.state.dgtInvitesNames}
                      dgtActiveGroups={this.state.dgtActiveGroups}
                      selectedGroup={this.state.selectedGroup} //Do these go here AND where is the modal that displays this?
                      isGroupShowing={this.state.isGroupShowing}
                      GroupsMsgsToAdd={this.state.GroupsMsgsToAdd} //handle in Group so not too difficult, just add together and use set for unique docId ->
                      sentGroupMsgError={this.state.sentGroupMsgError} //Thread to Group, all the below
                      sentGroupInviteError={this.state.sentGroupInviteError}
                      sentGroupInviteSuccess={this.state.sentGroupInviteSuccess}
                      sendToNameInvite={this.state.sendToNameInvite} //For invite
                    />
                  )}
                </>
              ) : (
                <></>
              )} */}

              {this.state.selectedDapp === "Wallet" ? (
                <>
                  <WalletPage
                    WALLET_Login7={this.state.WALLET_Login7} //This is for the enable pay to name control
                    isLoginComplete={isLoginComplete}
                    WALLET_whichTab={this.state.WALLET_whichTab}
                    handleTab_WALLET={this.handleTab_WALLET}
                    showModal={this.showModal}
                    WALLET_messageToSend={this.state.WALLET_messageToSend}
                    sendDashtoName={this.sendDashtoName_WALLET}
                    requestDashfromName={this.requestDashfromName_WALLET}
                    isModalShowing={this.state.isModalShowing}
                    presentModal={this.state.presentModal}
                    hideModal={this.hideModal}
                    closeTopNav={this.closeTopNav}
                    WALLET_sendFailure={this.state.WALLET_sendFailure}
                    WALLET_sendSuccess={this.state.WALLET_sendSuccess}
                    WALLET_sendMsgSuccess={this.state.WALLET_sendMsgSuccess}
                    WALLET_sendMsgFailure={this.state.WALLET_sendMsgFailure}
                    WALLET_sendPmtMsgSuccess={
                      this.state.WALLET_sendPmtMsgSuccess
                    }
                    WALLET_sendPmtMsgFailure={
                      this.state.WALLET_sendPmtMsgFailure
                    }
                    handleFailureAlert_WALLET={this.handleFailureAlert_WALLET}
                    handleSuccessAlert_WALLET={this.handleSuccessAlert_WALLET}
                    handleFailureMsgAlert_WALLET={
                      this.handleFailureMsgAlert_WALLET
                    }
                    handleFailurePmtMsgAlert_WALLET={
                      this.handleFailurePmtMsgAlert_WALLET
                    }
                    handleSuccessPmtMsgAlert_WALLET={
                      this.handleSuccessPmtMsgAlert_WALLET
                    }
                    WALLET_amountToSend={this.state.WALLET_amountToSend}
                    WALLET_sendToName={this.state.WALLET_sendToName}
                    WALLET_requestPmtNameDoc={
                      this.state.WALLET_requestPmtNameDoc
                    }
                    WALLET_sendToAddress={this.state.WALLET_sendToAddress}
                    mnemonic={this.state.mnemonic}
                    whichNetwork={this.state.whichNetwork}
                    skipSynchronizationBeforeHeight={
                      this.state.skipSynchronizationBeforeHeight
                    }
                    dgmDocuments={this.state.dgmDocuments}
                    isLoadingRefresh_WALLET={this.state.isLoadingRefresh_WALLET}
                    isLoadingButtons_WALLET={this.state.isLoadingButtons_WALLET}
                    isLoadingWallet={this.state.isLoadingWallet}
                    isLoadingForm_WALLET={this.state.isLoadingForm_WALLET}
                    mode={this.state.mode}
                    accountBalance={this.state.accountBalance}
                    accountHistory={this.state.accountHistory} //ADD THIS TO THE LOGIN PROCESS =>
                    accountAddress={this.state.accountAddress} //ADD THIS TO THE LOGIN PROCESS =>
                    identity={this.state.identity}
                    identityInfo={this.state.identityInfo}
                    uniqueName={this.state.uniqueName}
                    showConfirmModal={this.showConfirmModal_WALLET}
                    showRequestModal={this.showRequestModal_WALLET}
                    showAddrConfirmModal={this.showAddrConfirmModal_WALLET}
                    showPayRequestModal={this.showPayRequestModal_WALLET}
                    showRejectReplyReqModal={
                      this.showRejectReplyReqModal_WALLET
                    }
                    handleThread_WALLET={this.handleThread_WALLET}
                    WALLET_ByYouMsgs={this.state.WALLET_ByYouMsgs}
                    WALLET_ByYouNames={this.state.WALLET_ByYouNames}
                    WALLET_ByYouThreads={this.state.WALLET_ByYouThreads}
                    WALLET_ToYouMsgs={this.state.WALLET_ToYouMsgs}
                    WALLET_ToYouNames={this.state.WALLET_ToYouNames}
                    WALLET_ToYouThreads={this.state.WALLET_ToYouThreads}
                    isLoadingMsgs_WALLET={this.state.isLoadingMsgs_WALLET}
                    handleRefresh_WALLET={this.handleRefresh_WALLET}
                    whichPayType={this.state.WALLET_whichPayType}
                    triggerRequestButton={this.triggerRequestButton}
                    triggerPayButton={this.triggerPayButton}
                  />
                </>
              ) : (
                <></>
              )}

              {/* Add  Dapp here */}
              {/* <h1 style={{ paddingTop: "1rem", textAlign: "center" }}>
                    Still Constructing
                  </h1> */}

              {this.state.selectedDapp === "Reviews" ? (
                <>
                  <ReviewsPage
                    isLoginComplete={isLoginComplete}
                    InitialPullReviews={this.state.InitialPullReviews}
                    pullInitialTriggerREVIEWS={this.pullInitialTriggerREVIEWS}
                    whichReviewsTab={this.state.whichReviewsTab}
                    handleReviewsTab={this.handleReviewsTab}
                    identityInfo={this.state.identityInfo}
                    uniqueName={this.state.uniqueName}
                    showModal={this.showModal}
                    mode={this.state.mode}
                    nameToSearch={this.state.nameToSearch}
                    nameFormat={this.state.nameFormat}
                    SearchedNameDoc={this.state.SearchedNameDoc}
                    searchName={this.searchName_REVIEW}
                    handleReviewsOnChangeValidation={
                      this.handleReviewsOnChangeValidation
                    }
                    SearchedReviews={this.state.SearchedReviews}
                    isLoadingReviewsSearch={this.state.isLoadingReviewsSearch}
                    identity={this.state.identity}
                    handleEditReview={this.handleEditReview}
                    SearchedReviewNames={this.state.SearchedReviewNames}
                    SearchedReplies={this.state.SearchedReplies}
                    YourReviews={this.state.YourReviews}
                    YourReviewNames={this.state.YourReviewNames}
                    YourReplies={this.state.YourReplies}
                    handleYourReply={this.handleYourReply}
                    isLoadingYourReviews={this.state.isLoadingYourReviews}
                  />
                </>
              ) : (
                <></>
              )}

              {this.state.selectedDapp === "Proof of Funds" ? (
                <>
                  <ProofsPage
                    isLoginComplete={isLoginComplete}
                    InitialPullProofs={this.state.InitialPullProofs}
                    pullInitialTriggerPROOFS={this.pullInitialTriggerPROOFS}
                    identityInfo={this.state.identityInfo}
                    uniqueName={this.state.uniqueName}
                    showModal={this.showModal}
                    mode={this.state.mode}
                    identity={this.state.identity}
                    isLoadingSearch_POD={this.state.isLoadingSearch_POD}
                    isLoadingYourProofs={this.state.isLoadingYourProofs}
                    whichTab_POD={this.state.whichTab_POD}
                    handleTab_POD={this.handleTab_POD}
                    nameToSearch_POD={this.state.nameToSearch_POD}
                    nameFormat_POD={this.state.nameFormat_POD}
                    SearchedNameDoc_POD={this.state.SearchedNameDoc_POD}
                    searchName_POD={this.searchName_POD}
                    handleOnChangeValidation_POD={
                      this.handleOnChangeValidation_POD
                    }
                    SearchedProofs={this.state.SearchedProofs}
                    YourProofs={this.state.YourProofs}
                    handleDeleteYourProof={this.handleDeleteYourProof}
                  />
                </>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Container>
        {/* #####    BELOW ARE THE MODALS    #####    */}
        {this.state.isModalShowing &&
        this.state.presentModal === "LogoutModal" ? (
          <LogoutModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLogout={this.handleLogout}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "CreateNewWalletModal" ? (
          <CreateNewWalletModal
            isModalShowing={this.state.isModalShowing}
            whichNetwork={this.state.whichNetwork}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "SendFundsModal" ? (
          <SendFundsModal
            isModalShowing={this.state.isModalShowing}
            accountAddress={this.state.accountAddress}
            whichNetwork={this.state.whichNetwork}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "NameWalletExplaination" ? (
          <NameWalletExplaination
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            showModal={this.state.showModal}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "RegisterIdentityModal" ? (
          <RegisterIdentityModal
            isModalShowing={this.state.isModalShowing}
            registerIdentity={this.registerIdentity}
            hideModal={this.hideModal}
            mode={this.state.mode}
            skipSynchronizationBeforeHeight={
              this.state.skipSynchronizationBeforeHeight
            }
            whichNetwork={this.state.whichNetwork}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "TopUpIdentityModal" ? (
          <TopUpIdentityModal
            accountBalance={this.state.accountBalance}
            isLoadingWallet={this.state.isLoadingWallet}
            isModalShowing={this.state.isModalShowing}
            whichNetwork={this.state.whichNetwork}
            hideModal={this.hideModal}
            mode={this.state.mode}
            doTopUpIdentity={this.doTopUpIdentity}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "RegisterNameModal" ? (
          <RegisterNameModal
            triggerNameLoading={this.triggerNameLoading}
            triggerNameNotLoading={this.triggerNameNotLoading}
            handleName={this.handleName}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            identity={this.state.identity}
            identityRaw={this.state.identityRaw}
            mnemonic={this.state.mnemonic}
            whichNetwork={this.state.whichNetwork}
            skipSynchronizationBeforeHeight={
              this.state.skipSynchronizationBeforeHeight
            }
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {/*     ################
         *      ###          ####
         *      ################
         *      ###
         *      ###            */}

        {this.state.isModalShowing &&
        this.state.presentModal === "AddProxyModal" ? (
          <AddProxyModal
            identity={this.state.identity}
            mode={this.state.mode}
            addProxyToController={this.addProxyToController}
            ProxyController={this.state.ProxyController}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "EditProxyModal" ? (
          <EditProxyModal
            identity={this.state.identity}
            mode={this.state.mode}
            editProxyController={this.editProxyController}
            selectedProxyTuple={this.state.selectedProxyTuple}
            selectedProxyTupleIndex={this.state.selectedProxyTupleIndex}
            ProxyController={this.state.ProxyController}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "DeleteProxyModal" ? (
          <DeleteProxyModal
            selectedProxyTuple={this.state.selectedProxyTuple}
            removeProxyFromController={this.removeProxyFromController}
            ProxyDocs={this.state.ProxyDocs}
            uniqueName={this.state.uniqueName}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}
        {/* 

*      #############
*     ####        ###
*     ###
*     ###     ########
*     #####      ####
*      ############# */}
        {this.state.isModalShowing &&
        this.state.presentModal === "CreateGroupModal" ? (
          <CreateGroupModal
            submitCreateGroup={this.submitCreateGroup}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "DeleteGroupModal" ? (
          <DeleteGroupModal
            selectedGroup={this.state.selectedGroup}
            deleteGroup={this.deleteGroup}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "JoinGroupModal" ? (
          <JoinGroupModal
            submitCreateGroup={this.submitCreateGroup}
            whichNetwork={this.state.whichNetwork}
            selectedGroup={this.state.selectedGroup}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}
        {/* ##      ###    ###
         *   ###    ####   ##
         *    ###  ## ## ###
         *     ## ##  ####
         *      ###   ### */}
        {this.state.isModalShowing &&
        this.state.presentModal === "ConfirmAddrPaymentModal" ? (
          <ConfirmAddrPaymentModal
            whichNetwork={this.state.whichNetwork}
            sendToAddress={this.state.WALLET_sendToAddress}
            amountToSend={this.state.WALLET_amountToSend}
            sendDashtoAddress={this.sendDashtoAddress_WALLET}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "RegisterDGMModal" ? (
          <RegisterDGMModal
            RegisterDGMAddress={this.RegisterDGMAddress_WALLET}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "ThreadModal_WALLET" ? (
          <ThreadModal_WALLET
            uniqueName={this.state.uniqueName}
            submitDGMThread={this.submitDGMThread_WALLET}
            messageToWhomName={this.state.WALLET_messageToWhomName}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "PayRequestModal" ? (
          <PayRequestModal
            sendToName={this.state.WALLET_sendToName}
            requestPmtNameDoc={this.state.WALLET_requestPmtNameDoc}
            //This is used to search for DGM address
            amountToSend={this.state.WALLET_amountToSend}
            //messageToSend={this.state.WALLET_messageToSend}

            whichNetwork={this.state.whichNetwork}
            //sendDashtoName={this.state.sendDashtoName}
            payDashtoRequest={this.payDashtoRequest_WALLET}
            //requestDashfromName={this.state.requestDashfromName}
            //handleClearModalPostPmtConfirm={this.handleClearModalPostPmtConfirm}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "RejectReqModal" ? (
          <RejectReqModal
            uniqueName={this.state.uniqueName}
            sendToName={this.state.WALLET_sendToName}
            requestPmtNameDoc={this.state.WALLET_requestPmtNameDoc}
            amountToSend={this.state.WALLET_amountToSend}
            //submitDGMThread={this.submitDGMThread_WALLET}
            rejectOrReplyRequestThread={this.rejectOrReplyRequestThread_WALLET}
            messageToWhomName={this.state.WALLET_messageToWhomName}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "WalletTXModal" ? (
          <WalletTXModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            accountHistory={this.state.accountHistory}
            accountBalance={this.state.accountBalance}
            WALLET_addresses={this.state.WALLET_addresses}
            WALLET_addressesNames={this.state.WALLET_addressesNames}
            ByYouMsgs={this.state.WALLET_ByYouMsgs}
            ByYouNames={this.state.WALLET_ByYouNames}
            ToYouMsgs={this.state.WALLET_ToYouMsgs}
            ToYouNames={this.state.WALLET_ToYouNames}
            //My Store
            LoadingOrders={this.state.isLoadingOrdersYOURSTORE}
            DGPOrders={this.state.DGPOrders}
            DGPOrdersNames={this.state.DGPOrdersNames}
            //My Store^^
            isLoadingAddresses_WALLET={this.state.isLoadingAddresses_WALLET}
            isLoadingMsgs={this.state.isLoadingMsgs_WALLET}
            //MyStore and Shopping use TXId to connect name to Tx but does the address pull already accomplish this for shopping <= yes
            //Shopping
            /*
              isLoadingRecentOrders: true,
              recentOrders: [],
              recentOrdersStores: [],
              recentOrdersNames: [],
              recentOrdersDGMAddresses: [],
              recentOrdersItems: [],
              recentOrdersMessages: [],
             */
            //Shopping^^
            //sortedTuples={sortedTuples} // <= this is made in the WalletTXModal -> yes
            // So this should only be gotten too after wallet and msgs are loaded.. ->
          />
        ) : (
          <></>
        )}

        {/* *   ################
         *      ###          ####
         *      ################
         *      ###          ####
         *      ###           #### */}
        {this.state.isModalShowing &&
        this.state.presentModal === "CreateReviewModal" ? (
          <CreateReviewModal
            isModalShowing={this.state.isModalShowing}
            createReview={this.createReview}
            SearchedNameDoc={this.state.SearchedNameDoc}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "EditReviewModal" ? (
          <EditReviewModal
            reviewToEdit={this.state.reviewToEdit}
            SearchedNameDoc={this.state.SearchedNameDoc}
            editReview={this.editReview}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "CreateReplyModal" ? (
          <CreateReplyModal
            replyReview={this.state.replyReview}
            replyingToName={this.state.replyingToName}
            createReply={this.createReply}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "EditReplyModal" ? (
          <EditReplyModal
            replyReview={this.state.replyReview}
            replyToEdit={this.state.replyToEdit}
            replyingToName={this.state.replyingToName}
            editReply={this.editReply}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {/*  ################
         *   ###          ###
         *   ################
         *   ###
         *   ###
         */}
        {this.state.isModalShowing &&
        this.state.presentModal === "CreateProofModal" ? (
          <CreateProofModal
            isModalShowing={this.state.isModalShowing}
            createYourProof={this.createYourProof}
            whichNetwork={this.state.whichNetwork}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        {this.state.isModalShowing &&
        this.state.presentModal === "DeleteProofModal" ? (
          <DeleteProofModal
            selectedYourProof={this.state.selectedYourProof}
            uniqueName={this.state.uniqueName}
            deleteYourProof={this.deleteYourProof}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default App;
