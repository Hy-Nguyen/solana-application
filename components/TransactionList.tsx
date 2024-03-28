"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function HoldingsList() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState(0);

  async function getTransactions(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
  }
  let bal;
  async function fetchBalance() {
    bal = await connection.getBalance(publicKey);
    setBalance(bal / LAMPORTS_PER_SOL);
  }
  fetchBalance();

  return (
    <>
      <Card className="w-1/2">
        <CardHeader className="w-full">
          Your Wallet At A Glance
        </CardHeader>

        <CardBody className="flex items-center">
          <div className="">Balance: {bal}</div>
          <div className="">Tokens</div>
        </CardBody>
      </Card>
    </>
  );
}
