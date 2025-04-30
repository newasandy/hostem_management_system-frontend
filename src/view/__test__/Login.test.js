import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Login from "../Login.vue";
import PrimeVue from "primevue/config";

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

  // it("submits login credentials", async () => {
  // Mock the login action implementation
  // mockLoginAction.mockImplementationOnce(async ({ email, password }) => {
  //   return email === "test@example.com" && password === "password123";
  // });

  // Set input values using component IDs
  // await wrapper.find("#email1").setValue("test@example.com");
  // await wrapper.find("#password1").setValue("password123");

  // Submit the form
  // await wrapper.find("form").trigger("submit.prevent");

  // Wait for all promises to resolve
  // await new Promise((resolve) => setTimeout(resolve, 0));

  // Verify the store action was called
  // expect(mockLoginAction).toHaveBeenCalledWith({
  //   email: "test@example.com",
  //   passwords: "password123",
  // });
  // });

  //   it("redirects to student dashboard for role 1", async () => {
  //     mockLoginAction.mockResolvedValueOnce(true);
  //     vi.mocked(useAuthStore).mockImplementationOnce(() => ({
  //       loginAction: mockLoginAction,
  //       user: { role: { id: 1 } },
  //       toast: { add: vi.fn() },
  //     }));

  //     const wrapper = mount(Login, { global: { plugins: [PrimeVue] } });
  //     await wrapper.find("form").trigger("submit.prevent");

  //     expect(mockPush).toHaveBeenCalledWith("/student");
  //   });

  //   it("redirects to home for other roles", async () => {
  //     await wrapper.find("form").trigger("submit.prevent");
  //     await new Promise((resolve) => setTimeout(resolve, 0)); // Allow promises to settle

  //     expect(mockPush).toHaveBeenCalledWith("/");
  //   });
});
