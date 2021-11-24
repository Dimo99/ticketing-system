import { Contract } from "ethers";
import React, { useState } from "react";
import Button from "./Button";

const ContractComponent = ({
  eventsContract,
  setIsFetching,
}: {
  eventsContract: Contract;
  setIsFetching: (isFetching: boolean) => void;
}) => {
  if (!eventsContract) {
    return null;
  }
  const [leader, setLeader] = useState<string>();
  const [trasactionHash, setTransactionHash] = useState<string>();
  // const currentLeader = async () => {
  //   const currentLeader = await electionContract.currentLeader();
  //   setLeader(currentLeader);
  // };
  // const [error, setError] = useState<string>();

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
