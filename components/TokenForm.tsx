"use client";
import {
  Button,
  Card,
  CardHeader,
} from "@nextui-org/react";

import {
  useConnection,
  useWallet,
  useAnchorWallet,
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
  Transaction,
} from "@solana/web3.js";

import {
  createMintTransaction,
  createAssociatedTokenAccountTransaction,
  mintToAssocTokenAccount,
} from "@/codePractice/mintingToken";

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
  const {
    publicKey,
    sendTransaction,
    signTransaction,
  } = useWallet();

  {
    /**
      Steps to Mint Tokens
      - Create Mint
      - Create Associated Token Account tied to orignal wallet and mint
      - Mint tokens

      States:
      - Creating Mint States
        - mintAcctKP - Mint Account Key Pair 
        - decimals - Number of Decimals for Mint
        - mintSignature - Transaction Number for Creating Mint

      - Creating Associated Token Account States
        - associatedActPublic - Associated Account Public Key
        - associateAcctSign - Transaction Number for Creating Associated Token Account

      - Mint To States
       - tokenAmount - Amount of tokens to mint
       - mintToAssocTransactionID - Transaction Number for Minting to Associated Token Account
  */
  }
  // Creating Mint
  const [mintAccKP, setMintAccKP] =
    useState<Keypair>();
  const [decimals, setDecimals] =
    useState<Number>();
  const [mintSignature, setMintSignature] =
    useState<String>();

  // Creating Associated Token Account
  const [
    associatedActPublic,
    setAssociatedActPublic,
  ] = useState<PublicKey>();
  const [
    associateAcctSign,
    setSssociateAcctSign,
  ] = useState<String>();

  // Minting to Associated Token Account
  const [tokenAmount, setTokenAmount] =
    useState<Number>();
  const [
    mintToAssocTransactionID,
    setMintToAssocTransactionID,
  ] = useState<String>();

  // Mint Handler
  async function mintHandler() {
    // Create Mint
    try {
      const { mintTransaction, mintAccountKP } =
        await createMintTransaction(
          publicKey,
          decimals,
          connection
        );

      console.log(mintTransaction);

      console.log(
        mintAccountKP.publicKey.toString()
      );

      console.log("checkpoint1");

      setMintAccKP(mintAccountKP);

      let mintSign = await sendTransaction(
        mintTransaction,
        connection,
        { signers: [mintAccountKP] }
      );

      setMintSignature(mintSign);

      console.log(
        `https://explorer.solana.com/tx/${mintSign}?cluster=devnet`
      );
    } catch (error) {
      console.log(error);
    }

    // Create Associated Token Account
    try {
      
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <Button onClick={mintHandler}>
          Mint
        </Button>
      </CardHeader>
    </Card>
  );
}
