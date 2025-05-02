<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import { Dialog, Toast } from "primevue";
import StudentTable from "../../components/tables/StudentTable.vue";
import { getUserDetails } from "../../service/UserData";
import MyButton from "../../components/UI/MyButton.vue";
import Registration from "../../components/from/Registration.vue";
import UserUpdateForm from "../../components/from/UserUpdateForm.vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const { users, totalRecords, userData, updateUser } = getUserDetails();
const selectUser = ref<any>(null);
const showDialog = ref(false);
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
onMounted(async () => {
  loadData(initialLoadEvent);
  loading.value = false;
});

const handleUpdate = (row: any) => {
  updateDialog.value = true;
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
</script>

<template>
  <div>
    <div
      class="flex justify-between m-4 pr-8 pl-4 p-1 mb-4 rounded-lg bg-white shadow-md"
    >
      <div>
        <MyButton label="Add" color="contrast" @click="showDialog = true" />
      </div>
      <div>
        <MyButton label="PDF" color="success" @click="exportPDF" />
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

    <StudentTable
      v-model:filters="filters"
      :value="users"
      :total-records="totalRecords"
      :loading="loading"
      :rows="pageSize"
      @lazy="loadData"
      @edit="handleUpdate"
      @block="handleBlock"
      @unBlock="handleUnblock"
    />
    <Toast />
  </div>
</template>
