<!-- <template>
  <AutoComplete
    v-model="selectedProduct"
    field="fullName"
    dropdown
    :suggestions="products"
    @complete="onComplete"
    :virtualScrollerOptions="virtualScrollerOpts"
  >
    <template #item="slot">
      <div class="p-2">{{ slot.item.fullName }}</div>
    </template>
  </AutoComplete>
</template>

<script setup>
import { ref } from "vue";
import AutoComplete from "primevue/autocomplete";
import { getUserDetails } from "../service/UserData";
const { users, userData, totalRecords } = getUserDetails();

const products = ref([]); // sparse array of length = totalCount
const totalCount = ref(0);
const loading = ref(false);
const lastQuery = ref("");
const pageSize = 10; // fixed rows per fetch

// VirtualScroller config for lazy loading
const virtualScrollerOpts = {
  lazy: true,
  itemSize: 36, // height of one row in px :contentReference[oaicite:1]{index=1}
  showLoader: true,
  loading: loading.value,
  delay: 200,
  onLazyLoad: onLazyLoad,
};

async function onComplete(event) {
  lastQuery.value = event.query;
  await fetchPage(0, pageSize);
}

function onLazyLoad(e) {
  fetchPage(e.first, e.rows);
}

async function fetchPage(first, pageSize) {
  loading.value = true;

  // build the exact param object your backend wants
  const params = {
    first,
    pageSize,
    sortField: "fullName",
    sortOrder: "ASC",
    filters: { fullName: lastQuery.value },
    exactFilters: { "roles.userTypes": "USER" },
    unAllocatedUser: false,
  };

  await userData(params);

  // initialize sparse array once
  if (products.value.length !== totalRecords) {
    totalCount.value = totalRecords;
    products.value = Array.from({ length: totalRecords });
  }

  // splice in the returned slice
  users.value.forEach((itm, idx) => {
    products.value[first + idx] = itm;
  });

  loading.value = false;
}
</script>

<style>
.p-autocomplete-panel .p-virtualscroller {
  max-height: 240px;
}
</style> -->

<template>
  <AutoComplete
    v-model="selectedItem"
    :dropdown="true"
    option-label="fullName"
    placeholder="Search Users"
    :virtual-scroller-options="{
      itemSize: 38,
      lazy: true,
      showLoader: true,
      loading: loading,
      delay: 200,
    }"
    @complete="loadData"
  />
</template>

<script setup>
import { ref } from "vue";
import { getUserDetails } from "../service/UserData";
import { AutoComplete } from "primevue";

const { users, totalRecords, userData } = getUserDetails();
const selectedItem = ref(null);
const loading = ref(false);
const lastQuery = ref("");
const pageSize = 10;

const loadData = async (event) => {
  loading.value = true;

  try {
    const params = {
      first: event.first,
      pageSize: pageSize,
      sortField: "fullName",
      sortOrder: "ASC",
      filters: { fullName: event.query },
      exactFilters: { "roles.userTypes": "USER" },
      unAllocatedUser: false,
    };

    await userData(params);

    // Correct callback format for PrimeVue virtual scroller
    event.callback({
      data: users.value,
      total: totalRecords.value
    });

  } catch (error) {
    console.error("Error loading items:", error);
    event.callback({
      data: [],
      total: 0
    });
  } finally {
    loading.value = false;
  }
};
</script>
