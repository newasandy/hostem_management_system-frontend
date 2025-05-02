<template>
  <div class="card flex justify-center">
    <AutoComplete
      v-model="selectedUser"
      :suggestions="suggestions"
      @complete="search"
      optionLabel="fullName"
      placeholder="Search users"
      :loading="loading"
      :completeOnFocus="true"
    />
  </div>
  <div class="w-xl">
    <DependentValidation />
    <!-- <UserUpdateForm :users="newUser" /> -->
  </div>
  <div class="flex item-center justify-center">
    <Card class="mt-6">
      <template #header>
        <div class="flex justify-center items-center gap-3 p-3">
          <InputNumber v-model="number1" placeholder="Enter number" />
          <InputNumber v-model="number2" placeholder="Enter number" />
          <InputNumber :model-value="result" placeholder="Enter number" />
        </div>
        <div class="font-bold text-center">
          <span> {{ result }} </span>
        </div>
        <div class="flex justify-center gap-6">
          <MyButton label="Add" color="success" @click="handleAdd" />
          <MyButton label="Multiply" color="contrast" @click="handleMulti" />
          <MyButton label="Divide" color="danger" @click="handleDivide" />
          <MyButton label="Check" @click="handleCheck" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { InputNumber } from "primevue";
import AutoComplete from "primevue/autocomplete"; // correct import
import { getUserDetails } from "../service/UserData";
import { Card } from "primevue";
import UserUpdateForm from "../components/from/UserUpdateForm.vue";
import DependentValidation from '../components/from/DependentValidation.vue'

import MyButton from "../components/UI/MyButton.vue";

type User = { fullName: string };

const { users, userData } = getUserDetails();
const loading = ref(false);
const suggestions = ref<User[]>([]);
const selectedUser = ref<User | null>(null); // model holds object
const newUser = ref({
  fullName: "user",
  email: "user@gmail.com",
  passwords: "user1234",
  status: true,
  address: {
    country: "nepal",
    district: "ktm",
    rmcMc: "ktm",
    wardNo: 9,
  },
});
async function search(event: { query: string }) {
  loading.value = true;
  try {
    const requestBody = {
      first: 0,
      pageSize: 5,
      sortField: "fullName",
      sortOrder: "ASC",
      filters: { fullName: event.query },
      exactFilters: { "roles.userTypes": "USER" },
      unAllocatedUser: false,
    };

    await userData(requestBody); // fills users.value
    suggestions.value = users.value; // array of { fullName }
  } catch (error) {
    console.error("Error loading users:", error);
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  search({ query: "" });
});

// number calculator
const number1 = ref<number | null>(null);
const number2 = ref<number | null>(null);
const result = ref<number | null>(null);
const handleAdd = () => {
  result.value = parseFloat(
    ((number1.value ?? 0) + (number2.value ?? 0)).toFixed(2)
  );
};
const handleMulti = () => {
  result.value = parseFloat(
    ((number1.value ?? 0) * (number2.value ?? 0)).toFixed(2)
  );
};
const handleDivide = () => {
  if (number1.value == null || number2.value == null) {
    result.value = 0;
    return;
  }
  result.value = parseFloat((number1.value / number2.value).toFixed(2));
};

const handleCheck = () => {
  console.log(number1.value);
  console.log(number2.value);

  console.log(result.value);
};
</script>
