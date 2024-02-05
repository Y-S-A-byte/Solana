# Solana Wallet Manager

Bu proje, Solana Blockchain'i üzerinde cüzdan oluşturma, bakiye kontrolü, airdrop işlemleri ve transfer işlemleri gibi temel işlemleri gerçekleştirmek için kullanılan bir araçtır.

## Kurulum

1. **Projeyi Klonlayın:**

    ```bash
    git clone https://github.com/KULLANICI_ADI/solana-wallet-manager.git
    ```

2. **Proje Dizinine Gidin:**

    ```bash
    cd solana-wallet-manager
    ```

3. **Gerekli Paketleri Yükleyin:**

    ```bash
    npm install
    ```

## Kullanım

Bu projeyi kullanarak aşağıdaki işlemleri gerçekleştirebilirsiniz:

- **Yeni Bir Cüzdan Oluşturma:** `node wallet.js new`
- **Airdrop Yapma:** `node wallet.js airdrop <miktar>`
- **Cüzdan Bakiyesini Kontrol Etme:** `node wallet.js balance`
- **Transfer Yapma:** `node wallet.js transfer <public_key> <miktar>`

## Örnek Kullanım

Yeni bir cüzdan oluşturmak için:

```bash
node wallet.js new
