import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5176",
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
