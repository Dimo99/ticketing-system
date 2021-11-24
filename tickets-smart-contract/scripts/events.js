const { randomBytes } = require("crypto");
const { ethers } = require("ethers");
const Events = require("../artifacts/contracts/events.sol/Events.json");

const run = async function () {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );

  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  const contractAddress = "0x5D42EBdBBa61412295D7b0302d6F50aC449Ddb4F";
  const eventsContract = new ethers.Contract(
    contractAddress,
    Events.abi,
    wallet
  );

  // eventsContract.on("EventCreated", (eventId) =>
  //   console.log(eventId.toString())
  // );

  // eventsContract.on("Transfer", (from, to, tokenId) =>
  //   console.log(from, to, tokenId.toString())
  // );

  // const eventCreationTransaction = await eventsContract.createEvent(
  //   ethers.BigNumber.from("1090"),
  //   ethers.BigNumber.from("20000000000000000")
  // );

  // eventCreationTransaction.wait();

  // const transaction = await eventsContract.buyTicket(2, {
  //   value: ethers.BigNumber.from("20000000000000000"),
  // });

  // console.log("Waiting transaction...");
  // const result = await transaction.wait();
  // console.log("over");

  // const eventResult = await eventsContract.events(2);

  // console.log(
  //   eventResult.availableTickets.toString(),
  //   eventResult.fundsCollected.toString()
  // );

  // console.log("Balance", (await wallet.getBalance()).toString());

  // const transaction = await eventsContract.withdrawFunds();

  // await transaction.wait();

  // console.log("Balance", (await wallet.getBalance()).toString());

  // const eventResult1 = await eventsContract.events(3);

  // console.log(
  //   eventResult1.availableTickets.toString(),
  //   eventResult1.fundsCollected.toString()
  // );
  const randomString = "ай докажи са";

  console.log(randomString.length);

  const signature = await wallet.signMessage(randomString);

  const { v, r, s } = ethers.utils.splitSignature(signature);

  const address = ethers.utils.verifyMessage(randomString, { v, r, s });

  console.log(address);
  console.log(wallet.address);

  const verifyTicketOwner = await eventsContract.verifyTicketOwner(
    11,
    randomString,
    v,
    r,
    s
  );

  console.log(verifyTicketOwner);
};

run();
