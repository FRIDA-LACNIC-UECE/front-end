<template>
  <div class="q-pa-md" v-show='!this.$q.loading.isActive'>
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Users
          <q-btn label="Add" class="float-right text-capitalize shadow-3" color="primary" icon="person_add"
            to='/admin/users/new' />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table :rows="users" :columns="columns" row-key="name" class="col">
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
              <q-btn color="green-7" icon="edit" size="sm" flat dense />
              <q-btn color="red" icon="delete" size="sm" class="q-ml-sm" flat dense
                @click="submitDelete(props.row.email)" />
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
    </q-card>
  </div>
</template>

<script>
import { Notify, Dialog, Loading } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'Users',
  computed: {
    ...mapGetters('auth', ['getToken']),
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    getUsers() {
      if (!this.getToken) return
      Loading.show()
      api.get('/getUsers', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.users = response.data
        this.users.forEach((value, index) => {
          value.is_admin = value.is_admin == 1 ? "Yes" : "No"
        })
        Loading.hide()
      }).catch(err => {
        console.log(err)
      })
    },
    submitDelete(email) {
      if (!this.getToken) return
      Dialog.create({
        title: 'Delete User',
        message: 'Do you really want to delete this user?',
        cancel: true
      }).onOk(async () => {
        api.post('/deleteUser', { email: email }, {
          headers: {
            Authorization: `Bearer ${this.getToken}`
          }
        }).then(response => {
          Notify.create({
            type: 'positive',
            message: response.data.message,
            timeout: 1000
          })
          this.users = this.users.filter(element => element.email !== email)
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
      columns: [
        {
          name: 'id',
          label: 'ID',
          field: 'id',
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
          name: 'email',
          label: 'Email',
          field: 'email',
          align: 'left',
          sortable: true
        },
        {
          name: 'is_admin',
          label: 'Admin',
          field: 'is_admin',
          align: 'left',
          sortable: true
        },
        { name: 'action', label: 'Actions', field: 'Action', sortable: false, align: 'center' }
      ],
      users: []
    }
  },
  mounted() {
    this.getUsers()
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
