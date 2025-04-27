<template>
  <form @submit.prevent="handleSave">
    <div v-if="currentStep === 1" class="flex gap-2">
      <div class="w-full">
        <div>
          <div class="mb-1">
            <label
              for="fullName"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Full Name:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="fullName"
              v-model.trim="newUser.fullName"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              :class="errors.fullName ? 'border-red-500' : 'border-green-400'"
              placeholder="Enter Full Name"
            />
            <span v-if="errors.fullName" class="text-red-500 text-sm">{{
              errors.fullName
            }}</span>
          </div>
        </div>

        <div>
          <div class="mb-1">
            <label
              for="email"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Email:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="email"
              v-model.trim="newUser.email"
              type="email"
              class="w-full p-3 h-9 border rounded-lg"
              :class="errors.email ? 'border-red-500' : 'border-green-400'"
              placeholder="Enter Email"
            />
            <span v-if="errors.email" class="text-red-500 text-sm">{{
              errors.email
            }}</span>
          </div>
        </div>

        <div>
          <div class="mb-1">
            <label
              for="password"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Password:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="password"
              v-model.trim="newUser.passwords"
              type="password"
              class="w-full p-3 h-9 border rounded-lg"
              :class="errors.password ? 'border-red-500' : 'border-green-400'"
              placeholder="Enter Password"
            />
            <span v-if="errors.password" class="text-red-500 text-sm">{{
              errors.password
            }}</span>
          </div>
        </div>

        <div>
          <div class="mb-1">
            <label
              for="role"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              User Role:
            </label>
          </div>
          <div class="mb-3">
            <select
              id="role"
              v-model="selectRole"
              class="w-full pl-3 h-9 border rounded-lg"
              :class="errors.role ? 'border-red-500' : 'border-green-400'"
            >
              <option value="null" disabled>Select Role</option>
              <option v-for="role in userRole" :key="role.id" :value="role">
                {{ role.roles }}
              </option>
            </select>
            <span v-if="errors.role" class="text-red-500 text-sm">{{
              errors.role
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Address Details -->
    <div v-if="currentStep === 2" class="flex gap-2">
      <div class="w-full">
        <div>
          <div class="mb-1">
            <label
              for="country"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Country:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="country"
              v-model.trim="newUser.address.country"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              :class="errors.country ? 'border-red-500' : 'border-green-400'"
              placeholder="Enter Country"
            />
            <span v-if="errors.country" class="text-red-500 text-sm">{{
              errors.country
            }}</span>
          </div>
        </div>

        <div>
          <div class="mb-1">
            <label
              for="district"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              District:
            </label>
          </div>
          <div class="mb-3">
            <input
              v-model.trim="newUser.address.district"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              :class="errors.district ? 'border-red-500' : 'border-green-400'"
              placeholder="Enter District"
            />
            <span v-if="errors.district" class="text-red-500 text-sm">{{
              errors.district
            }}</span>
          </div>
        </div>

        <div>
          <div class="mb-1">
            <label
              for="rmcMc"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Metro:
            </label>
          </div>
          <div class="mb-3">
            <input
              v-model.trim="newUser.address.rmcMc"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              :class="errors.rmcMc ? 'border-red-500' : 'border-green-400'"
              placeholder="Enter Municipality"
            />
            <span v-if="errors.rmcMc" class="text-red-500 text-sm">{{
              errors.rmcMc
            }}</span>
          </div>
        </div>

        <div>
          <div class="mb-1">
            <label
              for="role"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Ward Number:
            </label>
          </div>
          <div class="mb-3">
            <input
              v-model.number="newUser.address.wardNo"
              type="number"
              min="1"
              class="w-full p-3 h-9 border rounded-lg"
              :class="errors.wardNo ? 'border-red-500' : 'border-green-400'"
              placeholder="Enter Ward Number"
            />
            <span v-if="errors.wardNo" class="text-red-500 text-sm">{{
              errors.wardNo
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Room Selection -->
    <div v-if="currentStep === 3">
      <div class="mb-3">
        <Rooms
          v-model:filters="filters2"
          :value="room"
          :total-records="roomTotalRecords"
          :loading="loading2"
          :rows="pageSize"
          @lazy="loadAvailableRoomData"
          @action="roomAction"
        />
        <span v-if="errors.room" class="text-red-500 text-sm">{{
          errors.room
        }}</span>
      </div>
    </div>

    <!-- Navigation Controls -->
    <div class="flex justify-between mt-6">
      <div>
        <MyButton
          v-if="currentStep > 1"
          label="Previous"
          color="secondary"
          @click="currentStep--"
        />
      </div>

      <div class="flex gap-3">
        <MyButton
          v-if="currentStep < 3"
          label="Next"
          color="contrast"
          @click="handleNext"
        />

        <MyButton
          v-if="currentStep === 3"
          type="submit"
          label="Save"
          color="contrast"
          @click="showDialog"
        />

        <MyButton
          label="Close"
          @click="
            showDialog();
            resetForm();
          "
          color="secondary"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import MyButton from "../UI/MyButton.vue";
import Rooms from "../tables/Rooms.vue";
import { getUserDetails } from "../../service/UserData";
import { roomData } from "../../service/RoomData";
const { userRole, getUserRole, registerUser } = getUserDetails();
const { room, roomTotalRecords, getAvailableRoom } = roomData();

const currentStep = ref(1);
const errors = reactive({});
const emit = defineEmits(["success", "dailogToggle"]);
const pageSize = ref(5);
const loading2 = ref(false);
const filters2 = ref({
  roomNumber: { value: null, matchMode: "contains" },
});

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

const validateUserDetails = () => {
  errors.fullName = newUser.fullName ? "" : "Full name is required";
  errors.email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
    newUser.email
  )
    ? ""
    : "Invalid email address";
  errors.password =
    newUser.passwords.length >= 6
      ? ""
      : "Password must be at least 6 characters";
  errors.role = selectRole.value ? "" : "Role is required";

  return !Object.values(errors).some((error) => error);
};

const validateAddress = () => {
  errors.country = newUser.address.country ? "" : "Country is required";
  errors.district = newUser.address.district ? "" : "District is required";
  errors.rmcMc = newUser.address.rmcMc ? "" : "Municipality is required";
  errors.wardNo =
    newUser.address.wardNo > 0 ? "" : "Valid ward number is required";

  return !Object.values(errors).some((error) => error);
};

const handleNext = () => {
  let isValid = false;

  if (currentStep.value === 1) {
    isValid = validateUserDetails();
  } else if (currentStep.value === 2) {
    isValid = validateAddress();
  }

  if (isValid) {
    currentStep.value++;
    errors.room = ""; // Reset room error when moving to next step
  }
};

const selectRoom = ref<any>(null);
const selectRole = ref<{ id: number; roles: string } | null>(null);

const resetForm = () => {
  currentStep.value = 1;
  Object.assign(newUser, {
    fullName: "",
    email: "",
    passwords: "",
    address: {
      country: "",
      district: "",
      rmcMc: "",
      wardNo: null,
    },
  });
  selectRole.value = null;
  selectRoom.value = null;
  Object.keys(errors).forEach((key) => delete errors[key]);
};
watch(selectRole, (val) => (newUser.role = val));
async function handleSave() {
  if (!selectRoom.value) {
    errors.room = "Please select a room";
    return;
  }
  const payload = {
    ...newUser,
    room: selectRoom.value ? selectRoom.value : null,
    role: selectRole.value ? selectRole.value : null,
  };
  const ok = await registerUser(payload);
  emit("success", initialLoadEvent);
}

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
    loading2.value = false;
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
  await loadAvailableRoomData(initialLoadEvent);
  await getUserRole();
});

function roomAction(row: any) {
  selectRoom.value = row;
  errors.room = "";
  console.log("action on row:", row);
  console.log(newUser.role);
}

const showDialog = () => {
  emit("dailogToggle");
};
</script>
