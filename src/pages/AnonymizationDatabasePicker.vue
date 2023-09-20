<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" to="/client/home" />
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
        <template  name="props-show-password" v-slot:body-cell-password="props">
            <q-td :props="props">
            <div class="absolute-center q-mr-md" >
              {{ props.row.showPassword ? (props.row.password ? props.row.password : 'EMPTY') : '*******' }}
              <q-btn color="grey" size="sm" class="q-ml-sm" flat dense v-if="props.row.password !== null"
                v-bind:icon="props.row.showPassword ? 'visibility_off' : 'visibility'"
                @click="toggleShowPassword(props.row)" />
              <q-tooltip>Show Password</q-tooltip>
            </div>
            </q-td>
          </template>

      </q-table>

    </q-card-section>
    <div class="q-mt-md row">
      <q-btn color="primary col grow" :disabled="!isSelected()" @click="shareData(selected[0].id)">Continue</q-btn>
    </div>
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
    isSelected() {
      return this.selected.length != 0
    },
    shareData(selected_id) {
      console.log(this.testDatabaseConnection)
      // if(this.testDatabaseConnection(selected_id) == 200){
        this.$router.push({ name: "anonymitazation-table-picker", params: { data: selected_id } })
      // } else {
      //   Notify.create({
      //         type: "negative",
      //         message: "Oops! Something went wrong. Please try again later.",
      //         timeout: 2000,
      // });
      // }
    },
    testDatabaseConnection(selected_id) {
      if (!this.getToken) return
      Loading.show()
      api.post(`/database/${selected_id}/test_database_connection`, {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        Loading.hide()
        console.log(response.response.status)
        return response.response.status
      })
      .catch(function (err) {
        Loading.hide()
        console.log(err.response.status)
        return err.response.status
      })
    },
    getDatabases() {
      if (!this.getToken) return
      Loading.show()
      api.get('/database', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.databases = response.data.items
        Loading.hide()
      })
      .catch(function (err) {
          Loading.hide()
          const status = err.response.status
          if (status === 401) {
          Notify.create({
            type: "negative",
            message: "Your login token is invalid! Try again later.",
            timeout: 2000
          });
        } else {
          Notify.create({
            type: "negative",
            message: "Oops! Something went wrong. Please try again later.",
            timeout: 2000,
          });
        }
        });
    },
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
        }
      ],
      databases: []
    }
  },
  mounted() {
    this.getDatabases()
  }
})
</script>
