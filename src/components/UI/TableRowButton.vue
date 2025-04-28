<template>
  <button
    type="button"
    @click="$emit('action')"
    :class="buttonClasses"
    class="absolute top-1/2 transform -translate-y-1/2 translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full shadow-lg"
  >
    <i :class="icon"></i>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "w-9 h-9",
      validator: (value) => ["w-6 h-6", "w-9 h-9", "w-12 h-12"].includes(value),
    },
    colorScheme: {
      type: String,
      default: "text-black bg-white",
      validator: (value) =>
        [
          "text-black bg-white",
          "text-blue-500 bg-white",
          "text-red-500 bg-white",
        ].includes(value),
    },
    customClasses: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "right-1",
    },
  },
  computed: {
    buttonClasses() {
      return [this.size, this.colorScheme, this.customClasses, this.position];
    },
  },
};
</script>
