<template>
  <div class="info">
    <div class="info-text">
      <div v-if="isEnterName" class="fadeInUp animated">
        What's your name?
        <textarea ref="name" class="input"
          placeholder="Your name"
          rows="2" v-model="name"
          @keypress="keyPress"/>
      </div>
      <div v-else class="fadeInUp animated">
        What's your phone number?
        <input ref="phone" type="tel" class="input info-phone"
          placeholder="Phone number" rows="2" v-model="phoneNumber"
          @keypress="keyPress" />
      </div>
    </div>
    <button class="btn fadeInUp animated delay-1s" @click="next">Next</button>
    <div v-if="error" class="info-error">
      {{error}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: sessionStorage.name || "",
      phoneNumber: sessionStorage.phoneNumber || "",
      error: "",
      isEnterName: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.name.focus();
    }, 300);
  },
  methods: {
    keyPress(e) {
      if (e.keyCode === 13 || e.key === 'Enter') {
        e.preventDefault();
        this.next();
      }
    },
    next() {
      if (this.isEnterName) {
        this.name = this.name.trim();
        if (!this.name) {
          this.error = "Enter your name, please!"
          return
        }
        this.name = this.name.split(' ')
          .map(e => e.trim())
          .filter(e => !!e)
          .join(' ');
        this.error = ""
        this.isEnterName = false
        sessionStorage.name = this.name;
        setTimeout(() => {
          this.$refs.phone.focus();
        }, 300);
        window.scrollTo(0, 0);
      }
      else {
        this.phoneNumber = this.phoneNumber.trim()
        if (!this.phoneNumber) {
          this.error = "Enter your phone number, please!"
          return
        }

        this.phoneNumber = this.phoneNumber
          .replace(/ /gi, '')
          .replace('+84', '0')
          .replace(/[^0-9]/g,'');

        if (this.phoneNumber[0] !== '0') {
          this.error = "Invalid phone number, try again please!"
          return
        }

        if (this.phoneNumber.length < 10 || this.phoneNumber.length > 12) {
          this.error = "Invalid phone number, try again please!"
          return
        }
        this.error = ""
        sessionStorage.phoneNumber = this.phoneNumber
        this.$emit('submit', { name: this.name, phoneNumber: this.phoneNumber })
      }
    }
  }
}
</script>

<style>
.info {
  margin-top: 60px;
}

.info-text {
  margin-bottom: 20px;
  font-size: 25px;
}

.info-phone {
  padding-bottom: 33px !important;
}

.info-error {
  color: #F44336;
  margin-top: 15px;
}
</style>
