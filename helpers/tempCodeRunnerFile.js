if (process.env.PAYER_SECRET_KEY) {
//   payerKeypair =
//     Keypair.fromSecretKey(payerSecret);
// } else {
//   let newPayer = Keypair.generate();
//   const newSecret = newPayer.secretKey.toString();
//   fs.appendFileSync(
//     "./.env",
//     `\nPAYER_SECRET_KEY=${newSecret}`
//   );
// }