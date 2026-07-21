import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    port: 8080,
    strictPort: false,
  },
  tanstackStart: {
    server: { entry: "server" },
  },
} as any);
