<template>
  <div class="q-pa-md" v-show='!this.$q.loading.isActive'>
    <q-card>
      <q-card-section class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Databases" icon="table_view" to="/client/databases" />
      </q-breadcrumbs>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Databases
          <q-btn label="Add" class="float-right text-capitalize shadow-3" color="primary" icon="create_new_folder"
            @click="addDialog = true" />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table :rows="databases" :columns="columns" separator="cell" row-key="name" class="col">

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-item style="max-width: 420px">
                <q-item-section>
                  <q-item-label>{{ props.row.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn color="yellow" icon="published_with_changes" size="sm" class="q-ml-sm" flat dense
                @click="submitTestConnection(props.row)">
                <q-tooltip>Test Connection</q-tooltip>
              </q-btn>
              <q-btn color="green-7" icon="edit" size="sm" class="q-ml-sm" flat dense>
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn color="red" icon="delete" size="sm" class="q-ml-sm" flat dense @click="submitDelete(props.row.id)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <!--<template v-slot:top-right>
      <q-btn
        icon="add_circle"
        size="14px"
        color="primary"
        label="Adicionar" />
      </template>-->
        </q-table>
      </q-card-section>
<q-card-section class="row">
      <q-btn color="primary col grow" to='./client/anonymization'>Go to Anonymyzation</q-btn>
</q-card-section>
    </q-card>

    <q-dialog v-model="addDialog">
      <q-card>
        <q-form @submit.prevent="submitAddDatabase">
          <q-card-section class="row flex-center">
            <div class="text-h5">Insert Database Record</div>
          </q-card-section>

          <q-card-section class="row flex-center">
            <q-select class="col-8 " filled v-model="database.id_db_type" :options="validdatabases"
              label="Database Type" stack-label :dense="true" :options-dense="true" option-label="name" option-value=""
              :rules="[
                val => !!val || 'Database type is empty'
              ]" />
            <q-input class="col-8 " stack-label label="Name" v-model="database.name" :rules="[
              val => !!val || 'Name is empty'
            ]" />
            <q-input class="col-8 " stack-label label="Host" v-model="database.host" :rules="[
              val => !!val || 'Host is empty'
            ]" />
            <q-input class="col-8" stack-label label="User" v-model="database.user" :rules="[
              val => !!val || 'User is empty'
            ]" />
            <q-input class="col-8 " stack-label label="Port" v-model="database.port" :rules="[
              val => !!val || 'Port is empty'
            ]" />
            <q-input class="col-8 " stack-label label="Password" :type="isPwd ? 'password' : 'text'"
              v-model="database.password" :rules="[
                val => !!val || 'Password is empty'
              ]" >
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </q-card-section>



          <q-card-actions class="q-pb-md row flex-center text-primary">
            <q-btn style="width: 150px" :disabled="!isComplete()" color="primary" label="Test Connection"
              @click="submitTestConnection">
            </q-btn>

            <q-item>
              <q-btn style="width: 150px" class="q-pb-md row flex-center text-primary" color="primary" label="ADD"
                type="submit" v-close-popup></q-btn>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
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
    return {
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
          field: 'id',
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
        },
        { name: 'action', label: 'Actions', field: 'Action', sortable: false, align: 'center' }
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

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
