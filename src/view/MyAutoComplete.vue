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
    <!-- <UserUpdateForm /> -->
  </div>
  <div class="flex item-center justify-center">
    <Card class="mt-6">
      <template #header>
        <div class="flex justify-center items-center gap-3 p-3">
          <input
            v-model="number1"
            type="number"
            class="border border-green-700 rounded-lg h-8 p-1"
            placeholder="Enter number"
          />
          <input
            v-model="number2"
            type="number"
            class="border border-green-700 rounded-lg h-8 p-1"
            placeholder="Enter number"
          />
        </div>
        <div class="font-bold text-center">
          <span> {{ result }} </span>
        </div>
        <div class="flex justify-center gap-6">
          <MyButton label="Add" color="success" @click="handleAdd" />
          <MyButton label="Multiply" color="contrast" @click="handleMulti" />
          <MyButton label="Divide" color="danger" @click="handleDivide" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AutoComplete from "primevue/autocomplete"; // correct import
import { getUserDetails } from "../service/UserData";
import { Card } from "primevue";
import UserUpdateForm from "../components/from/UserUpdateForm.vue";
import MyButton from "../components/UI/MyButton.vue";
import DependentValidation from "../components/from/DependentValidation.vue";

type User = { fullName: string };

const { users, userData } = getUserDetails();
const loading = ref(false);
const suggestions = ref<User[]>([]);
const selectedUser = ref<User | null>(null); // model holds object

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
</script>
