import {
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import {
  Connection,
  Keypair,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";



let payerKP = Keypair.fromSecretKey(
  new Uint8Array(secret)
);
let payer = payerKP.publicKey;

let connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);

let signatures =
  await connection.getConfirmedSignaturesForAddress2(
    payer
  );

const transactions = await Promise.all(
  signatures.map(async (signature) => {
    const tx = await connection.getTransaction(
      signature.signature
    );
    console.log(tx.meta.fee / LAMPORTS_PER_SOL);
    console.log(
      tx.meta.postBalances[0] / LAMPORTS_PER_SOL
    );
    console.log(
      tx.meta.postBalances[1] / LAMPORTS_PER_SOL
    );
    console.log(
      tx.meta.preBalances[0] / LAMPORTS_PER_SOL
    );
    console.log(
      tx.meta.preBalances[1] / LAMPORTS_PER_SOL
    );
    console.log(
      `From: ${tx.transaction.message.accountKeys[0]}`
    );
    console.log(`To: ${tx.transaction.message.accountKeys[0]}`);
  })
);

console.log(payer.toString());
