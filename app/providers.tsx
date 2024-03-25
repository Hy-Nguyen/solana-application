"use client";
import { NextUIProvider } from "@nextui-org/react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import * as web3 from "@solana/web3.js";

export default function Provider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = [new PhantomWalletAdapter()];
  return (
    <NextUIProvider>
      <ConnectionProvider
        endpoint={endpoint}
        config={{ commitment: "finalized" }}
      >
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </NextUIProvider>
  );
}
