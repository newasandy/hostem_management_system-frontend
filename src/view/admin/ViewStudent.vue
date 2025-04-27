<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import { Dialog, Toast } from "primevue";
import StudentTable from "../../components/tables/StudentTable.vue";
import { getUserDetails } from "../../service/UserData";
import MyButton from "../../components/UI/MyButton.vue";
import Registration from "../../components/from/Registration.vue";

const { users, totalRecords, userData } = getUserDetails();

const showDialog = ref(false);

const loading = ref(false);
const filters = ref({
  fullName: { value: null, matchMode: "contains" },
  email: { value: null, matchMode: "contains" },
  "address.country": { value: null, matchMode: "contains" },
  "address.district": { value: null, matchMode: "contains" },
  "address.rmcMc": { value: null, matchMode: "contains" },
  "address.wardNo": { value: null, matchMode: "contains" },
});
const pageSize = ref(10);

async function loadData(event: LazyLoadEvent) {
  loading.value = true;

  try {
    const filterMap = {};
    const exactFilterMap = { "roles.userTypes": "USER" };

    Object.entries(event.filters || {}).forEach(([field, meta]) => {
      if (meta?.value !== null && meta?.value !== undefined) {
        const processedField = field.replace(/\./g, "_");

        if (meta.matchMode === "equals") {
          exactFilterMap[processedField] = meta.value;
        } else {
          filterMap[processedField] = meta.value.toString();
        }
      }
    });

    const requestBody = {
      first: event.first || 0,
      pageSize: event.rows || 10,
      sortField: event.sortField || "",
      sortOrder: event.sortOrder === 1 ? "ASC" : "DESC",
      filters: filterMap,
      exactFilters: exactFilterMap,
      unAllocatedUser: false,
    };

    await userData(requestBody);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
}

const initialLoadEvent = {
  first: 0,
  rows: pageSize.value,
  sortField: null,
  sortOrder: null,
  filters: {},
};

onMounted(async () => {
  loadData(initialLoadEvent);
  loading.value = false;
});
const showDialogToggle = () => {
  showDialog.value = false;
};
</script>

<template>
  <div>
    <div
      class="flex justify-between m-4 pr-8 pl-4 p-1 mb-4 rounded-lg bg-white shadow-md"
    >
      <div>
        <MyButton label="Add" color="contrast" @click="showDialog = true" />
      </div>
    </div>
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Add New Student"
      class="w-[85vw] md:w-[35vw] rounded-2xl shadow-lg"
    >
      <Registration
        @success="(param) => loadData(param)"
        @dailogToggle="showDialogToggle"
      />
    </Dialog>

    <StudentTable
      v-model:filters="filters"
      :value="users"
      :total-records="totalRecords"
      :loading="loading"
      :rows="pageSize"
      @lazy="loadData"
    />
    <Toast />
  </div>
</template>
