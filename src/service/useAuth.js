import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue";
export const useAuthStore = defineStore(
  "auth",
  () => {
    const isLoggedIn = ref(false);
    const userRole = ref("");
    const user = ref(null);

    const toast = useToast();

    async function loginAction({ email, password }) {
      try {
        const res = await fetch(
          "http://localhost:8080/hostel_management_system_web/api/auth/login",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, passwords: password }),
          }
        );
        const data = await res.json();

        if (res.ok) {
          user.value = data.user;
          userRole.value = data.user.role.id === 1 ? "ADMIN" : "USER";
          isLoggedIn.value = true;

          toast.add({
            severity: "success",
            summary: "Login Successful",
            detail: `Welcome back, ${data.user.name ?? data.user.email}!`,
            life: 3000,
          });
          return true;
        } else {
          toast.add({
            severity: "error",
            summary: "Login Failed",
            detail: data.error || "Invalid credentials",
            life: 3000,
          });
          return false;
        }
      } catch (err) {
        toast.add({
          severity: "error",
          summary: "Network Error",
          detail: "Could not reach server",
          life: 3000,
        });
        return false;
      }
    }

    async function logout() {
      await fetch(
        "http://localhost:8080/hostel_management_system_web/api/auth/logout",
        { method: "POST", credentials: "include" }
      );
      isLoggedIn.value = false;
      userRole.value = "";
      user.value = null;

      toast.add({
        severity: "info",
        summary: "Logged Out",
        detail: "You have been logged out successfully",
        life: 3000,
      });
    }

    async function checkAuth() {
      try {
        const resp = await fetch(
          "http://localhost:8080/hostel_management_system_web/api/auth/me",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (resp.ok) {
          const u = await resp.json();
          user.value = u;
          userRole.value = u.role.id === 1 ? "ADMIN" : "USER";
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
          userRole.value = "";
          user.value = null;
        }
      } catch {
        isLoggedIn.value = false;
        userRole.value = "";
        user.value = null;
      }
    }

    return {
      isLoggedIn,
      userRole,
      user,
      loginAction,
      logout,
      checkAuth,
    };
  },
  {
    persist: true,
  }
);
