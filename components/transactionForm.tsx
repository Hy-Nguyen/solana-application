"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Tooltip,
} from "@nextui-org/react";
import {
  WalletMultiButton,
  WalletConnectButton,
  WalletDisconnectButton,
  WalletModal,
} from "@solana/wallet-adapter-react-ui";

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

interface FormProps {
  connection: Connection;
  pubicKey: PublicKey;
}
export default function TransactionForm(
  props: FormProps
) {
  const [balance, setBalance] = useState(0);
  const [addressCheck, setAddressCheck] =
    useState(false);
  const [recepient, setRecepient] = useState("");
  const [solToSend, setSolToSend] = useState(0);
  const { publicKey, sendTransaction } =
    useWallet();
  const { connection } = useConnection();

  let shortAddress = "";

  if (publicKey) {
    let address = publicKey.toBase58();
    shortAddress =
      address.substring(0, 4) +
      "..." +
      address.substring(
        address.length - 4,
        address.length
      );
  }

  // Balance Fetcher
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

    var recepientPubKey = new PublicKey(
      recepient
    );

    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recepientPubKey,
        lamports: solToSend,
      })
    );
    let transactionSignature;
    try {
      transactionSignature =
        await sendTransaction(
          transaction,
          connection
        );
    } catch (error) {
      console.log(error);
    }
    alert(transactionSignature);
  }

  // Checks if Address is a valid Solana Address
  function checkAddress(address: string) {
    if (address.length !== 44) {
      return true;
    }
    for (let c of address) {
      if (c.match(/[lIO0]/)) {
        return true;
      }
    }

    try {
      bs58.decode(address);
    } catch (e) {
      return true;
    }

    return false;
  }

  // Checks if Recepient is a valid Solana Address and updates Recepient
  function recepientHandler(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setAddressCheck(checkAddress(e.target.value));
    setRecepient(e.target.value);
  }

  function solAmountHandler(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    let sol =
      Number(e.target.value) * LAMPORTS_PER_SOL;
    setSolToSend(sol);
  }

  return (
    <>
      <Card className="w-[50vw]">
        <CardHeader>
          <div className="text-xl text-white py-2 flex mx-auto">
            <Tooltip
              className=" bg-black text-white"
              content={publicKey.toBase58()}
            >
              <div>{shortAddress}</div>
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-xl text-white text-center py-4">
            {balance
              ? `Balance: ${balance} SOL`
              : "Balance: 0"}
          </div>
        </CardBody>
        <Divider />

        <CardBody className="">
          <form
            action=""
            className="w-full flex flex-col items-center py-4"
            onSubmit={sendSol}
          >
            <Input
              type="string"
              label="Recepient"
              className="w-3/4"
              variant="bordered"
              onChange={recepientHandler}
              isInvalid={addressCheck}
              isRequired
              errorMessage={
                addressCheck &&
                "Enter a valid address"
              }
            />
            <Input
              type="number"
              label="Price"
              className="w-3/4 pt-4"
              variant="bordered"
              step={0.1}
              onChange={solAmountHandler}
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
            >
              Send!
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
