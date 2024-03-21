import {
  Transaction,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  clusterApiUrl,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import bs58 from "bs58";
import { writeFileSync } from "fs";
import { config } from "dotenv";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

// Load and configure dotenv
config();

const connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);

const payerKeypair = getKeyPairFromEnv(
  process.env.PAYER_SECRET_KEY
);
const recepientKeypair = getKeyPairFromEnv(
  process.env.RECEPIENT_SECRET_KEY
);

let transaction = new Transaction();

let solToSend = 2.5 * LAMPORTS_PER_SOL;
{
  /*
    Instructions:
    It needs a 'sent from' address, 'send to' address, and amount to send. 
    Using SystemProgram Transer is the instruction for NATIVE PROGRAMS.
  
    Here, we are sending from 'payer' to'recepient' with 2.5 SOL.
  */
}
const transferInstruction =
  SystemProgram.transfer({
    fromPublicKey: payerKeypair.publicKey,
    toPublicKey: recepientKeypair.publicKey,
    lamports: solToSend,
  });

transaction.add(transferInstruction);

const signature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payerKeypair]
);

console.log("Transaction signature:", signature);

function getKeyPairFromEnv(secretKey) {
  const secretKeyUint8Array = new Uint8Array(
    secretKey.split(",").map((sk) => parseInt(sk))
  );
  return Keypair.fromSecretKey(
    secretKeyUint8Array
  );
}

async function checkBalance(address) {
  let bal = await connection.getBalance(address);

  return bal;
}
// let payerBal = await checkBalance(
//   payerKeypair.publicKey
// );
// let recepientBal = await checkBalance(
//   recepientKeypair.publicKey
// );
