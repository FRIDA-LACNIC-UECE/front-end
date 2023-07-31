<template>
  <q-card class="q-pb-lg q-pt-sm">
    <q-table
      title="Tables"
      :rows="tablesList"
      :columns="tablesColumns"
      separator="none"
      hide-pagination
    >
      <template name="props-anonymized" v-slot:body-cell-anonymized="props">
        <q-td :props="props">
          <span
            :class="{
              'text-red': !props.row.anonymized,
              'text-green-7': props.row.anonymized,
            }"
          >
            {{ props.row.anonymized ? "Anonymized" : "Not Anonymized" }}
          </span>
        </q-td>
      </template>
      <template name="props-encrypted" v-slot:body-cell-encrypted="props">
        <q-td :props="props">
          <span
            :class="{
              'text-red': !props.row.encrypted,
              'text-green-7': props.row.encrypted,
            }"
          >
            {{ props.row.encrypted ? "Encrypted" : "Not Encrypted" }}
          </span>
        </q-td>
      </template>
      <template name="props-action" v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn v-if="props.row.anonymization_progress > 0 || props.row.encryption_progress > 0  "
            label="See Progress"
            @click="this.showProgress(props.row.id)"
            size="sm"
            color="primary"
          ></q-btn>
          <q-btn v-else
            label="Set Anonymization"
            size="sm"
            color="primary"
            @click="setAnonymization(props.row.id)"
          ><q-tooltip>Go to anonymization type selection for each column.</q-tooltip></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>
  <q-dialog v-model="progressDialog" persistent>
    <q-card class="q-ma-sm">
      <q-card-section  class="row items-center q-pb-sm" >
        <div class="text-h6">Data Protection Progress</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup @click="closeProgresDialog"/>
      </q-card-section>
      <q-card-section  class="q-pa-md row items-start q-gutter-md" >
        
        <div class="column items-center" >
          <div class="col">Encryption Progress</div>
          <div class="col">
            <q-circular-progress :value="this.encryptionProgress" size="50px" color="primary" class="q-ma-md" />
          </div>
          <div  class="col">{{ this.encryptionProgress }} %</div>
        </div>
        <div class="column items-center q-mr-md">
            <div  class="col">Anonymization Progress</div>
          <div class="col">
            <q-circular-progress :value="this.anonymizationProgress" size="50px" color="primary" class="q-ma-md" />
          </div>
          <div  class="col">{{ this.anonymizationProgress }} %</div>
        </div >
      </q-card-section>
    </q-card>

  </q-dialog>
</template>

<script>
const tablesColumns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "center",
  },
  {
    label: "Name",
    field: "name",
    align: "center",
  },
  {
    name: "encrypted",
    label: "Encryptation Status",
    field: "encrypted",
    align: "center",
  },
  {
    name: "anonymized",
    label: "Anonymization Status",
    field: "anonymizated",
    align: "center",
  },
  {
    name: "action",
    align: "center",
  },
];
import { defineComponent, ref } from "vue";
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Loading, Notify } from "quasar";


export default defineComponent({
  name: "anonymitazation-table-picker",
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    checkSelectedDatabase() {
      console.log("teste")
      if (!this.databaseID) {
        Notify.create({
          type: "negative",
          message: "You need to select a database to procced",
          timeout: 2000,
        });
        this.$router.push("/client/anonymization/databases");
      } else {
        this.getTableList();
      }
    },
    showProgress(table) {
      this.selectedTable = table
      this.progressDialog = true
      this.anonymizationProgressUpdate();
      this.updateIntervalAnonymization = setInterval(this.anonymizationProgressUpdate, 1000);
      this.encryptionProgressUpdate();
      this.updateIntervalEncryption = setInterval(this.encryptionProgressUpdate, 1000);
    },
    closeProgresDialog(){
      clearInterval(this.updateIntervalAnonymization);
      clearInterval(this.updateIntervalEncryption);
      this.selectedTable = ref(null)
      this.getTableList()
    },
    getTableList() {
      if (!this.getToken) return;
      Loading.show();
      api
        .get(`database/${this.databaseID}/table`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          Loading.hide();
          this.tablesList = response.data.items;
        }).catch(function (err) {
        Loading.hide()
      });;
    },
    anonymizationProgressUpdate() {
      if (!this.getToken) return;
      api
        .get(`anonymization/database/${this.databaseID}/table/${this.selectedTable}/progress`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          this.anonymizationProgress = response.data.progress
        }).catch(function (err) {
        Loading.hide()
      });;
    },
    encryptionProgressUpdate() {
      if (!this.getToken) return;
      api
        .get(`encryption/database/${this.databaseID}/table/${this.selectedTable}/progress`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          this.encryptionProgress = response.data.progress
        }).catch(function (err) {
        Loading.hide()
      });;
    },
    setAnonymization(tableID) {
      this.$router.push({ name: "columnsTable", params: { databaseID: this.databaseID, tableID: tableID } })
    }
  },
  data() {
    const selected = ref([]);
    return {
      tablesColumns,
      selected,
      tablesList: [],
      anonymizationProgress: 0,
      encryptionProgress: 0,
      progressDialog: ref(false),
      selectedTable: null
    };
  },
  created() {
    this.databaseID = this.$route.params.data;
    this.checkSelectedDatabase()
    
  }
});
</script>
