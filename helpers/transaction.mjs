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

const payerSecret = [
  199, 191, 235, 229, 84, 97, 210, 144, 0, 183,
  183, 155, 1, 114, 80, 218, 118, 149, 191, 252,
  218, 117, 187, 113, 121, 243, 64, 84, 169, 46,
  207, 174, 203, 210, 105, 153, 7, 172, 180, 135,
  233, 148, 32, 82, 230, 97, 201, 224, 203, 155,
  64, 126, 192, 230, 218, 132, 131, 200, 197, 150,
  202, 197, 164, 108,
];

const recepientSecret = [
  88, 189, 31, 207, 250, 125, 246, 23, 50, 235,
  25, 54, 188, 144, 88, 206, 1, 11, 207, 186, 206,
  81, 200, 150, 251, 252, 185, 76, 157, 52, 121,
  125, 117, 85, 122, 81, 156, 155, 162, 101, 209,
  21, 224, 220, 18, 182, 150, 151, 176, 189, 246,
  188, 129, 182, 2, 242, 47, 184, 151, 97, 11, 2,
  162, 204,
];

const payerKeypair = Keypair.fromSecretKey(
  new Uint8Array(payerSecret)
);

const recepientKeypair = Keypair.fromSecretKey(
  new Uint8Array(recepientSecret)
);

let solToSend = 2.5 * LAMPORTS_PER_SOL;
{
  /*
    Instructions:
    It needs a 'sent from' address, 'send to' address, and amount to send. 
    Using SystemProgram Transer is the instruction for NATIVE PROGRAMS.
  
    Here, we are sending from 'payer' to'recepient' with 2.5 SOL.
  */
}
let transaction = new Transaction();

// const transferInstruction =
//   SystemProgram.transfer({
//     fromPublicKey: payerKeypair.publicKey,
//     toPublicKey: recepientKeypair.publicKey,
//     lamports: solToSend,
//   });

const transferInstruction =
  SystemProgram.transfer({
    fromPubkey: payerKeypair.publicKey,
    toPubkey: recepientKeypair.publicKey,
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
