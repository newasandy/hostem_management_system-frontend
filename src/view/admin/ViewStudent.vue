<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import { Button, Dialog, Toast } from "primevue";
import StudentTable from "../../components/tables/StudentTable.vue";
import { FilterMatchMode } from "@primevue/core/api";
import { getUserDetails } from "../../service/UserData";
import { roomData } from "../../service/RoomData";
import Rooms from "../../components/tables/Rooms.vue";

const { users, totalRecords, userRole, userData, getUserRole, registerUser } =
  getUserDetails();
const { room, roomTotalRecords, getAvailableRoom } = roomData();

const showDialog = ref(false);

const newUser = reactive({
  fullName: "",
  email: "",
  passwords: "",
  status: true,
  address: {
    country: "",
    district: "",
    rmcMc: "",
    wardNo: null as number | null,
  },
});
const selectRoom = ref<any>(null);
const selectRole = ref<{ id: number; roles: string } | null>(null);

watch(selectRole, (val) => (newUser.role = val));
async function handleSave() {
  const payload = {
    ...newUser,
    room: selectRoom.value ? selectRoom.value : null,
    role: selectRole.value ? selectRole.value : null,
  };
  const ok = await registerUser(payload);
  loadData(initialLoadEvent);
}

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

const loading2 = ref(false);
const filters2 = ref({
  roomNumber: { value: null, matchMode: "contains" },
});
const roompageSize = ref(5);

const loadAvailableRoomData = async (event: LazyLoadEvent) => {
  loading2.value = true;
  try {
    const filterMap = {};
    const exactFilterMap = {};

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
      pageSize: event.rows || 5,
      sortField: event.sortField || "",
      sortOrder: event.sortOrder === 1 ? "ASC" : "DESC",
      filters: filterMap,
      exactFilters: exactFilterMap,
      unAllocatedUser: true,
    };

    await getAvailableRoom(requestBody);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

const initialLoadEvent = {
  first: 0,
  rows: pageSize.value,
  sortField: null,
  sortOrder: null,
  filters: {},
};

onMounted(async () => {
  loadData(initialLoadEvent);
  loadAvailableRoomData(initialLoadEvent);
  await getUserRole();
  loading.value = false;
  loading2.value = false;
});

function roomAction(row: any) {
  selectRoom.value = row;
  console.log("action on row:", row);
  console.log(newUser.role);
}
</script>

<template>
  <div>
    <div
      class="flex justify-between m-4 pr-8 pl-4 p-1 mb-4 rounded-lg bg-white shadow-md"
    >
      <div>
        <Button
          label="Success"
          severity="contrast"
          @click="showDialog = true"
        />
      </div>
    </div>
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Add New Student"
      class="w-[90vw] md:w-[60vw] rounded-2xl shadow-lg"
    >
      <form @submit.prevent="handleSave">
        <div class="flex gap-2">
          <div>
            <input
              v-model="newUser.fullName"
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Full Name"
            />
            <input
              v-model="newUser.email"
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Full Email"
            />
            <input
              v-model="newUser.passwords"
              type="password"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Full Password"
            />

            <select
              v-model="selectRole"
              class="w-full mb-3 pl-3 h-9 border border-green-400 rounded-lg"
            >
              <option value="null" disabled>Select an option</option>
              <option v-for="role in userRole" :key="role.id" :value="role">
                {{ role.roles }}
              </option>
            </select>
          </div>

          <div>
            <input
              v-model="newUser.address.country"
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Country"
            />
            <input
              v-model="newUser.address.district"
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter District"
            />
            <input
              v-model="newUser.address.rmcMc"
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Municipality"
            />
            <input
              v-model="newUser.address.wardNo"
              type="number"
              min="1"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Ward Number"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button
            type="submit"
            label="Save"
            @click="showDialog = false"
            severity="contrast"
            class="mt-4 w-20"
          />
          <Button
            label="Close"
            @click="showDialog = false"
            severity="secondary"
            class="mt-4 w-20"
          />
        </div>
      </form>
      <div>
        <Rooms
          v-model:filters="filters2"
          :value="room"
          :total-records="roomTotalRecords"
          :loading="loading"
          :rows="pageSize"
          @lazy="loadAvailableRoomData"
          @action="roomAction"
        />
      </div>
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
