import {
  createAccount,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import { exit } from "process";

import { appendFile, writeFile } from "fs";

import { config } from "dotenv";

config();

let connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);

let payerSecret = [
  199, 191, 235, 229, 84, 97, 210, 144, 0, 183,
  183, 155, 1, 114, 80, 218, 118, 149, 191, 252,
  218, 117, 187, 113, 121, 243, 64, 84, 169, 46,
  207, 174, 203, 210, 105, 153, 7, 172, 180, 135,
  233, 148, 32, 82, 230, 97, 201, 224, 203, 155,
  64, 126, 192, 230, 218, 132, 131, 200, 197, 150,
  202, 197, 164, 108,
];

let payer = Keypair.fromSecretKey(
  new Uint8Array(payerSecret)
);
let tokenMintKey;
if (!process.env.TOKEN_MINT_KEY) {
  let tokenMint = await createMint(
    connection,
    payer,
    payer.publicKey, //mintAuthority
    null,
    5 //decimals
  );

  let tokenMintKey = tokenMint.toString();
  console.log(`TOKEN MINT: ${tokenMint}`);
  try {
    appendFile(
      ".env",
      `TOKEN_MINT=${tokenMintKey}\n`,
      (err) => {
        if (err) {
          console.log(
            "There was an error writing to the .env file: ",
            err
          );
        } else {
          console.log(
            "Successfully wrote to .env file"
          );
        }
      }
    );
  } catch (err) {
    console.log(
      "There was an unexpected error: ",
      err
    );
  }
} else {
  tokenMintKey = process.env.TOKEN_MINT_KEY;
}

console.log("TOKEN PUBKEY: " + tokenMintKey);
let tokenMintPubKey = new PublicKey(tokenMintKey);
// Creating Token Account
{
  /*
    A Token Account holds tokens of a specific mint and has a specific owner.
    Only the ownder can transfer/burn the tokens, but the account can receive tokens
    from other accounts.
*/
}
// let tokenAccount;
// // console.log(tokenMintPubKey.toString());
// if (!process.env.TOKEN_ACCOUNT) {
//   tokenAccount = await createAccount(
//     connection,
//     payer,
//     tokenMintPubKey,
//     payer.publicKey
//   );
// } else {
//   tokenAccount = new PublicKey(
//     process.env.TOKEN_ACCOUNT
//   );
// }

// console.log(
//   `TOKEN ACCOUNT: ${tokenAccount.toString()}`
// );

let assocTokenAccount;
if (!process.env.ASSOC_TOKEN_ACCOUNT) {
  assocTokenAccount =
    await createAssociatedTokenAccount(
      connection,
      payer,
      tokenMintPubKey,
      payer.publicKey
    );
} else {
  assocTokenAccount = new PublicKey(
    process.env.ASSOC_TOKEN_ACCOUNT
  );
}

console.log(
  `ASSOCIATED TOKEN ACCOUNT: ${assocTokenAccount.toString()}`
);

let mintingTransaction = await mintTo(
  connection,
  payer,
  tokenMintPubKey,
  assocTokenAccount,
  payer.publicKey,
  1800000
);

console.log(mintingTransaction);
