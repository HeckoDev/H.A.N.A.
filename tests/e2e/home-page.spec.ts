import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the main heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /repenser la navigation|web plus humain/i, level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should display search input with placeholder', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/posez une question|recherchez/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display search button', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });
    await expect(searchButton).toBeVisible();
  });

  test('should display logo and brand name', async ({ page }) => {
    // Check logo emoji
    const logo = page.getByRole('img', { name: /logo hana/i });
    await expect(logo).toBeVisible();

    // Check brand acronym
    const acronym = page.getByText('H.A.N.A.');
    await expect(acronym).toBeVisible();

    // Check full name
    const fullName = page.getByText(/hecko accessible navigation/i);
    await expect(fullName).toBeVisible();
  });

  test('should display language switcher', async ({ page }) => {
    const langLink = page.getByRole('link', { name: /switch to english/i });
    await expect(langLink).toBeVisible();
  });

  test('should have skip link as first focusable element', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /aller au contenu/i });
    await expect(skipLink).toBeFocused();
  });

  test('should have correct lang attribute', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'fr');
  });

  test('should have form with role search', async ({ page }) => {
    const searchForm = page.locator('form[role="search"]');
    await expect(searchForm).toBeVisible();
  });

  test('should have sr-only label for search input', async ({ page }) => {
    const label = page.locator('label[for="search-input"]');
    await expect(label).toHaveClass(/sr-only/);
    await expect(label).toHaveText(/rechercher sur le web/i);
  });
});
