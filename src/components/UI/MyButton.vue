<template>
  <Button
    :type="type"
    :label="label"
    :severity="color"
    @click="handleClick"
    class="!w-20 !h-9"
  />
</template>

<script setup>
import Button from "primevue/button";

// Component Props
const props = defineProps({
  color: {
    type: String,
    default: "primary",
    validator: (value) =>
      [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "help",
        "danger",
        "contrast",
      ].includes(value),
  },
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  label: {
    type: String,
    default: "",
  },
});

// Component Emits
const emit = defineEmits(["click"]);

// Click Handler
const handleClick = (event) => {
  emit("click", event);
};
</script>
