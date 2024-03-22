import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { createMint, createAccount, Account } from "@solana/spl-token";

export default function Home() {
  return (
    <>
      <AuroraBackground>
        <div className="flex flex-col justify-center items-center "></div>
      </AuroraBackground>
    </>
  );
}
