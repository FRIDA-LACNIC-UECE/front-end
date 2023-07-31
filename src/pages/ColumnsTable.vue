<template>
  <q-card class="q-pa-lg">
    <q-card-section>
      <div class="text-h6 text-grey-8">
        Columns
        <q-btn label="Protect Data" class="float-right text-capitalize shadow-3" color="primary" icon="key"
          @click="this.addAnonymizationColumns()" :disable="!isAnonymizationSelected" />
      </div>
      <div>
        <text-subtitle>Select a Anonymization type for each column and click on Protect Data button.</text-subtitle>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table :rows="columnsList" :columns="columnsColumns" separator="none" :rows-per-page-options="[0]">
        <template v-slot:body-cell-anonType="props">
          <q-select v-model="props.row.anonymization" clearable :options="anonymizationTypeList" :dense="true"
            :options-dense="true" />
        </template>
      </q-table>
    </q-card-section>

  </q-card>
 
</template>

<script>
const columnsColumns = [
  {
    label: "Name",
    field: "name",
    align: "left",
  },
  {
    label: "Data Type",
    field: "type",
    align: "left",
  },
  {
    label: "Anonymization Type",
    name: "anonType",
    align: "left",
  },
];
import { defineComponent, ref } from "vue";
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Loading, Notify } from "quasar";


export default defineComponent({
  name: "columnsTable",
  computed: {
    ...mapGetters("auth", ["getToken"]),
    //if some anonymization technique is selected, the button is activated
    isAnonymizationSelected() {
      return this.columnsList.some(item => item.anonymization !== null);
    },
  },
  methods: {

    checkSelectedDatabase() {

      console.log("teste")
      console.log(this.databaseID)
      console.log(this.tableID)
      if (!this.databaseID || !this.tableID) {
        Notify.create({
          type: "negative",
          message: "You need to select a database to procced",
          timeout: 2000,
        });
        this.$router.push("/client/anonymization/databases");
      } else {
        this.getColumnsList()
        this.getAnonymizationList()
      }
    },
    returnTables() {
      this.$router.push({ name: "anonymitazation-table-picker", params: { data: this.databaseID } })
    },
    getColumnsList() {
      if (!this.getToken) return;
      Loading.show();
      api
        .get(`database/${this.databaseID}/table/${this.tableID}/columns`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          Loading.hide();
          this.columnsList = response.data.table_columns;
          //add new property to columnsList to anonymization
          this.columnsList.forEach((dic) => (dic["anonymization"] = null));
          console.log("columns" + JSON.stringify(this.columnsList))
        }).catch(function (err) {
          Loading.hide()
        });
    },
    getAnonymizationList() {
      if (!this.getToken) return;
      api
        .get("./anonymization_type", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          this.anonymizationItems = response.data.items
          this.anonymizationTypeList = this.anonymizationItems.map((anonItem) => anonItem.name)
          console.log(this.anonymizationItems)
        })
    },
    //This method is for adding arrays of columns to each anonymization id in a table called Anonymization Records.
    addAnonymizationColumns() {
      //This loop is for sending one columns array for each anonymization type by id.
      for (var id = 1; id < 8; id++) {
        //Find anonymization by id.
        const anonymization = this.anonymizationItems.find(
          (anonymization) => anonymization.id === id
        );
        console.log("ANONYMIZATION" + anonymization)
        //Get all columns and put on a array to send to Anonymization Records table.
        console.log("AQQQ" + this.columnsList.name)
        var columnsToRecord = this.columnsList
          .filter((column) => column.anonymization === anonymization.name)
          .map((column) => column.name);
        this.postAnonymizationData(columnsToRecord, id);
      }
      this.encryptAndAnonymizeData()
    },
    postAnonymizationData(columns, id) {
      if (!this.getToken) return
      console.log("Colunas para anonimizar: " + columns + "\ Id da anonymizacao: num " + id)

      const data = {
        database_id: parseInt(this.databaseID),
        anonymization_type_id: id,
        table_id: parseInt(this.tableID),
        columns: columns
      };
      console.log("data: " + data)
      api
        .post("/anonymization_record", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        }).then((response) => {
          console.log(response.data);
        })

    },
    async encryptAndAnonymizeData() {
      try {
        const encryptionResponse = await this.postEncryptData();
        console.log(encryptionResponse); 

        this.postAnonymizeData();



      } catch (error) {
        console.error("An error occurred during encryption or anonymization:", error);
        // Handle the error if needed
      }
    },

    postEncryptData() {
      if (!this.getToken) return Promise.reject("No token available");
      console.log(this.getToken)

      return api.post(`encryption/database/${this.databaseID}/table/${this.tableID}`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
      });
    },

    postAnonymizeData() {
      this.returnTables()
      api.post(`anonymization/database/${this.databaseID}/table/${this.tableID}`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
      }).then((response) => {
        
      }).catch(function (err) {
      })
    }
  },
  data() {
    return {
      columnsColumns,
      columnsList: [],
      progressDialog: ref(false),
      selectedTable: null,
      anonymizationTypeList: [],
      anonymizationItems: [],
      anonymizationRecord: null

    };
  },
  created() {
    this.databaseID = this.$route.params.databaseID;
    this.tableID = this.$route.params.tableID
    this.checkSelectedDatabase()
  }
});
</script>
