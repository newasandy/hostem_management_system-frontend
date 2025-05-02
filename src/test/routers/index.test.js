import { describe, it, vi, expect, beforeEach } from "vitest";
import { createRouter, createWebHistory, Router } from "vue-router";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia"; // same path as in your router
import { useAuthStore } from "../../stores/useAuth";
import Home from "../../view/Home.vue";
import Login from "../../view/Login.vue";
import ViewStudent from "../../view/admin/ViewStudent.vue";
import MyAutoComplete from "../../view/MyAutoComplete.vue";

const mockToast = { add: vi.fn() };
vi.mock("primevue", () => ({
  useToast: () => mockToast,
}));

describe("Router Navigation Guards", () => {
  let router;
  let authStore;

  beforeEach(async () => {
    // Activate a new Pinia instance
    setActivePinia(createPinia());
    authStore = useAuthStore();

    // Define routes
    const routes = [
      { path: "/", name: "Home", component: Home },
      { path: "/login", name: "Login", component: Login },
      { path: "/autoComplete", name: "AutoC", component: MyAutoComplete },
      {
        path: "/student",
        name: "Student",
        component: ViewStudent,
        meta: { requiresAuth: true, roles: ["ADMIN"] },
      },
    ];

    // Create router instance
    router = createRouter({
      history: createWebHistory(),
      routes,
    });

    // Define navigation guard
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        next({ name: "Login" });
      } else if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
        next({ name: "Home" });
      } else {
        next();
      }
    });

    // Mount a dummy component to initialize the router
    mount(
      { template: "<router-view />" },
      {
        global: {
          plugins: [router],
        },
      }
    );

    // Wait for the router to be ready
    await router.isReady();
  });

  it("Redirects unauthenticated user to Login", async () => {
    authStore.isLoggedIn = false;
    await router.push("/student");
    expect(router.currentRoute.value.name).toBe("Login");
  });

  it("Redirects non-ADMIN user to Home", async () => {
    authStore.isLoggedIn = true;
    authStore.userRole = "USER";
    await router.push("/student");
    expect(router.currentRoute.value.name).toBe("Home");
  });

  it("Allows ADMIN user to access Student view", async () => {
    authStore.isLoggedIn = true;
    authStore.userRole = "ADMIN";
    await router.push("/student");
    expect(router.currentRoute.value.name).toBe("Student");
  });
});
