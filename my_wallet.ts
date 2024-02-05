const fs = require('fs');
const { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl, Keypair } = require('@solana/web3.js');

const WALLET_FILE_PATH = 'wallet.json';

async function main() {
    // Bu satırda devnet ile baglanti kuruluyor.
    const connection = new Connection(clusterApiUrl('devnet'));

    // Kullanicidan komutlari aliyoruz
    const args = process.argv.slice(2);
    const komut = args[0];

    if (komut === 'new') {
        // Yeni bir cüzdan oluştur olust
        const newWallet = await createWallet();
        console.log('New wallet created:', newWallet);

        // Cüzdan bilgilerini dosyaya kaydet
        saveWallet(newWallet);
    } else if (komut === 'airdrop') {
        const amount = args[1] ? parseInt(args[1]) : 1;
        await airdrop(connection, amount);
    } else if (komut === 'balance') {
        const wallet = loadWallet();
        if (wallet) {
            const balance = await getBalance(connection, wallet.publicKey);
            console.log('Balance:', balance);
        } else {
            console.log('Wallet not found!');
        }
    } else if (komut === 'transfer') {
        const wallet = loadWallet();
        const recipientPublicKey = args[1];
        const amount = args[2] ? parseInt(args[2]) : 0;
        if (!wallet) {
            console.log('Wallet not found!');
            return;
        }
        await transfer(connection, wallet, recipientPublicKey, amount);
    } else {
        console.log('Invalid command');
    }
}

// Yeni bir cüzdan oluştur
async function createWallet() {
    const newWallet = {
        publicKey: null,
        secretKey: null,
        balance: 0
    };
    
    // Public ve private keylerimize keypair ile atama islemi yapiyoruz
    const keypair = Keypair.generate();
    newWallet.publicKey = keypair.publicKey.toString();
    newWallet.secretKey = keypair.secretKey.toString();

    return newWallet;
}

// Oluşturulan cüzdanı JSON dosyasına kaydet
function saveWallet(wallet) {
    fs.writeFileSync(WALLET_FILE_PATH, JSON.stringify(wallet, null, 4));
    console.log('Wallet saved to', WALLET_FILE_PATH);
}

// JSON dosyasından cüzdanı yükle
function loadWallet() {
    try {
        const walletData = fs.readFileSync(WALLET_FILE_PATH);
        return JSON.parse(walletData);
    } catch (error) {
        return null;
    }
}

// Airdrop yap
async function airdrop(connection, amount) {
    const wallet = loadWallet();
    if (!wallet) {
        console.log('Wallet not found!');
        return;
    }

    try {
        const publicKey = new PublicKey(wallet.publicKey);
        const signature = await connection.requestAirdrop(publicKey, amount * 1000000000);
        console.log('Airdrop successful with signature:', signature);
    } catch (error) {
        console.error('Error in requesting airdrop:', error);
    }
}

// Bakiyeyi al
async function getBalance(connection, publicKey) {
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / 1000000000; // SOL cinsinden bakiye
}

// Transfer yap
async function transfer(connection, wallet, recipientPublicKey, amount) {
    try {
        const fromKeypair = Keypair.fromSecretKey(Buffer.from(wallet.secretKey, 'base64'));
        const toPublicKey = new PublicKey(recipientPublicKey);
        const lamports = amount * 1000000000; // SOL to lamports

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPublicKey,
                lamports: lamports
            })
        );

        const signature = await connection.sendTransaction(transaction, [fromKeypair]);
        console.log('Transfer successful with signature:', signature);
    } catch (error) {
        console.error('Error in transfer:', error);
    }
}

// Ana işlevi çalıştır
main();