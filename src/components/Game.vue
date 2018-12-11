<template>
  <div class="game fadeIn animated">
    <div class="game-price">
      <img src="../assets/giftbox.svg" class="game-gift-icon" />
      <span class="orange">100<span class="f25"> TOMO</span></span>
    </div>

    <div v-if="!winner && finishBlock && currentBlock && (finishBlock >= currentBlock)">
      <div class="title">Finish after</div>
      <div class="f25">{{finishBlock - currentBlock}} blocks</div>
    </div>

    <div v-if="!winner && finishBlock && currentBlock && (finishBlock < currentBlock)">
      <div class="title">Ready to draw winner</div>
      <button v-if="!isDrawing" class="btn" @click="$emit('drawWinner')">Draw winner</button>
      <div v-else>Finding winner...</div>
    </div>

    <div v-if="winner && winner.name.trim() && winner.luckyNumber <= numberOfPlayers">
      <div class="title">Winner</div>
      <div class="orange f25">#{{winner.luckyNumber}}</div>
      <div class="game-winner">{{winner.name}}</div>
    </div>

    <div v-if="player && player.name.trim()">
      <div class="title">You joined<span class="game-change-acc" @click="changePhone">change</span></div>
      <div class="game-text">{{player.name}}</div>
      <div class="game-text">{{player.phoneNumber}}</div>
      <div class="game-text">Lucky Number: <span class="orange">#{{player.luckyNumber}}</span></div>
    </div>

    <div>
      <div class="title">Players ({{players.length}})</div>
      <div v-if="players.length === 0">
        <span>Empty</span>
      </div>
      <div v-if="players.length > 0" v-for="(e, i) in players"
        :key="i + e.key"
        class="game-text">
        {{e.name}} <span class="orange game-number">#{{e.luckyNumber}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['numberOfPlayers', 'winner', 'player', 'players', 'finishBlock', 'currentBlock', 'isDrawing'],
  methods: {
    changePhone() {
      var phoneNumber = prompt('Enter your phone number');
      if (phoneNumber) {
        phoneNumber = phoneNumber.trim()
        if (!phoneNumber) {
          alert("Enter your phone number, please!");
          return
        }

        phoneNumber = phoneNumber
          .replace(/ /gi, '')
          .replace('+84', '0')
          .replace(/[^0-9]/g,'');

        if (phoneNumber[0] !== '0') {
          alert("Invalid phone number, try again please!");
          return
        }

        if (phoneNumber.length < 10 || phoneNumber.length > 12) {
          alert("Invalid phone number, try again please!");
          return
        }
        this.$emit('changePhone', phoneNumber)
      }
    }
  }
}
</script>

<style>
.game-price {
  font-size: 70px;
  font-weight: bold;
}

.game-text {
  margin-bottom: 15px;
}

.game-change-acc {
  text-transform: lowercase;
  color: #2196f3;
  float: right;
}

.game-winner {
  font-size: 40px;
}

.game-gift-icon {
  width: 40px;
  margin-right: 20px;
}

.game-number {
  /* display: inline-block; */
  /* width: 30px; */
  float: right;
}

</style>
