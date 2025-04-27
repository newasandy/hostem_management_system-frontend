<template>
  <div class="m-4 pt-4 pb-4 mb-4 rounded-lg bg-white shadow-md">
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
      :rowClass="rowClass"
      tableStyle="overflow: hidden"
    >
      <Column
        field="roomNumber"
        sortable
        header="Room Number"
        filter
        :showFilterMenu="false"
      >
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
      <Column field="capacity" sortable header="Capacity" />

      <Column field="status" header="Status">
        <template #body="{ data }">
          <div class="relative overflow-visible group">
            <span
              :class="
                data.status
                  ? 'text-green-600 font-semibold'
                  : 'text-red-600 font-semibold'
              "
            >
              {{ data.status ? "Active" : "Deactive" }}
            </span>
            <button
              type="button"
              @click="handleAction(data)"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all w-9 h-9 duration-300 bg-cyan-400 text-white p-2 rounded"
            >
              <i class="pi pi-plus-circle"></i>
            </button>
          </div>
        </template>
      </Column>

      <template #empty>No users found.</template>
      <template #loading>Loading user data. Please wait.</template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DataTable, Column, InputText } from "primevue";
import { DataTableFilterMeta } from "primevue/datatable";

const props = defineProps<{
  value: any[];
  filters: DataTableFilterMeta;
  loading: boolean;
  totalRecords: number;
  rows: number;
}>();

const emit = defineEmits<{
  (e: "update:filters", val: DataTableFilterMeta): void;
  (e: "action", rowData: any): void;
  (e: "lazy"): void;
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
const rowClass = () => "group";

function handleAction(row: any) {
  emit("action", row);
}
</script>
