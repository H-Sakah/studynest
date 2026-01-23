import { defineConfig, devices, test as baseTest } from '@playwright/test';

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    // Log in before the test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[placeholder="Gib deine Email-Adresse ein"]', 'study1nest@gmail.com');
    await page.fill('input[placeholder="Gib dein Passwort ein"]', 'test123456');
    await page.click('button:has-text("Anmelden")');
    
    // Pass the logged-in page to tests
    await use(page);
  },
});

/**
 * Playwright Configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
