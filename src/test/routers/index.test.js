import { describe, it, vi, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../stores/useAuth";
import router from "../../router";

// Mock PrimeVue components
const mockToast = { add: vi.fn() };
vi.mock("primevue", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useToast: () => mockToast,
    InputText: { template: "<input />" },
    Dialog: { template: "<div></div>" },
    Button: { template: "<button />" },
    DataTable: { template: "<table />" },
    Column: { template: "<td />" },
  };
});

// Mock all PrimeVue directives
vi.mock("primevue/directives/tooltip", () => ({ default: {} }));
vi.mock("primevue/directives/ripple", () => ({ default: {} }));

describe("Router Navigation Guards", () => {
  let authStore;

  beforeEach(async () => {
    setActivePinia(createPinia());
    authStore = useAuthStore();

    // Mount with complete mocks
    mount(
      { template: "<router-view />" },
      {
        global: {
          plugins: [router],
          directives: {
            tooltip: {},
            ripple: {},
          },
          mocks: {
            $primevue: {
              config: {
                ripple: false,
                inputStyle: "filled",
              },
            },
          },
          components: {
            InputText: { template: "<input />" },
            Dialog: { template: "<div />" },
            Button: { template: "<button />" },
            DataTable: { template: "<table />" },
          },
        },
      }
    );

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
  it("has correct home route", () => {
    const route = router.resolve({ name: "Home" });
    expect(route.meta).toEqual({});
  });

  it("has proper student route meta", () => {
    const route = router.resolve({ name: "Student" });
    expect(route.meta).toEqual({
      requiresAuth: true,
      roles: ["ADMIN"],
    });
  });
  // Add back the ADMIN test case
  it("Allows ADMIN user to access Student view", async () => {
    authStore.isLoggedIn = true;
    authStore.userRole = "ADMIN";
    await router.push("/student");
    expect(router.currentRoute.value.name).toBe("Student");
  });
});
