import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
<<<<<<< HEAD

=======
>>>>>>> bec3318c70f74e6f44cd32354cf9a8c684b43854
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
<<<<<<< HEAD

  reporter: 'html',

=======
  reporter: 'html',
>>>>>>> bec3318c70f74e6f44cd32354cf9a8c684b43854
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
<<<<<<< HEAD

=======
>>>>>>> bec3318c70f74e6f44cd32354cf9a8c684b43854
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
<<<<<<< HEAD

  // ✅ Playwright özü serveri idarə edir
=======
>>>>>>> bec3318c70f74e6f44cd32354cf9a8c684b43854
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
<<<<<<< HEAD
})
=======
})
>>>>>>> bec3318c70f74e6f44cd32354cf9a8c684b43854
