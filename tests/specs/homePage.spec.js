import { test, expect } from '@playwright/test';
import HomePage from '../pageObjects/homePage'
//--------------------------------
test.describe('When user visits homepage', async () => {

    test('has title', async ({ page }) => {
        const homePage = new HomePage(page)

        await homePage.goto();

        await expect(page).toHaveTitle(/نوشتہ/);
    });
});