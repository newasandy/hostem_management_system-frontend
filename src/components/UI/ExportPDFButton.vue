<template>
  <PickList
    v-model="lists"
    dataKey="key"
    :responsive="true"
    listStyle="min-height:12rem"
  >
    <template #option="{ option }">
      {{ option.label }}
    </template>
  </PickList>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import PickList from "primevue/picklist";

const props = defineProps({
  availableColumns: Array,
  tableName: String,
});
const emit = defineEmits(["update:columnOrder"]);

// Initialize with availableColumns in source, empty target
const lists = ref([[...props.availableColumns], []]);

// Emit target list (lists[1]) when it changes
watch(
  () => lists.value[1],
  (targetList) => {
    emit("update:columnOrder", targetList);
    localStorage.setItem(`pdfCols_${props.tableName}`, JSON.stringify(targetList));
  },
  { deep: true, immediate: true } // Emit immediately on mount
);

// Load saved preferences into target list on mount
onMounted(() => {
  const saved = JSON.parse(localStorage.getItem(`pdfCols_${props.tableName}`));
  if (saved) {
    // Filter out invalid/removed columns
    const validSaved = saved.filter(savedCol =>
      props.availableColumns.some(availCol => availCol.key === savedCol.key)
    );
    
    // Update source/target lists
    lists.value = [
      props.availableColumns.filter(col => 
        !validSaved.some(savedCol => savedCol.key === col.key)
      ),
      validSaved
    ];
  }
});
</script>

<!-- <template>
  <div class="p-4">
    <h2 class="text-xl mb-2">Arrange Your Items</h2>
    <OrderList
      v-model="items"
      dataKey="id"
      header="Drag to reorder"
      :dragdrop="true"
      listStyle="max-height: 20rem; width: 100%;"
      class="border-round shadow-2 p-2 bg-white"
    >
      <template #option="{ item }">
        <div class="flex align-items-center gap-3 p-2">
          <i class="pi pi-bars cursor-move" style="font-size: 1.2rem"></i>
          <span>{{ item.label }}</span>
        </div>
      </template>
    </OrderList>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { OrderList } from "primevue";

const items = ref([
  { id: 1, label: "Item 1" },
  { id: 2, label: "Item 2" },
  { id: 3, label: "Item 3" },
  { id: 4, label: "Item 4" },
  { id: 5, label: "Item 5" },
  { id: 6, label: "Item 6" },
  { id: 7, label: "Item 7" },
  { id: 8, label: "Item 8" },
  { id: 9, label: "Item 9" },
  { id: 10, label: "Item 10" },
]);
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
</style> -->
