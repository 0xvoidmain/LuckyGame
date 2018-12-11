module.exports = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_durationBlock",
				"type": "uint256"
			}
		],
		"name": "reset",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "finishBlock",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "key",
				"type": "bytes32"
			}
		],
		"name": "join",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "durationBlock",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numberOfPlayers",
		"outputs": [
			{
				"name": "number",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "forceDrawWinner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getWinner",
		"outputs": [
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "key",
				"type": "bytes32"
			},
			{
				"name": "luckyNumber",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "drawWinner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "key",
				"type": "bytes32"
			}
		],
		"name": "getPlayerByKey",
		"outputs": [
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "luckyNumber",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"name": "key",
				"type": "bytes32"
			},
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "luckyNumber",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_durationBlock",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "key",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "luckyNumber",
				"type": "uint256"
			}
		],
		"name": "Join",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "oldName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "newName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "key",
				"type": "bytes32"
			}
		],
		"name": "UpdateName",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "key",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "luckyNumber",
				"type": "uint256"
			}
		],
		"name": "DrawWinner",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "key",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "luckyNumber",
				"type": "uint256"
			}
		],
		"name": "ForceDrawWinner",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "duration",
				"type": "uint256"
			}
		],
		"name": "Reset",
		"type": "event"
	}
]