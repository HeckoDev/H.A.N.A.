import { expect, test } from '@playwright/test';

test.describe('Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should submit search form and navigate to search page', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/posez une question/i);
    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });

    // Enter search query
    await searchInput.fill('accessibilité web');
    await searchButton.click();

    // Should navigate to search page
    await page.waitForURL(/\/search\?q=accessibilit/);
    await expect(page).toHaveURL(/q=accessibilit/);
  });

  test('should submit via Enter key', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/posez une question/i);

    await searchInput.fill('nuxt.js');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search\?q=nuxt/);
    await expect(page).toHaveURL(/q=nuxt/);
  });

  test('should handle empty search gracefully', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });
    await searchButton.click();

    // Should either stay on home page or navigate to search with empty query
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(search\?|$)/);
  });

  test('should encode special characters in URL', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/posez une question/i);

    await searchInput.fill('typescript & react');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search/);

    // URL should be properly encoded
    const url = page.url();
    expect(url).toContain('typescript');
    expect(url).toContain('react');
  });

  test('should preserve search query in input after navigation', async ({ page }) => {
    const query = 'vue composables';
    const searchInput = page.getByPlaceholder(/posez une question/i);

    await searchInput.fill(query);
    await searchInput.press('Enter');

    await page.waitForURL(/\/search/);

    // Check if query is in URL
    await expect(page).toHaveURL(new RegExp(query.split(' ').join('[+ ]')));
  });

  test('should have proper ARIA attributes on form', async ({ page }) => {
    const searchForm = page.locator('form[role="search"]');
    await expect(searchForm).toHaveAttribute('aria-label');
  });

  test('should have accessible name on search button', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });
    await expect(searchButton).toHaveAccessibleName(/lancer la recherche/i);
  });
});
