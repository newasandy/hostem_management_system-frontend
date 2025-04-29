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
              :required="true"
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
              :disabled="!newUser.fullName"
              placeholder="Enter Email"
              :required="true"
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
              :disabled="!newUser.email"
              placeholder="Enter Password"
              :required="true"
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
              :disabled="!newUser.passwords"
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
        <div v-if="selectRole?.roles === 'ADMIN'">
          <div class="mb-1">
            <label
              for="citizen"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Citizenship number:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="citizen"
              v-model.trim="newUser.citizen"
              type="number"
              min="1"
              class="w-full p-3 h-9 border rounded-lg"
              :disabled="!selectRole"
              placeholder="Enter Citizenship Number"
              :required="selectRole?.roles === 'ADMIN'"
            />
            <span v-if="errors.citizen" class="text-red-500 text-sm">{{
              errors.citizen
            }}</span>
          </div>
        </div>
        <div v-if="selectRole?.roles === 'USER'">
          <div class="mb-1">
            <label
              for="phone"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Phone number:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="phone"
              v-model.trim="newUser.phone"
              type="number"
              min="1"
              class="w-full p-3 h-9 border rounded-lg"
              :disabled="!selectRole"
              placeholder="Enter Phone Number"
              :required="selectRole?.roles === 'USER'"
            />
            <span v-if="errors.phone" class="text-red-500 text-sm">{{
              errors.phone
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <div class="flex gap-3">
        <MyButton
          type="submit"
          label="Save"
          color="contrast"
          @click="validateUserDetails"
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
import { getUserDetails } from "../../service/UserData";
const { userRole, getUserRole } = getUserDetails();

const currentStep = ref(1);
const errors = reactive({});
const emit = defineEmits(["success", "dailogToggle"]);

const newUser = reactive({
  fullName: "",
  email: "",
  passwords: "",
  citizen: null,
  phone: null,
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
  if (selectRole.value?.roles === "ADMIN") {
    newUser.phone = null;
    errors.citizen = newUser.citizen ? null : "Require citizen";
  }
  if (selectRole.value?.roles === "USER") {
    newUser.citizen = null;
    errors.phone = newUser.phone ? null : "Require Phone";
  }

  return !Object.values(errors).some((error) => error);
};

const selectRoom = ref<any>(null);
const selectRole = ref<{ id: number; roles: string } | null>(null);

const resetForm = () => {
  currentStep.value = 1;
  Object.assign(newUser, {
    fullName: "",
    email: "",
    passwords: "",
    citizen: null,
    phone: null,
  });
  selectRole.value = null;
  selectRoom.value = null;
  Object.keys(errors).forEach((key) => delete errors[key]);
};
watch(selectRole, (val) => (newUser.role = val));


async function handleSave() {
  if (!validateUserDetails()) {
    console.log("here");
    return;
  }
  console.log(newUser.fullName);
  console.log(newUser.email);
  console.log(newUser.passwords);
  console.log(newUser.citizen);
  console.log(newUser.phone);
}

onMounted(async () => {
  await getUserRole();
});

const showDialog = () => {
  emit("dailogToggle");
};
</script>
