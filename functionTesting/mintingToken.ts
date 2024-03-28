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

/**
 * Creates a mint transaction
 * @param {PublicKey} payerPublicKey - The public key of the payer
 * @param {number} decimals - The number of decimals for the minted tokens
 * @return {Promise<Transaction>}
 */
export async function createMintTransaction(
  payerPublicKey: PublicKey,
  decimals: number = 0,
  connection: Connection
) {
  const minBalanceForRentExempt =
    await getMinimumBalanceForRentExemptMint(
      connection
    );

  // Creating new mint account
  const mintAccountKP = Keypair.generate();

  // spl-token program ID
  const programID = TOKEN_PROGRAM_ID;

  // Create New Mint Transaction
  const mintTransaction = new Transaction().add(
    // creatin account for the mint
    SystemProgram.createAccount({
      fromPubkey: payerPublicKey,
      newAccountPubkey: mintAccountKP.publicKey,
      lamports: minBalanceForRentExempt,
      space: MINT_SIZE,
      programId: programID,
    }),
    // creating the mint itself
    createInitializeMintInstruction(
      mintAccountKP.publicKey,
      decimals,
      payerPublicKey,
      null,
      programID
    )
  );
  return { mintTransaction, mintAccountKP };
  // const { mintTransaction, mintAccountKP} = await createMintTransaction(payerPublicKey, decimals, connection);
}

// Create Associtate Token Account
/**
 * Creates an associated token account for the given mint and payer
 * @param {PublicKey} mintAccountPublicKey - The public key of the mint account
 * @param {PublicKey} payer - The public key of the payer
 * @return {Promise<Transaction>}
 */
export async function createAssociatedTokenAccountTransaction(
  mintAccountPublicKey: PublicKey,
  payerPublicKey: PublicKey
) {
  const associatedTokenAddress =
    await getAssociatedTokenAddress(
      mintAccountPublicKey, // Mint Public Key
      payerPublicKey, // Main Wallet Owner - Public Key
      false // Allow Owner Off Curve?
    );

  const createAccountTransaction =
    new Transaction().add(
      createAssociatedTokenAccountInstruction(
        payerPublicKey, // PublicKey
        associatedTokenAddress, //PublicKey
        payerPublicKey, //PublicKey
        mintAccountPublicKey //PublicKey
      )
    );

  return {
    createAccountTransaction,
    associatedTokenAddress,
  };
  //   const {createAccountTransaction, associatedTokenAddress} = await createAssociatedTokenAccount(mintAccountPublicKey, payer
}

/**
 * Creates a mint to associated token account transaction
 * @param {PublicKey} mintAccountPublicKey - The public key of the mint account
 * @param {PublicKey} tokenAccountPublicKey - The public key of the token account
 * @param {PublicKey} payerPublicKey - The public key of the payer
 * @param {number} tokenAmount - The amount of tokens to mint
 * @return {Transaction}
 */
export async function mintToAssocTokenAccount(
  mintAccountPublicKey: PublicKey | undefined,
  tokenAcountPublicKey: PublicKey | undefined,
  payerPublicKey: PublicKey | undefined,
  tokenAmount: number | bigint = 1
) {
  let transaction;
  if (
    mintAccountPublicKey !== undefined &&
    tokenAcountPublicKey !== undefined &&
    payerPublicKey !== undefined
  ) {
    transaction = new Transaction().add(
      createMintToInstruction(
        mintAccountPublicKey, // mint public key
        tokenAcountPublicKey, // token account public key
        payerPublicKey, // payer public key
        tokenAmount // token * 10^decimals
      )
    );
  }
  return transaction;
}
