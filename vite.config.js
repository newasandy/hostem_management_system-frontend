import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    // enable jest-like global test APIs
    environment: "happy-dom",
    globals: true,
    // simulate DOM with happy-dom
    // (requires installing happy-dom as a peer dependency)
  },
});
