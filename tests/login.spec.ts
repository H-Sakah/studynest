import { test, expect } from '@playwright/test';

test('Should log in successfuly and land in Dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByPlaceholder('Gib deine Email-Adresse ein').click();
  await page.getByPlaceholder('Gib deine Email-Adresse ein').fill('study1nest@gmail.com');
  await page.getByPlaceholder('Gib dein Passwort ein').click();
  await page.getByPlaceholder('Gib dein Passwort ein').fill('test123456');
  await page.getByRole('button', { name: 'Anmelden' }).click();
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});