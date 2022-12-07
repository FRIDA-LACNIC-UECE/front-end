<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el label="Anonymization" icon="hotel_class" to="/client/anonymization" />
    </q-breadcrumbs>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        Databases

      </div>
      <div>Select the database</div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-table :rows="databases" :columns="columns" separator="cell" row-key="id" class="col" selection="single"
        v-model:selected="selected">


      </q-table>

    </q-card-section>
    <div class="q-mt-md row"  v-if="selected.length != 0">
        <q-btn color="primary col grow" @click="shareData(selected[0].id)">Send Database</q-btn></div>
  </div>
</template>

<script>
import { Notify, Dialog, Loading } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'Users',
  computed: {
    ...mapGetters('auth', ['getToken']),
    ...mapGetters('auth', ['isAuthenticated'])
  },

  methods: {
    shareData(selected_id) {
      this.$router.push({ name: "anonymizationConfig", params: { data: selected_id } })
    },
    isComplete() {
      console.log(this.database.id_db_type && this.database.name && this.database.host && this.database.user && this.database.port && this.database.password);
      return this.database.id_db_type && this.database.name && this.database.host && this.database.user && this.database.port && this.database.password;
    },
    getValidDatabases() {
      if (!this.getToken) return
      Loading.show()
      api.get('/getValidDatabases', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.validdatabases = response.data
        Loading.hide()
      }).catch(err => {
        console.log(err)
      })
    },
    getDatabases() {
      if (!this.getToken) return
      Loading.show()
      api.get('/getDatabases', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.databases = response.data
        Loading.hide()
      }).catch(err => {
        console.log(err)
      })
    },
    submitTestConnection(database) {
      if (!this.getToken) return
      const data = {
        type: database.name_db_type,
        name: database.name,
        host: database.host,
        user: database.user,
        port: database.port,
        password: database.password
      }
      api.post('http://localhost:5000/test_connection', data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken}` } }).then((res) => {
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
    },
    submitAddDatabase() {
      if (!this.getToken) return
      const data = {
        id_db_type: this.database.id_db_type.id,
        name: this.database.name,
        host: this.database.host,
        user: this.database.user,
        port: this.database.port,
        password: this.database.password
      }
      api.post('http://localhost:5000/addDatabase', data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken}` } }).then((res) => {
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
        this.getDatabases()
        this.$router.push('/client/databases')
      }).catch((err) => {
        console.log(err)
        Notify.create({
          type: 'negative',
          message: err.response.data.error,
          timeout: 1000
        })
      })
    },
    submitDelete(id) {
      if (!this.getToken) return
      Dialog.create({
        title: 'Delete Database',
        message: 'Do you really want to delete this database?',
        cancel: true
      }).onOk(async () => {
        api.post('/deleteDatabase', { id: id }, {
          headers: {
            Authorization: `Bearer ${this.getToken}`
          }
        }).then(response => {
          Notify.create({
            type: 'positive',
            message: response.data.message,
            timeout: 1000
          })
          this.databases = this.databases.filter(element => element.id !== id)
        }).catch(err => {
          Notify.create({
            type: 'negative',
            message: err.response.data.error,
            timeout: 1000
          })
        })
      })
    }
  },
  data() {
    const selected = ref([])
    return {
      selected,
      database: {
        id_db_type: ref(null),
        name: '',
        host: '',
        user: '',
        port: '',
        password: ''
      },
      isPwd: true,
      validdatabases: [],
      addDialog: ref(false),
      columns: [
        {
          name: 'id',
          label: 'ID',
          field: row => row.id,
          format: val => `${val}`,
          align: 'left',
          sortable: true
        },
        {
          name: 'type',
          label: 'Type',
          field: 'name_db_type',
          align: 'left',
          sortable: true
        },
        {
          name: 'name',
          label: 'Name',
          field: 'name',
          align: 'left',
          sortable: true
        },
        {
          name: 'host',
          label: 'Host',
          field: 'host',
          align: 'left',
          sortable: true
        },
        {
          name: 'user',
          label: 'User',
          field: 'user',
          align: 'left',
          sortable: true
        },
        {
          name: 'port',
          label: 'Port',
          field: 'port',
          align: 'left',
          sortable: true
        },
        {
          name: 'password',
          label: 'Password',
          field: 'password',
          align: 'left',
          sortable: true
        }
      ],
      databases: []
    }
  },
  mounted() {
    this.getDatabases()
    this.getValidDatabases()
  }
})
</script>

