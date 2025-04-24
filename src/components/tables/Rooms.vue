<template>
  <div class="m-4 pr-8 pl-4 p-1 mb-4 rounded-lg bg-white shadow-md">
    <DataTable
      :value="value"
      :loading="loading"
      dataKey="id"
      paginator
      sortMode="multiple"
      :rows="10"
      filterDisplay="row"
      :globalFilterFields="['roomNumber', 'capacity', 'status']"
      v-model:filters="internalFilters"
      :rowClass="rowClass"
      tableStyle="overflow: hidden"
    >
      <Column field="roomNumber" sortable header="Room Number" />
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
              @click="handleAction(data)"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-blue-500 text-white p-2 rounded"
            >
              <i class="pi pi-cog"></i>
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
import { DataTable, Column } from "primevue";
import { DataTableFilterMeta } from "primevue/datatable";

const props = defineProps<{
  value: any[];
  filters: DataTableFilterMeta;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:filters", val: DataTableFilterMeta): void;
  (e: "action", rowData: any): void;
}>();

const internalFilters = computed({
  get: () => props.filters,
  set: (val) => emit("update:filters", val),
});

const rowClass = () => "group";

// re-emit action event
function handleAction(row: any) {
  emit("action", row);
}
</script>
