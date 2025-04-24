<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { InputText, Button, Dialog } from "primevue";
import StudentTable from "../../components/tables/StudentTable.vue";
import { FilterMatchMode } from "@primevue/core/api";
import { getUserDetails } from "../../service/GetUserDetails";
import { roomData } from "../../service/RoomData";
import Rooms from "../../components/tables/Rooms.vue";

const { user, userData } = getUserDetails();
const { room, getAvailableRoom } = roomData();
const loading = ref(true);
const loading2 = ref(true);
const showDialog = ref(false);

const newUser = reactive({
  fullName: "",
  email: "",
  passwords: null as string | null,
  roleId: null as number | null,
  status: true,
  address: {
    country: "",
    district: "",
    rmcMc: "",
    wardNo: null as number | null,
  },
});
const selectRoom = ref<any>(null);

async function handleSave() {
  try {
    const payload = {
      ...newUser,
      roomId: selectRoom.value ? selectRoom.value.id : null,
    };

    const response = await fetch("/api/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User registered", data);

    // refresh table data
    await userData();
    showDialog.value = false;
  } catch (error) {
    console.error("Registration failed", error);
  }
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const filters2 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  await userData();
  await getAvailableRoom();
  loading.value = false;
  loading2.value = false;
});

function onAction(row: any) {
  console.log("action on row:", row);
}

function roomAction(row: any) {
  selectRoom.value = row;
  console.log("action on row:", row);
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
      <div class="flex justify-end">
        <InputText
          v-model="filters.global.value"
          placeholder="Keyword Search"
          class="p-inputtext-sm"
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
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Full Name"
            />
            <input
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Full Email"
            />
            <input
              type="password"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Full Password"
            />
            <select
              class="w-full mb-3 pl-3 h-9 border border-green-400 rounded-lg"
            >
              <option>Select an option</option>
              <option>ADMIN</option>
              <option>USER</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Country"
            />
            <input
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter District"
            />
            <input
              type="text"
              class="w-full mb-3 p-3 h-9 border border-green-400 rounded-lg"
              placeholder="Enter Municipality"
            />
            <input
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
          :value="room"
          :filters="filters2"
          :loading="loading2"
          @update:filters="filters2 = $event"
          @action="roomAction"
        />
      </div>
    </Dialog>

    <StudentTable
      :value="user"
      :filters="filters"
      :loading="loading"
      @update:filters="filters = $event"
      @action="onAction"
    />
  </div>
</template>
