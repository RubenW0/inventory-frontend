import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5174",  
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // node events (optioneel)
    },
  },
});
