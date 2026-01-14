import { test, expect } from '@playwright/test';

const gmail_url = 'https://mail.google.com/mail/u/0/#search/label%3Areports-it-general+is%3Aunread' // url includes search term
const gmail_email = 'email@gmail.com'
const gmail_folder = 'IT general'
// const gmail_folder = /^IT general/ // regex version
const gmail_search_term = '/uks/i' // pick something that appears first/early in the folder

test('gmail unread clear', async ({ page }) => {
  test.setTimeout(0);
  await page.setViewportSize({ width: 2200, height: 1200 }); // prev/next allows buttons to always show
  await page.goto(gmail_url);

  // login (set up for SSO)
  await page.getByRole('textbox', { name: 'Email or phone' }).click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill(gmail_email);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'someone@example.com' }).fill(gmail_email); // manual intervention: may require captcha
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Yes' }).click(); // manual intervention: fingerprint/etc

  // navigate to folder and search
  await page.getByText(gmail_folder).click();
  await page.waitForTimeout(5000);
  await page.goto(gmail_url);
  await page.waitForTimeout(5000);
  await page.getByRole('link', { name: gmail_search_term }).first().click();
  await page.waitForTimeout(5000);

while (true) {
  await page.getByRole('button', { name: 'Older', exact: true }).click();
  await page.waitForTimeout(1000);
  
  if (await page.locator('span.v1:has-text("Loading")').isVisible()) {
    try {
      await page.locator('span.v1:has-text("Loading")').waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      await page.goto(gmail_url);
      await page.waitForTimeout(1000);
      await page.getByRole('link', { name: gmail_search_term }).first().click();
      await page.waitForTimeout(1000);
    }
  }
}
});