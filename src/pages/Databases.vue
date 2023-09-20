<template>
  <div class="q-pa-md" v-show='!this.$q.loading.isActive'>
    <q-card>
      <q-card-section class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/client/home" />
          <q-breadcrumbs-el label="Databases" icon="table_view" to="/client/databases" />
        </q-breadcrumbs>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Databases
          <q-btn label="Add" class="float-right text-capitalize shadow-3" color="primary" icon="create_new_folder"
            @click="addDatabaseDialog = true" />
        </div>
      </q-card-section>
      <q-card-section name="quasar-table" class="q-pa-none">
        <q-table :rows="databasesList" :columns="columns" :rows-per-page-options="[0]" separator="cell" row-key="name"
          class="col">
          <template name="props-show-password" v-slot:body-cell-password="props">
            <q-td :props="props">
              <div class="absolute-center q-mr-md">
    <span v-if="props.row.showPassword">
      <span v-if="props.row.password">{{ props.row.password }}</span>
      <span v-else style="color: red;">EMPTY</span>
    </span>
    <span v-else>*******</span>
    <q-btn color="grey" size="sm" class="q-ml-sm" flat dense v-if="props.row.password !== null"
      v-bind:icon="props.row.showPassword ? 'visibility_off' : 'visibility'"
      @click="toggleShowPassword(props.row)" />
    <q-tooltip>Show Password</q-tooltip>
  </div>
            </q-td>
          </template>
          <template name="props-name" v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-item style="max-width: 420px">
                <q-item-section>
                  <q-item-label>{{ props.row.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
          </template>

          <template name="props-action" v-slot:body-cell-action="props">
            <q-td :props="props">

              <q-btn color="yellow" icon="published_with_changes" size="sm" class="q-ml-sm" flat dense
                @click="TestConnection(props.row)">
                <q-tooltip>Test Connection</q-tooltip>
              </q-btn>
              <q-btn color="green-7" icon="edit" size="sm" class="q-ml-sm" flat dense
                @click="sendEditDatabase(props.row.id, props.row.valid_database, props.row.name, props.row.host, props.row.username, props.row.port, props.row.password)">
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn color="red" icon="delete" size="sm" class="q-ml-sm" flat dense @click="submitDelete(props.row.id)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section name="advance-to-anonymization" class="row">
        <q-btn color="primary col grow" to='/client/anonymization/databases'>Advance to Anonymization</q-btn>
      </q-card-section>
    </q-card>

    <q-dialog v-model="addDatabaseDialog">
      <q-card>
        <q-form @submit.prevent="submitAddDatabase">
          <q-card-section class="row flex-center">
            <div class="text-h5">Insert Database Record</div>
          </q-card-section>

          <q-card-section class="row flex-center">
            <q-select class="col-8" label="Select database type" outlined v-model="database.databaseTypeName"
              :options="validDatabases" stack-label :dense="true" :options-dense="true" option-label="name"
              option-value="" :rules="[
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
              v-model="database.password">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </q-card-section>


          <q-card-actions class="q-pb-md row flex-center text-primary">
            <q-btn style="width: 150px" color="primary" label="Test Connection" @click="this.submitTestConnectionByURL()">
            </q-btn>

            <q-item>
              <q-btn style="width: 150px" class="q-pb-md row flex-center text-primary" color="primary" label="ADD"
                type="submit" v-close-popup></q-btn>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDatabaseDialog">
      <q-card>
        <q-form @submit.prevent="submitEditDatabase">
          <q-card-section class="row flex-center">
            <div class="text-h5">Edit Database Record</div>
          </q-card-section>

          <q-card-section class="row flex-center">
            <q-select class="col-8" label="Select database type" outlined v-model="databaseEdit.databaseTypeId"
              :options="validDatabases" stack-label :dense="true" :options-dense="true" option-label="name"
              option-value="" :rules="[
                val => !!val || 'Database type is empty'
              ]" />
            <q-input class="col-8 " stack-label label="Name" v-model="databaseEdit.name" :rules="[
              val => !!val || 'Name is empty'
            ]" />
            <q-input class="col-8 " stack-label label="Host" v-model="databaseEdit.host" :rules="[
              val => !!val || 'Host is empty'
            ]" />
            <q-input class="col-8" stack-label label="User" v-model="databaseEdit.user" :rules="[
              val => !!val || 'User is empty'
            ]" />
            <q-input class="col-8 " stack-label label="Port" v-model="databaseEdit.port" :rules="[
              val => !!val || 'Port is empty'
            ]" />
            <q-input class="col-8 " stack-label label="Password" :type="isPwd ? 'password' : 'text'"
              v-model="databaseEdit.password">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </q-card-section>


          <q-card-actions class="q-pb-md row flex-center text-primary">
            <q-btn style="width: 150px" color="primary" label="Test Connection" @click="this.submitTestConnectionByURL()">
            </q-btn>

            <q-item>
              <q-btn style="width: 150px" class="q-pb-md row flex-center text-primary" color="primary" label="OK"
                type="submit" @click="this.submitEditDatabase()" v-close-popup></q-btn>
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
    toggleShowPassword(row) {
      row.showPassword = !row.showPassword
    },
    isComplete() {
      console.log(this.database.databaseTypeName && this.database.name && this.database.host && this.database.user && this.database.port && this.database.password);
      return this.database.databaseTypeName && this.database.name && this.database.host && this.database.user && this.database.port && this.database.password;
    },
    getDatabases() {
      if (!this.getToken) return
      Loading.show()
      api.get('/database', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.databasesList = response.data.items
        Loading.hide()
      }).catch(function (err) {
        Loading.hide()
      });
    },
    getValidDatabases() {
      if (!this.getToken) return
      api.get('/valid_database', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.validDatabases = response.data.items
      }).catch(function (err) {
        Loading.hide()
      });
    },
    sendEditDatabase(id, valid_database, name, host, username, port, password) {
      this.editDatabaseDialog = true
      this.databaseEdit.id = id
      this.databaseEdit.databaseTypeId = ref(valid_database)
      this.databaseEdit.name = ref(name)
      this.databaseEdit.host = ref(host)
      this.databaseEdit.user = ref(username)
      this.databaseEdit.port = ref(port)
      this.databaseEdit.password = ref(password)
    },
    submitEditDatabase() {
      Loading.show()
      if (!this.getToken) return;
      const data = {
        "valid_database_id": this.databaseEdit.databaseTypeId.id,
        "name": this.databaseEdit.name,
        "host": this.databaseEdit.host,
        "username": this.databaseEdit.user,
        "port": parseInt(this.databaseEdit.port),
        "password": this.databaseEdit.password
      }
      api
        .put(`/database/${this.databaseEdit.id}`, data, {
          headers: {
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          Loading.hide()
          Notify.create({
            type: "positive",
            message: "You changed the database informations successfully.",
            timeout: 5000,
            actions: [
            { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
          ]
          })
        })
        .catch(function (err) {
          Loading.hide()
          const status = err.response.status
           if (status === 401) {
          Notify.create({
            type: "negative",
            message: "Unauthorized Access: You are not authorized to perform this action.",
            timeout: 2000
          })
        } else {
          Notify.create({
            type: "negative",
            message: "Oops! Something went wrong. Please try again later.",
            timeout: 2000,
          });
        }
        });
    },
    submitTestConnectionByURL() {
      if (!this.getToken) return;
      const data = {
        valid_database_id: this.database.databaseTypeName.id,
        name: this.database.name,
        host: this.database.host,
        username: this.database.user,
        port: parseInt(this.database.port),
        password: this.database.password,
      };
      api
        .post("/database/test_database_connection_by_url", data, {
          headers: {
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => { console.log("deubom") })
        .catch(function (err) {
          Loading.hide()
          const status = err.response.status
          if (status === 401) {
            Notify.create({
              type: "negative",
              message: "Your login token is invalid! Try again later.",
              timeout: 2000
            });
          } else if (status === 409) {
            Notify.create({
              type: "negative",
              message: "Failed trying to connect. Try changing database informations.",
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
    },
    TestConnection(database) {
      console.log("Teste connection")
      if (!this.getToken) return
      Loading.show()
      api.post(`./database/test_database_connection/${database.id}`, database, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken}`
        }
      }).then((res) => {
        console.log(res)
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
      }).catch(function (err) {
          Loading.hide()
          const status = err.response.status
          if (status === 401) {
            Notify.create({
              type: "negative",
              message: "Unauthorized Access: You are not authorized to perform this action.",
            timeout: 2000
            });
          } else if (status === 409) {
            Notify.create({
              type: "negative",
              message: "Failed trying to connect. Try changing database informations.",
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
    },
    submitAddDatabase() {
      if (!this.getToken) return
      const data = {
        valid_database_id: this.database.databaseTypeName.id,
        name: this.database.name,
        host: this.database.host,
        username: this.database.user,
        port: parseInt(this.database.port),
        password: this.database.password
      }
      console.log(JSON.stringify(data))
      api.post('./database', data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken}` } }).then((res) => {
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
        this.getDatabases()
      }).catch(function (err) {
          Loading.hide()
          const status = err.response.status
          if (status === 401) {
            Notify.create({
              type: "negative",
              message: "Unauthorized Access: You are not authorized to perform this action.",
            timeout: 2000
            });
          } else if (status === 409) {
            Notify.create({
              type: "negative",
              message: "Database already exists.",
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
    },
    submitDelete(databaseId) {
       if (!this.getToken) return
      api.delete(`./database/${databaseId}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken}` } }).then((res) => {
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
        this.getDatabases()
      }).catch(function (err) {
          Loading.hide()
          const status = err.response.status
          if (status === 401) {
            Notify.create({
              type: "negative",
              message: "Unauthorized Access: You are not authorized to perform this action.",
            timeout: 2000
            });
          } else if (status === 409) {
            Notify.create({
              type: "negative",
              message: "Database already exists.",
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
  },
  data() {
    return {
      databasesList: [],
      database: {
        items: [],
        databaseTypeName: ref(null),
        name: '',
        host: '',
        user: '',
        port: '',
        password: ''
      },
      databaseEdit: {
        id: '',
        databaseTypeId: ref(null),
        name: '',
        host: '',
        user: '',
        port: '',
        password: ''
      },
      isPwd: true,
      validDatabases: [],
      addDatabaseDialog: ref(false),
      editDatabaseDialog: ref(false),
      columns: [
        {
          label: 'Id',
          field: 'id',
          align: 'left',
        },
        {
          name: 'valid_database.name',
          label: 'Type',
          field: row => `${row.valid_database.name}`,
          align: 'left',
        },
        {
          label: 'Name',
          field: 'name',
          align: 'left'
        },
        {
          label: 'Host',
          field: 'host',
          align: 'left',
        },
        {
          label: 'User',
          field: 'username',
          align: 'left'
        },
        {
          label: 'Port',
          field: 'port',
          align: 'left'
        },
        {
          name: 'password',
          label: 'Password',
          field: 'password',
          align: 'center',
          format: (value, row) => value
        },
        {
          name: 'action',
          label: 'Actions',
          field: 'Action',
          align: 'center',
          sortable: false
        },
        /*{
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'left',
          sortable: true
        }*/
      ]
    }
  },
  mounted() {
    this.getDatabases()
    this.getValidDatabases()
  }
})
</script>
