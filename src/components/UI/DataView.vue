<template>
  <div class="m-3">
    <div>
      <MyButton label="Back" color="contrast" @click="handleBack" />
    </div>
    <form @submit.prevent="handleUpdate">
      <div class="grid grid-cols-2 gap-4">
        <div>
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
              <InputText
                id="fullName"
                type="text"
                class="!w-full !p-3 !h-9 !border !rounded-lg"
                placeholder="Update Full Name"
                v-model="user.fullName"
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
              <InputText
                id="email"
                type="text"
                class="!w-full !p-3 !h-9 !border !rounded-lg"
                readonly
                :value="user.email"
              />
            </div>
          </div>
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
              <InputText
                id="country"
                type="text"
                class="!w-full !p-3 !h-9 !border !rounded-lg"
                placeholder="Update Country"
                v-model="user.address.country"
              />
              <span v-if="errors.country" class="text-red-500 text-sm">{{
                errors.country
              }}</span>
            </div>
          </div>
        </div>
        <div>
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
              <InputText
                id="district"
                type="text"
                class="!w-full !p-3 !h-9 !border !rounded-lg"
                placeholder="Update District"
                v-model="user.address.district"
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
                Municipality:
              </label>
            </div>
            <div class="mb-3">
              <InputText
                id="rmcMc"
                type="text"
                class="!w-full !p-3 !h-9 !border !rounded-lg"
                placeholder="Update Municipality"
                v-model="user.address.rmcMc"
              />
              <span v-if="errors.rmcMc" class="text-red-500 text-sm">{{
                errors.rmcMc
              }}</span>
            </div>
          </div>
          <div>
            <div class="mb-1">
              <label
                for="wardNo"
                class="block text-base font-medium text-gray-700 font-medium"
              >
                Municipality:
              </label>
            </div>
            <div class="mb-3">
              <InputNumber
                id="wardNo"
                class="!w-full !h-9 !rounded-lg"
                placeholder="Update Ward Number"
                v-model="user.address.wardNo"
              />
              <span v-if="errors.wardNo" class="text-red-500 text-sm">{{
                errors.wardNo
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <MyButton label="Update" color="contrast" type="submit" />
        <!-- <MyButton label="Cancel" color="secondary" @click="handleClose" /> -->
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { InputText, InputNumber } from "primevue";
import MyButton from "../UI/MyButton.vue";
import { getUserDetails } from "../../service/UserData";
import TableRowButton from "./TableRowButton.vue";

const { updateUser } = getUserDetails();
const errors = reactive({});

const props = defineProps<{ users: any }>();
const user = reactive({
  fullName: "",
  email: "",
  address: {
    country: "",
    district: "",
    rmcMc: "",
    wardNo: 0,
  },
  ...props.users,
});

const validateUserDetails = () => {
  errors.fullName = user.fullName ? "" : "Full name is required";
  errors.country = user.address.country ? "" : "Country is required";
  errors.district = user.address.district ? "" : "District is required";
  errors.rmcMc = user.address.rmcMc ? "" : "Municipality is required";
  errors.wardNo =
    user.address.wardNo > 0 ? "" : "Valid ward number is required";

  return !Object.values(errors).some((error) => error);
};

const handleUpdate = async () => {
  if (!validateUserDetails()) {
    return;
  }
  console.log(user);

  await updateUser(user);
  emit("success");
};

const emit = defineEmits(["success", "close", "back"]);

const handleClose = () => {
  emit("close");
};

const handleBack = () => {
  emit("back");
};
</script>
