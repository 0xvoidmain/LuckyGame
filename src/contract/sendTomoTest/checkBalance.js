
const PrivateKeyProvider = require('truffle-privatekey-provider')
const Web3 = require('web3')
const fs = require('fs');

const coinbase = '0x072cd03192d961c5a848e055c19d5819dbf1c9fb'
const providerTomo = new PrivateKeyProvider('a0d33d84a3009d71aad568e7fa0d80925b3e81979151b7db34e48b3feb70e7ac', 'https://testnet.tomochain.com');
const web3Tomo = new Web3(providerTomo)

async function checkBalance() {
    var accounts = require('./accounts.json');
    for (let i in accounts) {
        let a = accounts[i]
        var balance = await web3Tomo.eth.getBalance(a.hash);
        a.balance = balance;
        console.log(a.hash, balance);
    }

    fs.writeFileSync('./accounts.json', JSON.stringify(accounts, null, 4));

}

checkBalance();