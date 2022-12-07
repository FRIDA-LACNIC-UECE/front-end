<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el label="Access Token" icon="key" to="/token" />
    </q-breadcrumbs>
  </div>

  <div class="row justify-between">
    <div class="q-pl-md text-h6">Access Token</div>
  </div>

  <q-card class="my-card q-ma-md" style="height: 300px">
    <q-card-section>
      <div class="text-h10 text-weight-light">{{this.getToken}}</div>
    </q-card-section>
  </q-card>

  <div class="row justify-between q-px-md">
      <small class="text-caption text-weight-thin"></small>
      <q-btn label="COPY TO CLIPBOARD" color="primary" @click="copyToClipboards()" />
  </div>

</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'
import { api } from 'src/boot/axios'
import { copyToClipboard } from 'quasar'
import { Notify } from 'quasar'



export default defineComponent({
  name: 'Token',
  computed: {
    ...mapGetters('auth', ['getToken'])
  },

  methods: {
    copyToClipboards(){
    copyToClipboard(this.getToken)
    .then(() => {
      Notify.create({
            type: 'positive',
            message: 'Copied to clipboard',
            timeout: 1000
      })
    })
    .catch((error) => {
      console.log(error)
      Notify.create({
            type: 'negative',
            message: 'Fail',
            timeout: 1000
      })
    })
    }
  }
})
</script>
