import {
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
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

let secret = [
  88, 189, 31, 207, 250, 125, 246, 23, 50, 235,
  25, 54, 188, 144, 88, 206, 1, 11, 207, 186, 206,
  81, 200, 150, 251, 252, 185, 76, 157, 52, 121,
  125, 117, 85, 122, 81, 156, 155, 162, 101, 209,
  21, 224, 220, 18, 182, 150, 151, 176, 189, 246,
  188, 129, 182, 2, 242, 47, 184, 151, 97, 11, 2,
  162, 204,
];

let payerKP = Keypair.fromSecretKey(
  new Uint8Array(secret)
);
let payer = payerKP.publicKey;

let connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);

var mintAccountKP;

var mintAccountPublicKey;

var assocTokenAccountPublicKey;

async function createMintTransaction(
  payerPubkey,
  decimals
) {
  if (!decimals) {
    decimals = 1;
  }
  const lamport =
    await getMinimumBalanceForRentExemptMint(
      connection
    );
  mintAccountKP = Keypair.generate();

  mintAccountPublicKey = mintAccountKP.publicKey;

  console.log(
    `Account Keypair: ${mintAccountKP.publicKey.toString()}`
  );
  const programID = TOKEN_PROGRAM_ID;

  // CREATE MINT
  const transaction = new Transaction();

  const createAccount =
    SystemProgram.createAccount({
      fromPubkey: payerPubkey,
      newAccountPubkey: mintAccountKP.publicKey,
      lamports: lamport,
      space: MINT_SIZE,
      programId: programID,
    });
  const initMint =
    createInitializeMintInstruction(
      mintAccountKP.publicKey,
      decimals, //decimals
      payerPubkey,
      null,
      programID
    );
  transaction.add(createAccount, initMint);
  return transaction;
}

let mintTran = await createMintTransaction(payer);

const transactionId =
  await sendAndConfirmTransaction(
    connection,
    mintTran,
    [payerKP, mintAccountKP]
  );

console.log("Transaction sent:", transactionId);

// Create Associated Token Account
async function createAssocTokenAccount(
  mintpublic,
  payer
) {
  const associatedTokenAddress =
    await getAssociatedTokenAddress(
      mintpublic, // Mint Public Key
      payer, // Main Wallet Owner - Public Key
      false // Allow Owner Off Curve
    );

  assocTokenAccountPublicKey =
    associatedTokenAddress;

  const transaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      payer, // PublicKey
      associatedTokenAddress, //PublicKey
      payer, //PublicKey
      mintpublic //PublicKey
    )
  );

  return transaction;
}

console.log(mintAccountPublicKey.toString());

let assocTokenAccTran =
  await createAssocTokenAccount(
    mintAccountPublicKey,
    payer
  );

const assocTokenTransactionID =
  await sendAndConfirmTransaction(
    connection,
    assocTokenAccTran,
    [payerKP]
  );

console.log(
  "Assoc Token Account Created:",
  assocTokenTransactionID
);

// Mint to Associated Token Account
async function mintToAssocTokenAccount(
  mint,
  destination,
  authority,
  amount
) {
  // authority: web3.PublicKey,
  // mint: web3.PublicKey,
  // amount: number,
  // destination: web3.PublicKey
  const transaction = new Transaction().add(
    createMintToInstruction(
      mint, // mint public key
      destination, // token account public key
      authority, // payer public key
      amount // token * 10^decimals
    )
  );
  return transaction;
}

let mintToAssocTran =
  await mintToAssocTokenAccount(
    mintAccountPublicKey,
    assocTokenAccountPublicKey,
    payer,
    20
  );

const mintToAssocTransactionID =
  await sendAndConfirmTransaction(
    connection,
    mintToAssocTran,
    [payerKP]
  );

console.log(
  "Mint to Associated Token Account:",
  mintToAssocTransactionID
);