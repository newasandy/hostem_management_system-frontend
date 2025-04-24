<template>
  <div class="px-6 py-20 md:px-12 lg:px-20">
    <div class="p-6 shadow rounded-border w-full lg:w-4/12 mx-auto">
      <div class="font-bold mb-5 text-2xl text-center">
        <span>Login</span>
      </div>
      <div>
        <form @submit.prevent="handleLogin">
          <label for="email1" class="font-medium mb-2 block">Email</label>
          <InputText
            v-tooltip="'Enter your Email'"
            v-model="email"
            id="email1"
            type="text"
            class="w-full mb-4"
          />

          <label for="password1" class="font-medium mb-2 block">Password</label>
          <InputText
            v-tooltip="'Enter your Password'"
            v-model="password"
            id="password1"
            type="password"
            class="w-full mb-4"
          />

          <Button
            label="Login"
            icon="pi pi-user"
            type="submit"
            severity="contrast"
            class="w-full"
            raised
          />
        </form>
      </div>
      <Toast />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "../service/useAuth";
const email = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();
const handleLogin = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/hostel_management_system_web/api/auth/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          passwords: password.value,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const { user } = data;
      console.log(user.roleId);

      auth.login(user);
      if (user.roleId === 1) {
        router.push("/student");
      } else if (user.roleId === 2) {
        router.push("/");
      }
    } else {
      const errorData = await response.json();
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: errorData.error,
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Login Failed",
      detail: "Login Failed",
      life: 3000,
    });
  }
};
</script>
