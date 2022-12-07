<template>
  <div class="q-pa-md" v-show='!this.$q.loading.isActive'>
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          After Anonymization
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table :rows="database" :columns="columns" row-key="name" class="col" :pagination="{ rowsPerPage: 11 }">
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
    getDatabase() {
      Loading.show()
      api.get('/getDatabase2', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.database = response.data
        Loading.hide()
      }).catch(err => {
        console.log(err)
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
          name: '_0',
          label: 'Column 1',
          field: '_0',
          align: 'left',
          sortable: true
        },
        {
          name: '_1',
          label: 'Column 2',
          field: '_1',
          align: 'left',
          sortable: true
        },
        {
          name: '_2',
          label: 'Column 3',
          field: '_2',
          align: 'left',
          sortable: true
        },
        {
          name: '_3',
          label: 'Column 4',
          field: '_3',
          align: 'left',
          sortable: true
        },
        {
          name: '_4',
          label: 'Column 5',
          field: '_4',
          align: 'left',
          sortable: true
        },
        {
          name: '_5',
          label: 'Column 6',
          field: '_5',
          align: 'left',
          sortable: true
        },
      ],
      database: []
    }
  },
  mounted() {
    this.getDatabase()
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
