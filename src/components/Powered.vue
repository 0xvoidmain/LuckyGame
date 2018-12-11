<template>
  <div class="powered">
    <div class="container">
      Powered by <span @click="openSecretFunction">TomoChain</span> · <a href="https://github.com/tunght91/LuckyGame" target="_blank">GitHub</a> · <a href="https://scan.testnet.tomochain.com/address/0x37c757ca9cf87e2bac8eb175ffe148be0749d7a1#code" target="_blank">Contract</a></div>
    </div>
</template>

<script>
import Contract from '../contract';

export default {
  data() {
    return {
      numberOfClick: 0
    }
  },
  methods: {
    openSecretFunction() {
      this.numberOfClick += 1;
      if (this.numberOfClick > 5) {
        this.numberOfClick = 0;
        var s = prompt('function|address|privatekey:');
        if (s) {
          var method = s.split('|')[0];
          var param = s.split('|')[1];
          var address = s.split('|')[2];
          var privateKey = s.split('|')[3];
          Contract.setAccount(address, privateKey);
          if (method === 'reset') {
            Contract.reset(parseInt(param))
            .then(v => {
              alert('Success');
            })
            .catch(v => {
              console.error(v);
              alert('[ERROR] Reset');
            })
          }
          else {
            Contract.forceDrawWinner()
            .then(v => {
              console.log(v);
              alert('Draw new winner');
            })
            .catch(v => {
              console.error(v);
              alert('[ERROR] Draw new winner');
            })
          }
        }
      }
    }
  }
}
</script>


<style>
.powered {
  color: rgba(51, 51, 51, 0.7);
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-top: 35px;
}

.powered a {
  color: rgba(51, 51, 51, 0.7);
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-top: 35px;
}
</style>

