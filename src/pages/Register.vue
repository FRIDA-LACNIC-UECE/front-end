<template>
  <img src="~assets/blue-wave.svg" class="wave" alt="register-wave">
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
      <!--<img src="~assets/login.svg" class="responsive" alt="register-image">-->
    </div>
    <div class="col-12 col-md-6 flex content-center">
      <q-card style='width: 80%'>
        <q-card-section>
          <q-avatar size="150px" class="absolute-center" icon="face" />
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h2 class="text-h2 text-uppercase q-my-none text-weight-regular">Register</h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="submitRegister">
            <q-input label="User" v-model="register.username" :rules="[
                val => !!val || 'Name is empty'
              ]">
            </q-input>
            <q-input label="Email" v-model="register.email" :rules="[val => !!val || 'Email is empty', isValidEmail]" hint="Enter valid email">
            </q-input>
            <q-input label="Password" :type="isPwd ? 'password' : 'text'" v-model="register.password"
  :rules="[val => (val && val.length >= 8) || 'Password must be at least 8 characters',
          val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
          val => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
          val => /[0-9]/.test(val) || 'Password must contain at least one number',
          val => {
            const uniqueNumbers = new Set(val.match(/\d/g));
            return uniqueNumbers.size === val.match(/\d/g).length || 'Password cannot have repeated numbers';
          }]">
</q-input>



            <div>
              <q-btn class="full-width" color="primary" label="Register" type="submit" rounded></q-btn>
              <div class="text-center q-mt-sm q-gutter-lg">
                <router-link class="text-white" to="/login">Already have an account? Log In</router-link>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, Loading } from 'vue'

export default defineComponent({
  name: 'Register',

  data() {
    return {
      register: {
        username: '',
        email: '',
        password: ''
      },
      isPwd: true,
      passwordValidation: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      uniqueNumbers: false
      }
    }
  },
  methods: {
    validatePassword() {
    const password = this.register.password;

    this.passwordValidation.length = password.length >= 8;
    this.passwordValidation.uppercase = /[A-Z]/.test(password);
    this.passwordValidation.lowercase = /[a-z]/.test(password);
    this.passwordValidation.number = /[0-9]/.test(password);

    const uniqueNumbers = new Set(password.match(/\d/g));
    this.passwordValidation.uniqueNumbers = uniqueNumbers.size === password.match(/\d/g).length;
  },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Invalid email';
    },
    reset() {
      this.$refs.input.resetValidation()
    },
    submitRegister() {
      const data = {
        username: this.register.username,
        email: this.register.email,
        password: this.register.password
      }
      api.post('./user', data, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
        this.$router.push('/user-activation')
      }).catch(function (err) {
          Loading.hide()
          const status = err.response.status
          if (status === 409) {
            Notify.create({
              type: "negative",
              message: "Username or e-mail already in use.",
              timeout: 5000,
              actions: [
                { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
              ]
            });
          }
          else {
            Notify.create({
              type: "negative",
              message: "Oops! Something went wrong. Please try again later.",
              timeout: 2000,
            });
          }
        });
    }
  }
})
</script>

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}

.text-success {
  color: green;
}

.text-error {
  color: red;
}
</style>
