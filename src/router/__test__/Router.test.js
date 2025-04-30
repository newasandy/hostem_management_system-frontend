import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
// import { routes } from "../router";
import router from "..";
// import { useAuthStore } from "../stores/useAuth";
import { useAuthStore } from "../../stores/useAuth";

// Mock components
vi.mock("../view/Home.vue", () => ({
  default: { template: "<div>Home</div>" },
}));
vi.mock("../view/Login.vue", () => ({
  default: { template: "<div>Login</div>" },
}));
vi.mock("../view/admin/ViewStudent.vue", () => ({
  default: { template: "<div>Student</div>" },
}));
vi.mock("../view/MyAutoComplete.vue", () => ({
  default: { template: "<div>AutoComplete</div>" },
}));

// Mock auth store
vi.mock("../stores/useAuth", () => ({
  useAuthStore: vi.fn(() => ({
    isLoggedIn: false,
    userRole: "",
  })),
}));

describe("Router Configuration", () => {
  let router;

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      router,
    });
  });

  it("should have correct route definitions", () => {
    const routeNames = routes.map((route) => route.name);
    expect(routeNames).toEqual(["Home", "Login", "AutoC", "Student"]);

    const studentRoute = routes.find((r) => r.name === "Student");
    expect(studentRoute.meta).toEqual({
      requiresAuth: true,
      roles: ["ADMIN"],
    });
  });

  describe("Navigation Guards", () => {
    it("should redirect to login when accessing protected route without auth", async () => {
      await router.push("/student");
      await router.isReady();

      expect(router.currentRoute.value.name).toBe("Login");
    });

    it("should allow access to protected route with valid auth and role", async () => {
      // Mock authenticated admin user
      useAuthStore.mockImplementation(() => ({
        isLoggedIn: true,
        userRole: "ADMIN",
      }));

      await router.push("/student");
      await router.isReady();

      expect(router.currentRoute.value.name).toBe("Student");
    });

    it("should redirect to home when role is invalid", async () => {
      // Mock authenticated non-admin user
      useAuthStore.mockImplementation(() => ({
        isLoggedIn: true,
        userRole: "USER",
      }));

      await router.push("/student");
      await router.isReady();

      expect(router.currentRoute.value.name).toBe("Home");
    });

    it("should allow access to public routes without auth", async () => {
      await router.push("/");
      await router.isReady();

      expect(router.currentRoute.value.name).toBe("Home");

      await router.push("/autoComplete");
      await router.isReady();
      expect(router.currentRoute.value.name).toBe("AutoC");
    });
  });
});
