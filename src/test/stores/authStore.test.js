import { setActivePinia, createPinia } from "pinia";
import { vi, beforeEach, expect, describe, test } from "vitest";
import { useAuthStore } from "../../stores/useAuth";

// Mock PrimeVue toast
const mockToast = { add: vi.fn() };
vi.mock("primevue", () => ({
  useToast: () => mockToast,
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock server setup
// const mockToast = useToast();

// Reset mocks between tests
beforeEach(() => {
  mockFetch.mockReset();
  mockToast.add.mockReset();
  setActivePinia(createPinia());
});

// authStore.test.js
describe("useAuthStore", () => {
  // Shared setup/teardown

  describe("loginAction()", () => {
    test("loginAction sets auth state on successful login", async () => {
      // Mock successful response
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: { id: 1 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      });

      const store = useAuthStore();

      // Execute login
      const result = await store.loginAction({
        email: "john@example.com",
        password: "password123",
      });

      // Verify API call
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/hostel_management_system_web/api/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "john@example.com",
            passwords: "password123", // Note: Verify if 'passwords' is intentional
          }),
        })
      );

      // Verify state updates
      expect(store.isLoggedIn).toBe(true);
      expect(store.userRole).toBe("ADMIN");
      expect(store.user).toEqual(mockUser);

      // Verify toast notification
      expect(mockToast.add).toHaveBeenCalledWith({
        severity: "success",
        summary: "Login Successful",
        detail: "Welcome back, John Doe!",
        life: 3000,
      });

      // Verify return value
      expect(result).toBe(true);
    });
    test("loginAction handles server errors", async () => {
      // Mock error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      });

      const store = useAuthStore();

      const result = await store.loginAction({
        email: "wrong@example.com",
        password: "wrongpass",
      });

      expect(store.isLoggedIn).toBe(false);
      expect(mockToast.add).toHaveBeenCalledWith({
        severity: "error",
        summary: "Login Failed",
        detail: "Invalid credentials",
        life: 3000,
      });
      expect(result).toBe(false);
    });
    test("loginAction handles network failures", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const store = useAuthStore();
      const result = await store.loginAction({
        email: "test@example.com",
        password: "password",
      });

      expect(store.isLoggedIn).toBe(false);
      expect(mockToast.add).toHaveBeenCalledWith({
        severity: "error",
        summary: "Network Error",
        detail: "Could not reach server",
        life: 3000,
      });
      expect(result).toBe(false);
    });
  });

  describe("logout()", () => {
    test("logout resets auth state", async () => {
      // First log in
      const store = useAuthStore();
      store.isLoggedIn = true;
      store.userRole = "ADMIN";
      store.user = { id: 1 };

      // Mock logout response
      mockFetch.mockResolvedValueOnce({ ok: true });

      await store.logout();

      // Verify logout API call
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/hostel_management_system_web/api/auth/logout",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );

      // Verify state reset
      expect(store.isLoggedIn).toBe(false);
      expect(store.userRole).toBe("");
      expect(store.user).toBeNull();

      // Verify toast notification
      expect(mockToast.add).toHaveBeenCalledWith({
        severity: "info",
        summary: "Logged Out",
        detail: "You have been logged out successfully",
        life: 3000,
      });
    });

    test("logout resets auth state", async () => {
      // First log in
      const store = useAuthStore();
      store.isLoggedIn = true;
      store.userRole = "USER";
      store.user = { id: 2 };

      // Mock logout response
      mockFetch.mockResolvedValueOnce({ ok: true });

      await store.logout();

      // Verify logout API call
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/hostel_management_system_web/api/auth/logout",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );

      // Verify state reset
      expect(store.isLoggedIn).toBe(false);
      expect(store.userRole).toBe("");
      expect(store.user).toBeNull();

      // Verify toast notification
      expect(mockToast.add).toHaveBeenCalledWith({
        severity: "info",
        summary: "Logged Out",
        detail: "You have been logged out successfully",
        life: 3000,
      });
    });
  });

  describe("edge cases", () => {
    test("loginAction handles unexpected response format", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // Missing user data
      });

      const store = useAuthStore();
      const result = await store.loginAction({
        email: "test@example.com",
        password: "password",
      });

      expect(result).toBe(false);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: "error",
        summary: "Network Error",
        detail: "Could not reach server",
        life: 3000,
      });
    });

    test("persist plugin integration", async () => {
      const store = useAuthStore();
      store.isLoggedIn = true;
      store.userRole = "ADMIN";

      // Wait for next tick to allow persist
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Create new store instance
      const newStore = useAuthStore();

      expect(newStore.isLoggedIn).toBe(true);
      expect(newStore.userRole).toBe("ADMIN");
    });
  });
});
