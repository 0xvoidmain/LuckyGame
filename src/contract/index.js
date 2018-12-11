var Web3 = require('web3');
var abi = require('./abi');
var CryptoJS = require('crypto-js');
var tx = require('ethereumjs-tx');
var ethAbi = require('ethereumjs-abi')
var axios = require('axios');
import accounts from './accounts';
var web3 = new Web3('https://testnet.tomochain.com');
var contractAddress = '0x37c757ca9cf87e2bac8eb175ffe148be0749d7a1';

var address = localStorage.address;
var privateKey = localStorage.privateKey;

var LuckyContract = new web3.eth.Contract(abi, contractAddress);

function _encodeFunctionTxData (functionName, types, args) {
  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
  var params = ethAbi.rawEncode(types, args);
  var dataHex = signature + Web3.utils.bytesToHex(params).slice(2);
  return dataHex;
}

function _getTypesFromAbi (abi, functionName) {

  function matchesFunctionName(json) {
    return (json.name === functionName && json.type === 'function');
  }

  function getTypes(json) {
    return json.type;
  }

  var funcJson = abi.filter(matchesFunctionName)[0];

  return (funcJson.inputs).map(getTypes);
}

function functionTx (abi, functionName, args, txObject) {
  var types = _getTypesFromAbi(abi, functionName);
  var txData = _encodeFunctionTxData(functionName, types, args);

  var txObjectCopy = {};
  txObjectCopy.to = txObject.to;
  txObjectCopy.gasPrice = txObject.gasPrice;
  txObjectCopy.gasLimit = txObject.gasLimit;
  txObjectCopy.nonce = txObject.nonce;
  txObjectCopy.data = '0x' + txData;
  txObjectCopy.value = txObject.value;

  return (new tx(txObjectCopy)).serialize().toString('hex');
}


function sendRaw(rawTx) {
  return new Promise((resolve, reject) => {
    var txHash = '';
    var transaction = new tx(rawTx);
    transaction.sign(new Buffer(privateKey, 'hex'));
    var serializedTx = transaction.serialize().toString('hex');
    web3.eth.sendSignedTransaction('0x' + serializedTx)
    .on('transactionHash', (_txHash) => {
      txHash = _txHash;
      console.log(txHash);
		})
		.on('receipt', (receipt) => {
			if (receipt.status == '0x1') {
        resolve({
          txHash: txHash,
          response: receipt
        })
			} else {
        reject({
          code: 500, message: 'Transaction is mined, but status is false'
        });
			}
		})
		.on('error', (err) => {
			reject(err);
		});
  });
}

function requestTomo(n, callback) {
  console.log('Try to request TOMO', n);
  if (n < 5) {
    axios.post('https://wallet.testnet.tomochain.com/api/wallets/reward/' + address)
    .then(v => {
      console.log(v);
      callback();
    })
    .catch(ex => {
      requestTomo(n + 1);
    })
  }
  else {
    callback(err);
  }
}

export default {
  init: function() {
    var random = Math.round(Math.random() * 1000000) % accounts.length;
    privateKey = accounts[random];
    const wallet = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    address = wallet.address;

    localStorage.address = address;
    localStorage.privateKey = privateKey;

    console.log(address, privateKey);
    web3.eth.getBalance(address)
    .then(v => {
      v = parseFloat(v);
      console.log('balance', v);
      if (v / (10 ** 18) < 10) {
        requestTomo(0);
      }
    });
  },
  setAccount: function(_address, _privateKey) {
    address = _address;
    privateKey = _privateKey;
  },
  getBalance: function() {
    return web3.eth.getBalance(address);
  },
  getFinishBlock: function() {
    return LuckyContract.methods
      .finishBlock()
      .call({ from: address })
      .then(v => parseInt(v));
  },
  getCurrentBlock: function() {
    return web3.eth.getBlockNumber();
  },
  getNumberOfPlayers: function() {
    return LuckyContract.methods
      .numberOfPlayers()
      .call({
        from: address
      })
      .then(v => parseInt(v));
  },
  getPlayer: function(index) {
    return LuckyContract.methods
      .players(index)
      .call({ from: address })
      .then(v => ({
        name: v.name === '0x0000000000000000000000000000000000000000000000000000000000000000' ? ''
          : new Buffer(v.name.slice(2), 'hex').toString(),
        key: v.key.slice(2),
        luckyNumber: parseInt(v.luckyNumber)
      }))
  },
  getMe: function(phoneNumber) {
    var key = CryptoJS.SHA256(phoneNumber)
      .toString()
      .slice(0, 32);
    key = '0x' + new Buffer(key).toString('hex');
    return LuckyContract.methods
    .getPlayerByKey(key)
    .call({ from: address })
    .then(v => ({
      name: v.name === '0x0000000000000000000000000000000000000000000000000000000000000000' ? ''
        : new Buffer(v.name.slice(2), 'hex').toString(),
      luckyNumber: parseInt(v.luckyNumber)
    }))
  },
  getWinner: function() {
    return LuckyContract.methods
    .getWinner()
    .call({ from: address })
    .then(v => ({
      name: v.name === '0x0000000000000000000000000000000000000000000000000000000000000000' ? ''
        : new Buffer(v.name.slice(2), 'hex').toString(),
      key: v.key.slice(2),
      luckyNumber: parseInt(v.luckyNumber)
    }))
  },
  join: function(name, phoneNumber) {
    var key = CryptoJS.SHA256(phoneNumber)
      .toString()
      .slice(0, 32);
    return web3.eth.getTransactionCount(address)
    .then(nonce => {
      var txOptions = {
        from: address,
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(200000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('2500', 'gwei')),
        to: contractAddress
      }
      var rawTx = functionTx(abi, 'join', [name, key], txOptions);
      return sendRaw(rawTx);
    });
  },
  drawWinner: function() {
    return web3.eth.getTransactionCount(address)
    .then(nonce => {
      var txOptions = {
        from: address,
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(200000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('2500', 'gwei')),
        to: contractAddress
      }
      var rawTx = functionTx(abi, 'drawWinner', [], txOptions);
      return sendRaw(rawTx);
    });
  },
  reset: function(duration) {
    return web3.eth.getTransactionCount(address)
    .then(nonce => {
      var txOptions = {
        from: address,
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(2000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('2500', 'gwei')),
        to: contractAddress
      }
      var rawTx = functionTx(abi, 'reset', [duration], txOptions);
      return sendRaw(rawTx);
    });
  },
  forceDrawWinner: function() {
    return web3.eth.getTransactionCount(address)
    .then(nonce => {
      var txOptions = {
        from: address,
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(500000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('2500', 'gwei')),
        to: contractAddress
      }
      var rawTx = functionTx(abi, 'forceDrawWinner', [], txOptions);
      return sendRaw(rawTx);
    });
  }
}