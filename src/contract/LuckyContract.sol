pragma solidity ^0.4.23;

contract LuckyContract {
  address owner;

  struct Player {
    bytes32 key;
    bytes32 name;
    uint luckyNumber;
  }

  Player[] public players;
  bool haveWinner;
  uint public winner;
  mapping(bytes32 => uint) indexByKey;
  mapping(bytes32 => bool) checkKey;
  uint public finishBlock;
  uint public durationBlock;

  event Join(bytes32 name, bytes32 key, uint luckyNumber);
  event UpdateName(bytes32 oldName, bytes32 newName, bytes32 key);
  event DrawWinner(bytes32 name, bytes32 key, uint luckyNumber);
  event ForceDrawWinner(bytes32 name, bytes32 key, uint luckyNumber);
  event Reset(uint duration);

  modifier validate(bytes32 name) {
    require(
      name.length > 0,
      "Please enter your name"
    );
    _;
  }

  modifier isOwner() {
    require(
      msg.sender == owner,
      "You don't have permission"
    );
    _;
  }

  modifier isFinish() {
    require(
      block.number > finishBlock,
      "The game is not finish"
    );
    _;
  }

  modifier onTime() {
    require(
      block.number <= finishBlock,
      "The game is finished"
    );
    _;
  }

  constructor(uint _durationBlock) public {
    owner = msg.sender;
    haveWinner = false;
    winner = 0;
    durationBlock = _durationBlock;
    finishBlock = block.number + durationBlock;
  }

  function rand(uint max) private view returns (uint256 result){
    uint256 lastBlockNumber = block.number - 1;
    return uint256(blockhash(lastBlockNumber)) % max;
  }

  function reset(uint _durationBlock) public
    isOwner() {
    for (uint i = 0; i < players.length; i++) {
      indexByKey[players[i].key] = 0;
      checkKey[players[i].key] = false;
    }
    players.length = 0;
    winner = 0;
    haveWinner = false;
    durationBlock = _durationBlock;
    finishBlock = block.number + durationBlock;
    emit Reset(_durationBlock);
  }

  function join(bytes32 name, bytes32 key) public
    validate(name)
    onTime() {
    uint index = players.length;
    if (checkKey[key] == false) {
      players.push(Player({
        name: name,
        key: key,
        luckyNumber: index
      }));
      checkKey[key] = true;
      indexByKey[key] = index;
      emit Join(name, key, index);
    }
    else {
      uint i = indexByKey[key];
      emit UpdateName(players[i].name, name, key);
      players[i].name = name;
    }
  }

  function drawWinner() public
    isFinish() {
    if (haveWinner == false) {
      winner = rand(players.length);
      haveWinner = true;
      emit DrawWinner(players[winner].name, players[winner].key, players[winner].luckyNumber);
    }
  }

  function forceDrawWinner() public
    isOwner() {
    winner = rand(players.length);
    haveWinner = true;
    emit ForceDrawWinner(players[winner].name, players[winner].key, players[winner].luckyNumber);
  }

  function getPlayerByKey(bytes32 key) public view returns (bytes32 name, uint luckyNumber) {
    uint index = indexByKey[key];
    if (players[index].key == key) {
      name = players[index].name;
      luckyNumber = players[index].luckyNumber;
    }
    else {
      name = "";
      luckyNumber = 0;
    }
  }

  function numberOfPlayers() public view returns (uint number) {
    number = players.length;
  }

  function getWinner() public view returns (bytes32 name, bytes32 key, uint luckyNumber) {
    if (haveWinner) {
      name = players[winner].name;
      key = players[winner].key;
      luckyNumber = players[winner].luckyNumber;
    }
    else {
      name = "";
      key = "";
      luckyNumber = 0;
    }
  }
}