import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    userRole: "",
    user: null,
  }),

  actions: {
    async login(userData) {
      this.user = userData;
      this.userRole = userData.roleId === 1 ? "ADMIN" : "USER";
      this.isLoggedIn = true;
    },

    async checkAuth() {
      const resp = await fetch("/api/auth/me", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (resp.ok) {
        const userData = await resp.json();
        this.login(userData);
      } else {
        this.isLoggedIn = false;
        this.userRole = "";
        this.user = null;
      }
    },

    async logout() {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      this.isLoggedIn = false;
      this.userRole = "";
      this.user = null;
    },
  },

  persist: true,
});
