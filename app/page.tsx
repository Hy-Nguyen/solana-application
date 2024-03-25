"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import TransactionForm from "@/components/transactionForm";

export default function Home() {
  const { publicKey } = useWallet();
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

  return (
    <>
      <AuroraBackground>
        <div className="  flex flex-col justify-center items-center ">
          {!publicKey ? (
            <>
              <div className="text-center text-white text-xl">
                <h1>
                  Welcome! To send SOL, connect to
                  your wallet!
                </h1>
              </div>
            </>
          ) : (
            <TransactionForm />
          )}
        </div>
      </AuroraBackground>
    </>
  );
}
