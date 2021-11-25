import { Contract, ethers } from "ethers";
import { watchFile } from "fs";
import React, { useEffect, useState } from "react";
import { getWei } from "src/helpers/ethers";
import Button from "./Button";

const ContractComponent = ({
  eventsContract,
  signer,
  setIsFetching,
}: {
  signer: any;
  eventsContract: Contract;
  setIsFetching: (isFetching: boolean) => void;
}) => {
  const [trasactionHash, setTransactionHash] = useState<string>();
  const [error, setError] = useState<string>();

  const [numberOfTickets, setNumberOfTickets] = useState<number>(0);
  const [priceInEth, setPriceInEth] = useState<number>(0);

  const [message, setMessage] = useState<string>("");

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {trasactionHash && <p>Last transaction hash {trasactionHash}</p>}
      <input
        placeholder="Number of ticekts:"
        type="number"
        value={numberOfTickets}
        onChange={(e) => setNumberOfTickets(e.currentTarget.valueAsNumber)}
      />
      <input
        placeholder="Price in ETH:"
        type="number"
        value={priceInEth}
        onChange={(e) => setPriceInEth(e.currentTarget.valueAsNumber)}
      />
      <Button
        onClick={async () => {
          setIsFetching(true);
          const transaction = await eventsContract.createEvent(
            numberOfTickets,
            getWei(priceInEth)
          );
          setTransactionHash(transaction.hash);

          const transactionReceipt = await transaction.wait();

          if (transactionReceipt.status !== 1) {
            setError(JSON.stringify(transactionReceipt));
          }

          setIsFetching(false);
        }}
      >
        Create event
      </Button>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />
      <Button
        onClick={async () => {
          const signature = await signer.signMessage(message);
          console.log(ethers.utils.splitSignature(signature));
        }}
      >
        Sign message
      </Button>
    </>
  );
  // const currentLeader = async () => {
  //   const currentLeader = await electionContract.currentLeader();
  //   setLeader(currentLeader);
  // };

  // const submitStateResults = async () => {
  //   const dataArr = ["Texas", 534, 531, 56];

  //   setIsFetching(true);

  //   const transaction = await electionContract.submitStateResult(dataArr);

  //   setTransactionHash(transaction.hash);

  //   const transactionReceipt = await transaction.wait();
  //   if (transactionReceipt.status !== 1) {
  //     setError(JSON.stringify(transactionReceipt));
  //   } else {
  //     setIsFetching(false);
  //   }
  // };

  // return (
  //   <>
  //     {error && <p style={{ color: "red" }}>{error}</p>}
  //     {trasactionHash && <p>Last transaction hash {trasactionHash}</p>}
  //     <Button onClick={submitStateResults}>Submit state results</Button>
  //     <Button onClick={currentLeader}>Show leader</Button>
  //     {leader && <p>{leader}</p>}
  //   </>
  // );

  return null;
};

export default ContractComponent;
