"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link,
} from "@nextui-org/react";

import bs58 from "bs58";

import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import { useEffect, useState } from "react";

import {
  LAMPORTS_PER_SOL,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

export default function TransactionForm() {
  // States
  {
    /*
    balance - Stores user's current balance
    recepient - Stores form input
    solToSend - Stores form input
    transaction - whether or not a transaction has been sent
    transactionError - Stores the signature of the transaction to pass to URL
    isLoading - Whether or not a transaction is being sent (Used for button loading state)
    errorMessage - Stores the error messages for address input
*/
  }
  const [balance, setBalance] = useState(0);

  const [recepient, setRecepient] = useState("");
  const [solToSend, setSolToSend] = useState(0);
  const [transaction, setTransaction] =
    useState(false);
  const [
    transactionSignature,
    setTransactionSignature,
  ] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("Enter a valid address");

  const [isLoading, setIsLoading] =
    useState(false);
  const [addressCheck, setAddressCheck] =
    useState(false);

  // Sol getter's
  const { publicKey, sendTransaction } =
    useWallet();
  const { connection } = useConnection();

  // Modal Dependencies
  const { isOpen, onOpen, onOpenChange } =
    useDisclosure();

  // Balance Fetcher
  async function fetchBalance() {
    let bal = await connection.getBalance(
      publicKey
    );
    setBalance(bal / LAMPORTS_PER_SOL);
  }
  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }
    connection
      .getBalance(publicKey)
      .then((balance) => {
        setBalance(balance / LAMPORTS_PER_SOL);
      });
  }, [connection, publicKey]);

  // Form Handler

  async function sendSol(
    e: React.FormEventHandler<HTMLFormElement>
  ) {
    e.preventDefault();

    // If address is invalid, exit
    if (addressCheck) {
      return;
    }

    setIsLoading(true); // Set Loading State for Button

    var recepientPubKey = new PublicKey(
      recepient // convert string to public key
    );

    let transaction = new Transaction().add(
      // Start of Transaction
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recepientPubKey,
        lamports: solToSend,
      })
    );

    let sign: any; // declare variable for transaction signature

    try {
      sign = await sendTransaction(
        transaction,
        connection
      );
      await connection.confirmTransaction(sign);

      setTransactionSignature(sign); // Save Transaction Signature
      setTransaction(true); // true = Transaction Sent
      onOpen(); // Opens the Modal
    } catch (error) {
      console.log(error);
    }
    fetchBalance();
    setIsLoading(false); // Transaction Complete, Loading State Reset

    document
      .getElementById("transaction-form")
      ?.reset(); // Reset Form
  }

  // Helper Functions

  // Checks if Address is a valid Solana Address
  function checkAddress(address: string) {
    if (address.length !== 44) {
      setErrorMessage(
        "Enter a valid address - Check address length"
      );
      return true;
    }

    for (let c of address) {
      if (c.match(/[lIO0]/)) {
        setErrorMessage(
          "Enter a valid address - Check address content"
        );

        return true;
      }
    }

    if (address === publicKey?.toBase58()) {
      setErrorMessage(
        "You cannot send to yourself!"
      );
      return true;
    }

    try {
      bs58.decode(address);
    } catch (e) {
      setErrorMessage("Enter a valid address!");

      return true;
    }

    return false; // Address is valid
  }

  // Input Checker
  // Checks if Recepient is a valid Solana Address and updates Recepient
  function recepientHandler(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setAddressCheck(checkAddress(e.target.value));
    setRecepient(e.target.value);
  }

  // Convert Lamports to SOL
  function solAmountHandler(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    let sol =
      Number(e.target.value) * LAMPORTS_PER_SOL;
    setSolToSend(sol); // Saves SOL amount
  }

  return (
    <>
      <Card className="w-[50vw] min-h-[40vh]">
        <CardHeader className="text-2xl py-8 ">
          <div className="mx-auto">Send Sol</div>
        </CardHeader>
        <Divider />

        <CardBody className="flex items-center justify-center">
          {/* User's Account Display - address and balance */}
          <div className="text-xl text-white flex flex-row justify-between mx-auto w-3/4">
            <Input
              type="string"
              label="Your Address"
              labelPlacement="outside"
              value={publicKey?.toBase58()}
              className="w-[48%]"
              variant="bordered"
              disabled
            />

            <Input
              type="number"
              label="Your Current Balance"
              labelPlacement="outside"
              value={String(balance)}
              variant="bordered"
              className="w-[48%]"
              disabled
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-large">
                    ◎
                  </span>
                </div>
              }
            />
          </div>

          <form
            action=""
            className="w-full flex flex-col items-center"
            onSubmit={sendSol}
            id="transaction-form"
          >
            {/* User Inputs */}
            <Input
              type="string"
              label="Recepient"
              labelPlacement="outside"
              className="w-3/4 pt-2"
              variant="bordered"
              onChange={recepientHandler}
              isInvalid={addressCheck}
              isRequired
              errorMessage={
                addressCheck && errorMessage
              }
            />
            <Input
              type="number"
              label="Amount"
              labelPlacement="outside"
              className="w-3/4 pt-4"
              variant="bordered"
              step={0.5}
              onChange={solAmountHandler}
              isRequired
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-large">
                    ◎
                  </span>
                </div>
              }
            />
            <Button
              className="w-1/3 mt-4 bg-purple-200 text-black"
              type="submit"
              isLoading={isLoading}
            >
              {isLoading ? "Loading..." : "Send!"}
            </Button>
          </form>
        </CardBody>
      </Card>
      {/**** Modal ****/}
      {transaction && ( // Conditional render so that modal doesn't render if there is no transaction
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
                  Transaction Success!
                </ModalHeader>
                <ModalBody>
                  <div className="">
                    See Transaction on
                    <Link
                      href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                      isExternal
                      showAnchorIcon
                      isBlock
                      color="success"
                    >
                      Solana Explorer
                    </Link>
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
      )}
    </>
  );
}
