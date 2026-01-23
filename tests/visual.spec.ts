import { test } from '../playwright.config';
import { expect } from '@playwright/test';

test('should visually match the dashboard', async ({ page }) => {
  // Wait for dashboard to load
  await page.waitForURL('http://localhost:3000/dashboard');

  await page.waitForSelector('div.text-center.mb-4 > h1.text-xl.font-bold.text-gray-800');
  
  // Hide scrollbar to ensure consistent screenshots
  await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; }' });
  // Take a screenshot and compare with a baseline
  await expect(page).toHaveScreenshot('dashboard.png');
});

test('should visually match the Meine Module page, modal and creating module', async ({ page }) => {
  await page.click('text=Meine Module');

  await page.waitForSelector('div.text-center.mb-4 > h1.text-xl.font-bold.text-gray-800');
  
  // Hide scrollbar to ensure consistent screenshots
  await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; }' });
  // Test the Meine Module page
  await expect(page).toHaveScreenshot('meineModule.png');

  // Click the "Neues Modul" button
  await page.click('text=Neues Modul');

  // Take the second screenshot with the modal visible
  await expect(page).toHaveScreenshot('meineModuleModal.png');

  // Add Modulname
  await page.getByPlaceholder('Modulname...').click();
  await page.getByPlaceholder('Modulname...').fill('SwtP');

  // Add a Dozent
  await page.getByPlaceholder('Dozentname...').fill('Weitz Wolfgang');
  await page.click('button.flex.items-center.text-blue-500');

  // Choose Color
  await page.click('button[aria-label="Choose bg-cyan-400"]');

  // Click "Modul erstellen" button
  await page.click('text=Modul erstellen');

  await expect(page).toHaveScreenshot('neueModul.png');
});

test('should visually match the Tasks page', async ({ page }) => {
  await page.click('text=Tasks');

  await page.waitForSelector('div.text-center.mb-4 > h1.text-xl.font-bold.text-gray-800');
  
  // Hide scrollbar to ensure consistent screenshots
  await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; }' });
  // Test the Meine Module page
  await expect(page).toHaveScreenshot('tasks.png');
});

test('should visually match the Platforms page', async ({ page }) => {
  await page.click('text=Meine Module');

  await page.waitForSelector('div.text-center.mb-4 > h1.text-xl.font-bold.text-gray-800');
  
  // Hide scrollbar to ensure consistent screenshots
  await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; }' });
  // Test the Meine Module page
  await expect(page).toHaveScreenshot('platforms.png');
});
