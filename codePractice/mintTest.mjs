import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import {
  Connection,
  Keypair,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";

let pubkey = new PublicKey(
  "8u2JGH2w9NDpwKoT3pEVJQwxVAzi1EMAJxLr5Um9KZ8f"
);
let connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);

async function createMintTransaction() {
  const lamport =
    await getMinimumBalanceForRentExemptMint(
      connection
    );
  const accountKP = Keypair.generate();
  const programID = TOKEN_PROGRAM_ID;

  const transaction = new Transaction()
//   const intructions = SystemProgram.createAccount({
}
createMintTransaction();
