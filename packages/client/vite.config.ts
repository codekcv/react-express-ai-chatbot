import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/hello -> http://localhost:3000/api/hello
      "/api": "http://localhost:3000",
    },
  },
});
