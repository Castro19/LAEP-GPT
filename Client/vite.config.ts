import { sentryVitePlugin } from "@sentry/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // Automatically opens the report in your browser
      filename: "dist/stats.html", // Path to the generated report
      template: "treemap", // Visualization type: treemap, sunburst, network
    }),
    sentryVitePlugin({
      org: "polylink",
      project: "frontend-polylink",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["axios"],
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    rollupOptions: {
      external: ["axios"],
    },

    sourcemap: true,
  },
});
