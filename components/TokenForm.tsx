"use client";
import {
  Card,
  CardHeader,
} from "@nextui-org/react";

import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,

} from "@solana/spl-token";

import {
  Connection,
  Keypair,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";

import { useState } from "react";
{
  /**
steps to hold token w/ existing account
	1.	Create Mint
	2.	Create Associated Token Account tied to orignal wallet and mint
	3.	Mint tokens 
*/
}
export default function TokenForm() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [mint, setMint] = 
    useState<PublicKey>();
  const [tokenAccount, setTokenAccount] =
    useState<PublicKey>();
  const [decimals, setDecimals] =
    useState<Number>();
  const [mintAmount, setMintAmount] =
    useState<Number>();

    async function createMint() {
        let payer = new Keypair(publicKey);
        let tokenMint = await createMint{
            connection, 
            (Keypair(publicKey)),


        }
    }
  return (
    <Card>
      <CardHeader>
        <h1>Hi</h1>
      </CardHeader>
    </Card>
  );
}
