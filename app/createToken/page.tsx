"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import TokenForm from "@/components/TokenForm";

export default function Home() {
  const { publicKey } = useWallet();
  return (
    <>
      <AuroraBackground>
        {!publicKey ? (
          <>
            <div className="text-center text-white text-xl">
              <h1>
                Welcome! To create Tokens, connect
                to Phantom!
              </h1>
            </div>
          </>
        ) : (
          <TokenForm />
        )}
      </AuroraBackground>
    </>
  );
}
