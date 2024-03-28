"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Link,
} from "@nextui-org/react";

import { CheckCircleIcon } from "@heroicons/react/24/outline";

import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import {
  Keypair,
  PublicKey,
} from "@solana/web3.js";

import {
  createMintTransaction,
  createAssociatedTokenAccountTransaction,
  mintToAssocTokenAccount,
} from "@/functionTesting/mintingToken";

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
  const { publicKey, sendTransaction } =
    useWallet();

  // Modal Dependencies/States
  const { isOpen, onOpen, onOpenChange } =
    useDisclosure();

  const [
    createMintLoading,
    setCreateMintLoading,
  ] = useState(true);

  const [solToSend, setSolToSend] = useState(0);
  const [
    createTokenAccountLoading,
    setCreateTokenAccountLoading,
  ] = useState(true);
  const [mintToLoading, setmintToLoading] =
    useState(true);

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
    useState<number>(6);
  const [mintSignature, setMintSignature] =
    useState<String>();

  // Creating Associated Token Account
  const [
    associatedActPublic,
    setAssociatedActPublic,
  ] = useState<PublicKey>();
  const [
    associateAcctSign,
    setAssociateAcctSign,
  ] = useState<String>();

  // Minting to Associated Token Account
  const [tokenAmount, setTokenAmount] =
    useState<number>(1);
  const [
    mintToAssocTransactionID,
    setMintToAssocTransactionID,
  ] = useState<String>();

  async function handleSubmit(
    e: React.FormEventHandler<HTMLFormElement>
  ) {
    e.preventDefault();
    onOpen();
    await mintHandler();
    if (mintToLoading) {
      alert("Minting Complete!");
    } else {
      alert(
        "We ran into some problems. Please try again."
      );
    }
  }

  // Mint Handler
  async function mintHandler() {
    let mintAccountPublicKey;
    // Create Mint
    try {
      const { mintTransaction, mintAccountKP } =
        await createMintTransaction(
          publicKey,
          decimals,
          connection
        );

      mintAccountPublicKey =
        mintAccountKP.publicKey;
      setMintAccKP(mintAccountKP);

      let mintSign = await sendTransaction(
        mintTransaction,
        connection,
        { signers: [mintAccountKP] }
      );

      setMintSignature(mintSign);

      // Change Loading State
      setCreateMintLoading(!createMintLoading);
    } catch (error) {
      console.log(error);
    }

    // Create Associated Token Account
    let associatedTokenPK;
    try {
      const {
        createAccountTransaction,
        associatedTokenAddress,
      } =
        await createAssociatedTokenAccountTransaction(
          mintAccountPublicKey,
          publicKey
        );
      associatedTokenPK = associatedTokenAddress;
      setAssociatedActPublic(
        associatedTokenAddress
      );

      let createAccountTransactionSignature;

      createAccountTransactionSignature =
        await sendTransaction(
          createAccountTransaction,
          connection
        );

      setAssociateAcctSign(
        createAccountTransactionSignature
      );

      // Change Loading State
      setCreateTokenAccountLoading(
        !createTokenAccountLoading
      );
    } catch (e) {
      console.log(`Error: ${e}`);
    }

    // Minting to Associated Token Account

    try {
      const mintingTransaction =
        await mintToAssocTokenAccount(
          mintAccountPublicKey,
          associatedTokenPK,
          publicKey,
          tokenAmount * Math.pow(10, decimals)
        );

      try {
        let mintingTransactionSignature =
          await sendTransaction(
            mintingTransaction,
            connection
          );

        setMintToAssocTransactionID(
          mintingTransactionSignature
        );

        // Change Loading State
        setmintToLoading(!mintToLoading);
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }

  return (
    <>
      <Card
        className="w-1/2"
        onSubmit={handleSubmit}
      >
        <CardHeader className="flex justify-center">
          <h1 className="text-xl">
            Create Tokens
          </h1>
        </CardHeader>
        <CardBody>
          <form
            action=""
            className="w-full flex flex-col items-center"
            // onSubmit={sendSol}
            id="token-form"
          >
            {/* User Inputs */}
            <div className="flex w-11/12 space-x-3">
              <Input
                type="number  "
                label="Initial Token Supply"
                labelPlacement="outside"
                value={tokenAmount}
                onChange={(e) =>
                  setTokenAmount(
                    Number(e.target.value)
                  )
                }
                className="w-3/4 py-2"
                variant="bordered"
                // onChange={recepientHandler}
                // isInvalid={addressCheck}
                isRequired
                // errorMessage={
                //   addressCheck && errorMessage
                // }
              />
              <Input
                type="number"
                label="Decimals"
                labelPlacement="outside"
                className="w-1/4 py-2"
                variant="bordered"
                value={decimals}
                onChange={(e) =>
                  setDecimals(
                    Number(e.target.value)
                  )
                }
                step={1}
                isRequired
              />
            </div>
            <Button
              className="w-1/3 mt-4 bg-purple-200 text-black"
              type="submit"
            >
              create!
            </Button>
          </form>
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="dark"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
                {mintToLoading
                  ? "Minting Token in Progress"
                  : "Tokens Minted!"}
              </ModalHeader>
              <ModalBody className="space-y-3">
                <div className=" flex flex-row items-center justify-between">
                  {createMintLoading ? (
                    <>
                      <div className=" flex flex-row items-center justify-between w-full">
                        <h1 className="text-lg">
                          Creating Mint
                        </h1>
                        <Spinner
                          color="success"
                          size="md"
                          className=""
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className=" flex flex-col items-center justify-between w-full space-y-3">
                        <div className="flex flex-row items-center justify-between w-full">
                          <h1 className="text-lg">
                            Mint Created!
                          </h1>
                          <CheckCircleIcon className="w-10 h-10 text-green-400" />
                        </div>
                        <div className=" flex items-center w-11/12 ">
                          Find Mint Account{" "}
                          <Link
                            isBlock
                            showAnchorIcon
                            isExternal
                            href={`https://explorer.solana.com/address/${mintAccKP?.publicKey.toString()}?cluster=devnet`}
                            color="success"
                          >
                            Here
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className=" flex flex-row items-center justify-between">
                  {createTokenAccountLoading ? (
                    <>
                      <div className=" flex flex-row items-center justify-between w-full">
                        <h1 className="text-lg">
                          Finding an Associated
                          Token Account
                        </h1>
                        <Spinner
                          color="success"
                          size="md"
                          className=""
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className=" flex flex-col items-center justify-between w-full space-y-3">
                        <div className="flex flex-row items-center justify-between w-full">
                          <h1 className="text-lg">
                            Token Account Found!
                          </h1>
                          <CheckCircleIcon className="w-10 h-10 text-green-400" />
                        </div>
                        <div className=" flex items-center w-11/12 ">
                          Find Token Acount{" "}
                          <Link
                            isBlock
                            showAnchorIcon
                            isExternal
                            href={`https://explorer.solana.com/address/${associatedActPublic?.toString()}?cluster=devnet`}
                            color="success"
                          >
                            Here
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className=" flex flex-row items-center justify-between">
                  {mintToLoading ? (
                    <>
                      <div className=" flex flex-row items-center justify-between w-full">
                        <h1 className="text-lg">
                          Minting Tokens to
                          Account
                        </h1>
                        <Spinner
                          color="success"
                          size="md"
                          className=""
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className=" flex flex-col items-center justify-between w-full space-y-3">
                        <div className="flex flex-row items-center justify-between w-full">
                          <h1 className="text-lg">
                            Tokens Minted!
                          </h1>
                          <CheckCircleIcon className="w-10 h-10 text-green-400" />
                        </div>
                        <div className=" flex items-center w-11/12 ">
                          Check Token Holdings{" "}
                          <Link
                            isBlock
                            showAnchorIcon
                            isExternal
                            href={`https://explorer.solana.com/address/${publicKey?.toString()}/tokens?cluster=devnet`}
                            color="success"
                          >
                            Here
                          </Link>
                        </div>
                        <div className=" flex items-center w-11/12 ">
                          Inspect Transaction{" "}
                          <Link
                            isBlock
                            showAnchorIcon
                            isExternal
                            href={`https://explorer.solana.com/tx/${mintToAssocTransactionID}?cluster=devnet`}
                            color="success"
                          >
                            Here
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-center">
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
