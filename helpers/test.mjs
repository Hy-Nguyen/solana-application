import {
    Connection, 
    Keypair, 
    SystemProgram, 
    LAMPORTS_PER_SOL, 
    Transaction, 
    clusterApiUrl,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";


// Load and configure dotenv
config();

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

function saveKeyPairToFile(keyPair, name) {
    const keyPairJSON = {
        publicKey: keyPair.publicKey.toString(),
        secretKey: Array.from(keyPair.secretKey)
    };
    
    writeFileSync(`./${name}.json`, JSON.stringify(keyPairJSON));

    return keyPairJSON;
}

async function airdrop(pubkey) {
    let airdropSignature = await connection.requestAirdrop(pubkey, LAMPORTS_PER_SOL * 5);
    
    await connection.confirmTransaction(airdropSignature);
}

async function main() {
    let senderKeyPair, bankKeyPair;
  
    // Create two new accounts if there aren't any in the .env file
    if (!process.env.SENDER_PUBLIC_KEY || !process.env.SENDER_SECRET_KEY) {
        senderKeyPair = Keypair.generate();
        await airdrop(senderKeyPair.publicKey);
        const senderKeyPairJSON = saveKeyPairToFile(senderKeyPair, "sender");

        console.log(`New sender key pair generated and saved to sender.json. Public Key: ${senderKeyPairJSON.publicKey}`);
    }
    if (!process.env.BANK_PUBLIC_KEY || !process.env.BANK_SECRET_KEY) {
        bankKeyPair = Keypair.generate();
        const bankKeyPairJSON = saveKeyPairToFile(bankKeyPair, "bank");

        console.log(`New bank key pair generated and saved to bank.json. Public Key: ${bankKeyPairJSON.publicKey}`);
    }

    // Create a transaction to send 2 SOL from sender to bank
    let transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderKeyPair.publicKey,
            toPubkey: bankKeyPair.publicKey,
            lamports: 2 * LAMPORTS_PER_SOL,
        }),
    );
  
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.sign(senderKeyPair);
    let signature = await connection.sendTransaction(transaction);
  
    console.log(`Transaction ${signature} confirmed`);
}

main().catch(console.error);
