<template>
  <div id="app">
    <Header />
    <div class="main-container">
      <Home v-if="state === 'home'"
        @join="changeState('info')"
        @game="changeState('game')"
        :isJoined="isJoined"
        :winner="winner"
        :finishBlock="finishBlock"
        :currentBlock="currentBlock"
        />
      <information v-if="state === 'info'" @submit="submit" />
      <Waiting v-if="state === 'waitting'" />
      <Game v-if="state === 'game'"
        :numberOfPlayers="numberOfPlayers"
        :player="player"
        :winner="winner"
        :finishBlock="finishBlock"
        :currentBlock="currentBlock"
        :players="players"
        :isDrawing="isDrawing"
        @drawWinner="drawWinner"
        @changePhone="changePhone"/>
    </div>
    <Powered />
  </div>
</template>

<script>
import Header from './components/Header'
import Powered from './components/Powered'
import Information from './components/Information'
import Waiting from './components/Waiting'
import Home from './components/Home'
import Game from './components/Game'
import Contract from './contract'
export default {
  name: 'app',
  components: {
    Header,
    Information,
    Powered,
    Waiting,
    Home,
    Game
  },
  data() {
    return {
      state: 'home',
      isJoined: sessionStorage.joined,
      numberOfPlayers: 0,
      player: null,
      winner: null,
      name: sessionStorage.name || '',
      phoneNumber: sessionStorage.phoneNumber || '',
      finishBlock: 0,
      currentBlock: 0,
      isDrawing: false,
      players: []
    }
  },
  created() {
    Contract.init();
    this.getData();
  },
  methods: {
    reset() {
      delete sessionStorage.joined;
      delete sessionStorage.name;
      delete sessionStorage.phoneNumber;

      this.state = 'home';
      this.isJoined = sessionStorage.joined;
      this.numberOfPlayers = 0;
      this.player = null;
      this.winner = null;
      this.name = sessionStorage.name || '';
      this.phoneNumber = sessionStorage.phoneNumber || '';
      this.finishBlock = 0;
      this.currentBlock = 0;
      this.isDrawing = false;
      this.players = [];

      this.getData();
    },
    getData() {
      Contract.getMe(this.phoneNumber)
      .then(v => {
        this.player = {
          name: v.name,
          luckyNumber: v.luckyNumber,
          phoneNumber: sessionStorage.phoneNumber
        };
      })
      .catch(ex => {});

      this.getWinner();
      this.getPlayers();
      this.getDuration();
    },
    drawWinner() {
      this.isDrawing = true;
      Contract.drawWinner()
      .then(() => {
        return Contract.getWinner()
        .then(v => {
          this.winner = {
            name: v.name,
            key: v.key,
            luckyNumber: v.luckyNumber
          };
        });
      })
      .catch(ex => {
        this.isDrawing = false;
      });
    },
    getDuration() {
      if (this.finishBlock === 0) {
        Contract.getFinishBlock()
        .then(v => this.finishBlock = v)
      }

      Contract.getCurrentBlock()
      .then(v => this.currentBlock = v);

      setTimeout(() => {
        this.getDuration();
      }, 2000);
    },
    getWinner() {
      Contract.getWinner()
      .then(v => {
        if (v && v.name.trim() && v.key.trim()) {
          this.winner = {
            name: v.name,
            key: v.key,
            luckyNumber: v.luckyNumber
          };
        }
      })
      .catch(ex => {});
      setTimeout(() => {
        this.getWinner();
      }, 5000);
    },
    getPlayers() {
      Contract.getNumberOfPlayers()
      .then(v => {
        if (this.numberOfPlayers > v) {
          return this.reset();
        }
        for (var i = this.numberOfPlayers; i < v; i++) {
          Contract.getPlayer(i)
          .then(v => {
            var find = this.players.find(e => e.key === v.key);
            if (!find) {
              this.players.push(v)
            }
            this.players = this.players.sort((a, b) => a.luckyNumber - b.luckyNumber);
          });
        }
        this.numberOfPlayers = v;
        setTimeout(() => {
          this.getPlayers();
        }, 2000);
      });
    },
    changePhone(phoneNumber) {
      Contract.getMe(phoneNumber)
      .then(v => {
        if (v.name.trim()) {
          this.player = {
            name: v.name,
            luckyNumber: v.luckyNumber,
            phoneNumber: phoneNumber
          };
        }
      })
      .catch(ex => {});
    },
    changeState(newState) {
      this.state = newState
    },
    submit({name, phoneNumber}) {
      this.changeState('waitting');
      this.name = name;
      this.phoneNumber = phoneNumber;
      Contract.join(name, phoneNumber)
      .then(() => Contract.getMe(phoneNumber))
      .then(v => {
        this.player = {
          name: v.name,
          luckyNumber: v.luckyNumber,
          phoneNumber: sessionStorage.phoneNumber
        };
        sessionStorage.joined = true;
        this.changeState('game');
      })
      .catch(ex => {
        console.error(ex);
        alert('Have an error, try again please!');
        this.changeState('info');
      });
    }
  }
}
</script>