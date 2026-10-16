import { test, expect } from '@playwright/test';
//--------------------------------
// Local defaults of the links to the other Nawishta apps (see src/config.js)
test.describe('Links to the other apps', () => {
    test('the logo goes to the main site home page', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('link', { name: /Nawishta home|نوشتہ کا صفحۂ اول/ })).toHaveAttribute('href', 'http://localhost:4200');
    });

    test('the app switcher lists the other apps', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /Nawishta apps|نوشتہ ایپس/ }).first().click();
        const items = page.getByRole('menuitem');
        await expect(items.filter({ hasText: /^Libraries$|^کتب خانے$/ })).toHaveAttribute('href', 'http://localhost:4400');
        await expect(items.filter({ hasText: /Dictionary and tools|لغت اور اوزار/ })).toHaveAttribute('href', 'http://localhost:4500');
        await expect(items.filter({ hasText: /^Library editor$|^کتب خانہ ایڈیٹر$/ })).toHaveAttribute('aria-current', 'true');
    });
});
