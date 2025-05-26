<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, computed } from "vue";
import { Dialog, Toast } from "primevue";
import StudentTable from "../../components/tables/StudentTable.vue";
import { AutoComplete } from "primevue";
import { getUserDetails } from "../../service/UserData";
import MyButton from "../../components/UI/MyButton.vue";
import Registration from "../../components/from/Registration.vue";
import UserUpdateForm from "../../components/from/UserUpdateForm.vue";
import { exportPDFs } from "../../service/PDFExportService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DataView from "../../components/UI/DataView.vue";

const { users, totalRecords, userData, updateUser } = getUserDetails();
const selectUser = ref<any>(null);
const showDialog = ref(false);
const showDetails = ref(false);
const updateDialog = ref(false);
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
const updateSuccess = () => {
  updateDialog.value = false;
  loadData(initialLoadEvent);
};
const updateDialogClose = () => {
  updateDialog.value = false;
};
const backMain = () => {
  showDetails.value = false;
};
const handleUpdate = (row: any) => {
  // updateDialog.value = true;
  showDetails.value = true;
  selectUser.value = row;
};
const handleBlock = async (row: any) => {
  const blockUser = reactive({
    ...row,
    status: false,
  });
  await updateUser(blockUser);
  await nextTick();
  loadData(initialLoadEvent);
};
const handleUnblock = async (row: any) => {
  const blockUser = reactive({
    ...row,
    status: true,
  });
  await updateUser(blockUser);
  await nextTick();
  loadData(initialLoadEvent);
};
const showDialogToggle = () => {
  showDialog.value = false;
};
const exportPDF = () => {
  const doc = new jsPDF();

  const columns = [
    { header: "Name", dataKey: "fullName" },
    { header: "Email", dataKey: "email" },
    { header: "Country", dataKey: "country" },
    { header: "District", dataKey: "district" },
    { header: "Metro", dataKey: "rmcMc" },
    { header: "Ward Number", dataKey: "wardNo" },
  ];
  const rows = users.value.map((u) => ({
    fullName: u.fullName,
    email: u.email,
    country: u.address?.country,
    district: u.address?.district,
    rmcMc: u.address?.rmcMc,
    wardNo: u.address?.wardNo,
  }));

  doc.setFontSize(18);
  doc.text("User Details", 105, 20, { align: "center" });
  autoTable(doc, {
    columns: columns,
    body: rows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] },
    margin: { top: 25 },
  });
  doc.save("users.pdf");
};

const availableColumns = ref([
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "address.country", label: "Country" },
  { key: "address.district", label: "District" },
  { key: "address.rmcMc", label: "RMC/MC" },
  { key: "address.wardNo", label: "Ward No" },
]);
const columnOrder = ref([]);
const tableName = ref("Users");

const paperSize = ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "atm"];
const orientation = ["portrait", "landscape"];

const selectedSize = ref("a4");
const selectedOrientation = ref("portrait");
const options1 = ref([]);
const options2 = ref([]);

// Query function for suggestions:
function onPaperSize(event) {
  const query = event.query?.toLowerCase() ?? "";
  options1.value = paperSize.filter((city) =>
    city.toLowerCase().includes(query)
  );
}
function onOrientation(event) {
  const query = event.query?.toLowerCase() ?? "";
  options2.value = orientation.filter((city) =>
    city.toLowerCase().includes(query)
  );
}

// defineProps();
const currentView = computed(() =>
  showDetails.value ? DataView : StudentTable
);

// computed props to bind
const currentProps = computed(() => {
  if (showDetails.value) {
    return { users: selectUser.value };
  }
  return {
    filters: filters.value,
    value: users.value,
    totalRecords: totalRecords.value,
    loading: loading.value,
    rows: pageSize.value,
  };
});

async function downloadPdf() {
  exportPDFs(users.value, selectedSize.value, selectedOrientation.value);
}

onMounted(async () => {
  loadData(initialLoadEvent);
  loading.value = false;
  if (columnOrder.value.length === 0) {
    columnOrder.value = availableColumns.value.map((c) => c.key);
  }
});
</script>

<template>
  <div>
    <div
      class="flex justify-between m-4 pr-8 pl-4 p-1 mb-4 rounded-lg bg-white shadow-md"
    >
      <div>
        <MyButton label="Add" color="contrast" @click="showDialog = true" />
      </div>
      <div class="flex gap-2">
        <AutoComplete
          id="city"
          v-model="selectedSize"
          :suggestions="options1"
          @complete="onPaperSize"
          dropdown
          placeholder="Size"
          class="w-25 h-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <MyButton label="PDF" color="success" @click="downloadPdf" />
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

    <Dialog
      v-model:visible="updateDialog"
      modal
      header="Update Student"
      class="w-[85vw] md:w-[50vw] rounded-2xl shadow-lg"
    >
      <UserUpdateForm
        :users="selectUser"
        @success="updateSuccess"
        @close="updateDialogClose"
      />
    </Dialog>

    <!-- <DataView v-if="showDetails" :users="selectUser" @back="backMain" />
    <StudentTable
      v-else
      v-model:filters="filters"
      :value="users"
      :total-records="totalRecords"
      :loading="loading"
      :rows="pageSize"
      @lazy="loadData"
      @edit="handleUpdate"
      @block="handleBlock"
      @unBlock="handleUnblock"
    /> -->

    <keep-alive>
      <component
        :is="currentView"
        v-bind="currentProps"
        @back="backMain"
        @lazy="loadData"
        @edit="handleUpdate"
        @block="handleBlock"
        @unBlock="handleUnblock"
      />
    </keep-alive>

    <Toast />
  </div>
</template>
