import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'docker-compose up --build frontend backend',
    port: 5174,
    timeout: 120 * 1000
  }
});
