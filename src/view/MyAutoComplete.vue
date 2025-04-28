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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AutoComplete from "primevue/autocomplete"; // correct import
import { getUserDetails } from "../service/UserData";

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
</script>
