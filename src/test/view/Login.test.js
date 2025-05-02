import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import Login from "../../view/Login.vue";
import PrimeVue from "primevue/config";
import { useAuthStore } from "../../stores/useAuth";
// PrimeVue component mocks
vi.mock("primevue/inputtext", () => ({ default: { template: "<input />" } }));
vi.mock("primevue/button", () => ({ default: { template: "<button />" } }));
vi.mock("primevue/toast", () => ({ default: { template: "<div />" } }));

const mockToast = { add: vi.fn() };
vi.mock("primevue", () => ({
  useToast: () => mockToast,
}));

// Router mock
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Auth store mock
const mockLoginAction = vi.fn();
vi.mock("../stores/useAuth", () => ({
  useAuthStore: () => ({
    loginAction: mockLoginAction,
    user: { role: { id: 0 } },
    toast: { add: vi.fn() },
  }),
}));

vi.mock("../stores/useAuth", () => ({
  useAuthStore: vi.fn(() => ({
    isLoggedIn: ref(false),
    userRole: ref(""),
    user: ref(null),
    loginAction: vi.fn().mockImplementation(async ({ email, password }) => {
      // Mock successful login
      if (email === "test@example.com" && password === "password123") {
        return Promise.resolve(true);
      }
      // Mock failed login
      return Promise.resolve(false);
    }),
    logout: vi.fn(),
    toast: { add: vi.fn() },
  })),
}));

describe("Login.vue", () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    mockLoginAction.mockReset().mockResolvedValue(true);
    mockPush.mockReset();

    wrapper = mount(Login, {
      global: {
        plugins: [PrimeVue],
        mocks: {
          $tooltip: {
            add: vi.fn().mockImplementation(() => ({})),
            remove: vi.fn(),
            update: vi.fn(),
          },
        },
      },
    });
  });

  it("renders form elements correctly", () => {
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.findAll("input")).toHaveLength(2);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("binds email and password inputs", async () => {
    const emailInput = wrapper.find("#email1");
    const passwordInput = wrapper.find("#password1");

    // Set values using the component's IDs
    await emailInput.setValue("test@example.com");
    await passwordInput.setValue("password123");

    // Verify through the input elements' DOM values
    expect(emailInput.element.value).toBe("test@example.com");
    expect(passwordInput.element.value).toBe("password123");
  });
});
