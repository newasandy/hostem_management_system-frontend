<template>
  <div class="h-10 m-4 rounded-lg shadow-md">
    <Menubar :model="menuItem" class="h-10 p-8 mb-4">
      <template #end>
        <Menubar :model="rightItem" class="h-10" />
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../service/useAuth";
import Menubar from "primevue/menubar";

const router = useRouter();

const auth = useAuthStore();

const menuItem = computed(() => {
  if (!auth.isLoggedIn) {
    return [
      {
        label: "Home",
        command: () => router.push({ name: "Home" }),
      },
    ];
  } else if (auth.userRole === "ADMIN") {
    return [
      {
        label: "Dashboard",
      },
      {
        label: "Student",
        command: () => router.push({ name: "Student" }),
      },
      {
        label: "Room Service",
        items: [
          { label: "Rooms", command: () => router.push({ name: "Rooms" }) },
          {
            label: "Room Allocation",
            command: () => router.push({ name: "Rooms" }),
          },
        ],
      },
    ];
  } else if (auth.userRole === "USER") {
    return [
      {
        label: "Dashboard",
      },
      {
        label: "View Room",
        command: () => router.push({ name: "Student" }),
      },
    ];
  }
});

const rightItem = computed(() => {
  if (!auth.isLoggedIn) {
    return [{ label: "Login", command: () => router.push({ name: "Login" }) }];
  } else {
    return [
      {
        label: "Logout",
        icon: "pi pi-user",
        command: () => {
          auth.logout();
          router.push({ name: "Login" });
        },
      },
    ];
  }
});
</script>
<style scoped>
.p-menubar {
  border: none !important;
  box-shadow: none !important;
}
</style>
