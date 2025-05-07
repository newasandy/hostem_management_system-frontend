<template>
  <div>
    <!-- <AutoCompleteDemo /> -->
  </div>
  <DataView />
  <AutoComplete
    v-model="selectedUser"
    :suggestions="lazySuggestions"
    @complete="search"
    optionLabel="fullName"
    placeholder="Search users"
    :loading="loading"
    :completeOnFocus="true"
    :scrollHeight="'300px'"
    :virtualScrollerOptions="virtualScrollerOptions"
  >
    <!-- item template: show skeleton for null, name otherwise -->
    <template #item="{ item, options }">
      <div
        class="p-2"
        :class="{ 'bg-surface-100': options.odd }"
        style="height: 50px; display: flex; align-items: center"
      >
        <Skeleton v-if="!item" width="80%" height="1rem" />
        <span v-else>{{ item.fullName }}</span>
      </div>
    </template>
  </AutoComplete>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { VirtualScrollerLazyEvent } from "primevue";
import AutoComplete from "primevue/autocomplete";
import Skeleton from "primevue/skeleton";

import AutoCompleteDemo from "./AutoCompleteDemo.vue";
import { getUserDetails } from "../service/UserData";
import DataView from "../components/UI/DataView.vue";

type User = { fullName: string };

// composable: users.value (last fetch), totalRecords.value, userData() API call
const { users, userData, totalRecords } = getUserDetails();

const loading = ref(false);
const selectedUser = ref<User | null>(null);
const lastQuery = ref("");
const pageSize = 10;

// 1) placeholder array of length totalRecords
const lazySuggestions = ref<Array<User | null>>([]);
watch(totalRecords, (count) => {
  lazySuggestions.value = Array(count).fill(null);
});

// 2) initial search: reset placeholder + load first page
async function search(e: { query: string }) {
  loading.value = true;
  lastQuery.value = e.query;
  lazySuggestions.value = Array(totalRecords.value).fill(null);
  await loadPage(0);
  loading.value = false;
}

// 3) fetch page and splice into placeholder
async function loadPage(page: number) {
  const first = page * pageSize;
  await userData({
    first,
    pageSize,
    sortField: "fullName",
    sortOrder: "ASC",
    filters: { fullName: lastQuery.value },
    exactFilters: { "roles.userTypes": "USER" },
    unAllocatedUser: false,
  });
  users.value.forEach((u, i) => {
    lazySuggestions.value[first + i] = u;
  });
}

// 4) onLazyLoad fires when scroll reaches un‑loaded slots
// function onLazyLoad(e: VirtualScrollerLazyEvent) {
//   const first = e.first!;
//   const page = Math.floor(first / pageSize);
//   if (lazySuggestions.value[first] == null) {
//     loading.value = true;
//     loadPage(page).finally(() => (loading.value = false));
//   }
// }

const loadingPages = new Set<number>();

function onLazyLoad(e: VirtualScrollerLazyEvent) {
  const first = e.first!;
  const last = e.last!;
  const startPage = Math.floor(first / pageSize);
  const endPage = Math.floor(last / pageSize);

  for (let page = startPage; page <= endPage; page++) {
    const pageStartIndex = page * pageSize;
    if (
      lazySuggestions.value[pageStartIndex] == null &&
      !loadingPages.has(page)
    ) {
      loadingPages.add(page);
      loading.value = true;
      loadPage(page).finally(() => {
        loadingPages.delete(page);
        loading.value = false;
      });
    }
  }
}

// 5) virtualScrollerOptions
const virtualScrollerOptions = computed(() => ({
  lazy: true,
  onLazyLoad,
  itemSize: 50, // row height in px
  showLoader: true, // skeleton loader
  delay: 100, // debounce loader
  loading: loading.value,
  totalRecords: totalRecords.value,
  appendOnly: true, // keep off‑screen items
}));
</script>
