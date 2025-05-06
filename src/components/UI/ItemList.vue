
<template>
  <div class="p-4 max-w-md mx-auto">
    <h3 class="text-lg font-semibold mb-3">Arrange &amp; Select Items</h3>
    <ul class="border rounded-lg divide-y">
      <li
        v-for="(item, idx) in items"
        :key="item.id"
        class="flex items-center justify-between p-2 cursor-move"
        draggable="true"
        @dragstart="onDragStart(idx)"
        @dragover.prevent="onDragOver(idx)"
        @drop="onDrop(idx)"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            :id="`chk-${item.id}`"
            v-model="item.checked"
          />
          <label :for="`chk-${item.id}`" class="ml-2">{{ item.label }}</label>
        </div>
        <span class="pi pi-bars" aria-hidden="true"></span>
      </li>
    </ul>
    <div class="mt-4">
      <strong>Selected IDs:</strong>
      <span v-if="selected.length">{{ selected.join(", ") }}</span>
      <span v-else>None</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const items = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    label: `Item ${i + 1}`,
    checked: false,
  }))
);

let dragSrcIndex = null;

function onDragStart(index) {
  dragSrcIndex = index;
}

function onDragOver(overIndex) {
  // optional: highlight drop target
}

function onDrop(dropIndex) {
  const moved = items.value.splice(dragSrcIndex, 1)[0];
  items.value.splice(dropIndex, 0, moved);
}

// compute selected IDs
const selected = computed(() =>
  items.value.filter((i) => i.checked).map((i) => i.id)
);
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
/* simple divide-y utility since no PrimeFlex here */
.divide-y > li:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}
</style>