<template>
  <img src="~assets/blue-wave.svg" class="wave" alt="register-wave">
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
      <!--<img src="~assets/login.svg" class="responsive" alt="register-image">-->
    </div>
    <div class="col-12 col-md-6 flex content-center">
      <q-card style='width: 80%'>
        <q-card-section>
          <q-avatar size="150px" class="absolute-center" icon="face"/>
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
            <q-input label="Email" v-model="register.email" :rules="[
              val => !!val || 'Email is empty'
            ]">
            </q-input>
            <q-input label="Password" :type="isPwd ? 'password' : 'text'" v-model="register.password" :rules="[
              val => !!val || 'Password is empty'
            ]">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Register',

  data() {
    return {
      register: {
        username: '',
        email: '',
        password: ''
      },
      isPwd: true
    }
  },
  methods: {
    submitRegister() {
      const data = {
        name: this.register.username,
        email: this.register.email,
        password: this.register.password
      }
      api.post('http://localhost:5000/register', data, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
        console.log(res.data)
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
      }).catch((err) => {
        console.log(err)
        Notify.create({
          type: 'negative',
          message: err.response.data.error,
          timeout: 1000
        })
      })
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
</style>
