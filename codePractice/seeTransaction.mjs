import {
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";

const connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);
let signature =
  "5vVDRbVne4C2frexyQ8gmYP6ZpKYfFWjJHuA5ZMq3weA4bdQqw2CXVhhheXWt8KHuHjipHKMkqvQko1gkxZGqzs1";
const info = await connection.getTransaction(
  signature
);
console.log(typeof info);
console.log(info.meta.postBalances[0]);
