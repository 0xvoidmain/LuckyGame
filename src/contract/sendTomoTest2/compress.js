
const fs = require('fs');

async function checkBalance() {
    var accounts = require('./accounts.json');
    accounts = accounts.map(e => e.privateKey);
    var s = 'export default ' + JSON.stringify(accounts, null, 4);

    fs.writeFileSync('./accounts.js', s);
}

checkBalance();