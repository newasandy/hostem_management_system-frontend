<script>
import NavBar from "./components/NavBar.vue";

export default {
  components: { NavBar },
};
</script>

<template>
  <div>
    <NavBar />
    <main class="flex-grow mx-auto">
      <RouterView />
    </main>
  </div>
</template>
