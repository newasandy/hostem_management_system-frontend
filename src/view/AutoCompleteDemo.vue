<template>
  <!-- <VirtualScroller
    class="border border-surface-200 rounded"
    :items="items"
    :itemSize="50"
    :loading="loading"
    showLoader
    lazy
    :delay="250"
    @lazy-load="onLazyLoad"
    style="width: 100%; height: 400px"
  >
    <template #item="{ item, options }">
      <div style="height: 50px">
        {{ item.fullName }}
      </div>
    </template>
    <template #loader="{ options }">
      <Skeleton :width="options.even ? '60%' : '40%'" height="1.2rem" />
    </template>
  </VirtualScroller> -->
  <AutoComplete
    v-model="selectedUser"
    :suggestions="items"
    optionLabel="fullName"
    dropdown
    scrollHeight="300px"
    @complete="onLazyLoad"
    :virtualScrollerOptions="{
      lazy: true,

      itemSize: 38,
      showLoader: loading,
      loading: loading,
      delay: 200,
    }"
    placeholder="Search users..."
  />
</template>

<script setup>
import { ref } from "vue";
import VirtualScroller from "primevue/virtualscroller";
import { AutoComplete } from "primevue";
import Skeleton from "primevue/skeleton";
import { getUserDetails } from "../service/UserData";
import { fetchAuthentication } from "../service/fetchAuthentication";
const { users, userData, totalRecords } = getUserDetails();

// reactive state
const selectedUser = ref("");
const items = ref([]); // placeholder array for all items
const loading = ref(false); // loading indicator
let totalCount = 0; // will be set on first load

// your filter maps (assumed provided elsewhere or empty)
const filterMap = {};

// handler for the lazy-load event
const onLazyLoad = async (event) => {
  // show loader
  loading.value = true;
  console.log("here");

  // build request body exactly as your backend expects
  const requestBody = {
    first: event.first || 0,
    pageSize: event.rows || 10,
    sortField: "fullName",
    sortOrder: "ASC",
    filters: filterMap,
    exactFilters: { "roles.userTypes": "USER" },
    unAllocatedUser: false,
  };

  try {
    // call your API
    const response = await fetch(
      "http://localhost:8080/hostel_management_system_web/api/user/table",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (response.ok) {
      const data = await response.json();
      users.value = data.user_list;
      if (items.value.length !== data.count) {
        totalCount = data.count;
        items.value = Array.from({ length: totalCount }, () => ({
          fullName: "",
          id: null,
        }));
      }
      console.log(data.user_list);

      items.value.splice(event.first, data.user_list.length, ...data.user_list);
    }
  } catch (err) {
    console.error("Lazy load error", err);
  } finally {
    loading.value = false;
  }
};
</script>
