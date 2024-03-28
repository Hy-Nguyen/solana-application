import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  MintCloseAuthorityLayout,
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




let payer = Keypair.fromSecretKey(
  new Uint8Array(secret)
);

// let tokenMintKey;
// // if (!process.env.TOKEN_MINT_KEY) {
let tokenMint = await createMint(
  connection,
  payer.publicKey,
  payer.publicKey, //mintAuthority
  null,
  2 //decimals
);
// // );

// tokenMintKey = tokenMint.toString();
// console.log(`TOKEN MINT: ${tokenMint}`);
//   try {
//     appendFile(
//       ".env",
//       `TOKEN_MINT=${tokenMintKey}\n`,
//       (err) => {
//         if (err) {
//           console.log(
//             "There was an error writing to the .env file: ",
//             err
//           );
//         } else {
//           console.log(
//             "Successfully wrote to .env file"
//           );
//         }
//       }
//     );
//   } catch (err) {
//     console.log(
//       "There was an unexpected error: ",
//       err
//     );
//   }
// } else {
//   tokenMintKey = process.env.TOKEN_MINT_KEY;
// }

// console.log("TOKEN PUBKEY: " + tokenMintKey);
// let tokenMintPubKey = new PublicKey(tokenMintKey);
let tokenMintPubKey = new PublicKey(
  "FSGAmpFAV762YUhU8SdYHEUvG6RzALmxaSmMuDLdFCP8"
);
console.log(
  `token pubkey: ${tokenMintPubKey.toString()}`
);
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

// let assocTokenAccount;
// if (!process.env.ASSOC_TOKEN_ACCOUNT) {
let assocTokenAccount =
  await createAssociatedTokenAccount(
    connection,
    payer,
    tokenMintPubKey,
    payer.publicKey
  );
// } else {
//   assocTokenAccount = new PublicKey(
//     process.env.ASSOC_TOKEN_ACCOUNT
//   );
// }

console.log(
  `ASSOCIATED TOKEN ACCOUNT: ${assocTokenAccount.toString()}`
);

let mintingTransaction = await mintTo(
  connection,
  payer,
  tokenMintPubKey,
  assocTokenAccount,
  payer,
  200
);

console.log(mintingTransaction);

// steps to hold token
// 1. Create Mint
// 2. Create Associated Token Account tied to orignal wallet and mint
// 3. Mint tokens
