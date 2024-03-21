"use client";

import Image from "next/image";
import { AuroraBackground } from "@/components/ui/aurora-background";

import {
  WalletMultiButton,
  WalletConnectButton,
  WalletDisconnectButton,
  WalletModal,
} from "@solana/wallet-adapter-react-ui";

// require("@solana/wallet-adapter-react-ui/styles.css");

import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Button } from "@nextui-org/react";

export default function Home() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  return (
    <>
      <AuroraBackground>
        <div className="flex flex-col justify-center items-center">
          {!publicKey ? (
            <div className="text-center text-white text-xl">
              <h1>
                Welcome! To get started, connect
                to Phantom!
              </h1>
            </div>
          ) : (
            <div className="text-xl text-white">
              {publicKey?.toBase58()}
            </div>
          )}
        </div>
      </AuroraBackground>
    </>
  );
}
