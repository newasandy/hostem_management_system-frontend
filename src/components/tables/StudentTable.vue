<template>
  <div class="m-4 pt-4 pb-4 rounded-lg bg-white shadow-md">
    <DataTable
      :value="value"
      :lazy="true"
      :paginator="true"
      :rows="rows"
      :totalRecords="totalRecords"
      :loading="loading"
      dataKey="id"
      v-model:filters="internalFilters"
      @filter="onFilter"
      @page="onLazy"
      @sort="onLazy"
      filterDisplay="row"
      :rowClass="getRowClass"
    >
      <Column
        field="fullName"
        header="Full Name"
        :sortable="true"
        filter
        :showFilterMenu="false"
      >
        >
        <template #body="{ data }">
          {{ data.fullName }}
        </template>
        <template #filter="{ filterModel = { value: null }, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback"
            placeholder="Search names"
            class="w-full"
          />
        </template>
      </Column>
      <Column
        field="email"
        header="Email"
        sortable
        filter
        :showFilterMenu="false"
        ><template #filter="{ filterModel = { value: null }, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback"
            placeholder="Search Email"
            class="w-full"
          /> </template
      ></Column>
      <Column
        field="address.country"
        header="Country"
        sortable
        filter
        :showFilterMenu="false"
      >
        <template #filter="{ filterModel = { value: null }, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback"
            placeholder="Search Country"
            class="w-full"
          /> </template
      ></Column>
      <Column
        field="address.district"
        header="District"
        sortable
        filter
        :showFilterMenu="false"
      >
        <template #filter="{ filterModel = { value: null }, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback"
            placeholder="Search District"
            class="w-full"
          /> </template
      ></Column>
      <Column
        field="address.rmcMc"
        header="RMC/MC"
        sortable
        filter
        :showFilterMenu="false"
      >
        <template #filter="{ filterModel = { value: null }, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback"
            placeholder="Search Metro"
            class="w-full"
          /> </template
      ></Column>
      <Column field="address.wardNo" header="Ward No" sortable filter />

      <!-- <Column field="status" header="Status">
        <template #body="{ data }">
          <span :class="data.status ? 'text-green-600' : 'text-red-600'">
            {{ data.status ? "Active" : "Inactive" }}
          </span>
        </template>
      </Column> -->

      <template #empty>No records found.</template>
      <template #loading>Loading…</template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DataTable, Column, InputText } from "primevue";
import type { DataTableFilterMeta, LazyLoadEvent } from "primevue/datatable";

const props = defineProps<{
  value: any[];
  filters: DataTableFilterMeta;
  loading: boolean;
  totalRecords: number;
  rows: number;
}>();

const emit = defineEmits<{
  (e: "update:filters", val: DataTableFilterMeta): void;
  (e: "lazy", event: LazyLoadEvent): void;
}>();

function onLazy(event: LazyLoadEvent) {
  emit("lazy", event);
}
const internalFilters = computed({
  get: () => props.filters,
  set: (val) => {
    // Only update if values actually changed
    if (JSON.stringify(val) !== JSON.stringify(props.filters)) {
      emit("update:filters", val);
    }
  },
});
function onFilter(event: LazyLoadEvent) {
  emit("lazy", {
    ...event,
    first: 0,
  });
}

const getRowClass = (data: any) => {
  return data.status
    ? "!bg-green-100 hover:!bg-green-200"
    : "!bg-red-100 hover:!bg-red-200";
};
</script>
