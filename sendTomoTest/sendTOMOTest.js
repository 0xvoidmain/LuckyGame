
const PrivateKeyProvider = require('truffle-privatekey-provider')
const Web3 = require('web3')

async function sendTomo(from, privateKey, accounts, start, end) {
  var providerTomo = new PrivateKeyProvider(privateKey, 'https://testnet.tomochain.com');
  var web3 = new Web3(providerTomo)

  for (let i = start; i < end && accounts[i]; i++) {
    var address = accounts[i].hash;
    var balance = await web3.eth.getBalance(address);
    if (balance / (10 ** 18) < 10) {
      console.log('>>', address)
      var nonce = await web3.eth.getTransactionCount(from)
      await web3.eth.sendTransaction({
        nonce: nonce,
        from: from,
        to: address,
        value: 10 * (10 ** 18),
        gasLimit: 21000,
        gasPrice: 2500
      });
    }
  }
}

var baseAccounts = [{
    address: '0xc412515C31273980222Ff579eD85cA22A56D9683',
    privateKey: '71D940C7064941C5DD388A7FD9D5F5AFA08DA77F20C3EB847F64A24D8B91D940'
  },
  {
    address: '0x2cd87e5fb6364e25be7f9ed710d8c7cf35116ca3',
    privateKey: 'a0dad06a2c033aead44eb3c9c9654f04d60c3debfb8d00e18385c70b00ac7786'
  },
  {
    address: '0x072cd03192d961c5a848e055c19d5819dbf1c9fb',
    privateKey: 'a0d33d84a3009d71aad568e7fa0d80925b3e81979151b7db34e48b3feb70e7ac'
  },
  {
    address: '0xd602848c42df4e0f279c2a762533f5f03049c5b8',
    privateKey: '9e3b747c7e4d41b8f00dfe66158eb1c1e426196eab492773af0ece5496482e30'
  },
  {
    address: '0x5f3378933a47bfe3918574fe02ed58808fa43053',
    privateKey: '29e5c2b3e2be561ddb781ff7600fd38fe5021c265e3102bfa29fc889e25c6b12'
  },
  {
    address: '0xaadcb22efe5469c3d5214dce248f49c77cfe21dd',
    privateKey: '648698ebaad3d5d6ec20db5a1c649029d846d49a70eb4054206837d2eea10862'
  }
];
function main() {
  var accounts = require('./accounts.json');
  accounts = accounts.filter(e => e.balance == 0);
  console.log(accounts.length);
  var n = Math.round(accounts.length / baseAccounts.length);
  baseAccounts.forEach((e, i) => {
    sendTomo(e.address, e.privateKey, accounts, i * n, (i + 1) * n);
  })
}

main();