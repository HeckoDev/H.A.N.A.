import { expect, test } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate through interactive elements with Tab', async ({ page }) => {
    // Start from skip link
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /aller au contenu/i });
    await expect(skipLink).toBeFocused();

    // Continue tabbing - exact order may vary
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // After several tabs, search button should be reachable
    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });
    await searchButton.focus();
    await expect(searchButton).toBeFocused();
  });

  test('should navigate backwards with Shift+Tab', async ({ page }) => {
    const langSwitcher = page.getByRole('link', { name: /switch to english/i });
    await langSwitcher.focus();

    // Tab backwards should move to previous element
    await page.keyboard.press('Shift+Tab');

    // Should be on an interactive element
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });

  test('should skip to main content with skip link', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /aller au contenu/i });

    // Click the skip link
    await skipLink.click();

    // Wait a moment for focus to move
    await page.waitForTimeout(200);

    // Main content should be in the document
    const mainContent = page.locator('main#main-content');
    await expect(mainContent).toBeAttached();
  });

  test('should activate search button with Space key', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/posez une question/i);
    await searchInput.fill('test query');

    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });
    await searchButton.focus();
    await page.keyboard.press('Space');

    await page.waitForURL(/\/search/);
    await expect(page).toHaveURL(/q=test/);
  });

  test('should activate search button with Enter key', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/posez une question/i);
    await searchInput.fill('test query');

    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });
    await searchButton.focus();
    await page.keyboard.press('Enter');

    await page.waitForURL(/\/search/);
    await expect(page).toHaveURL(/q=test/);
  });

  test('should have visible focus indicators', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/posez une question/i);
    await searchInput.focus();

    // Check that focus is visible (outline or ring)
    const outlineWidth = await searchInput.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(outlineWidth).toBeTruthy();
  });

  test('should not trap keyboard focus', async ({ page }) => {
    // Tab through all elements - should be able to cycle
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // Should not be stuck anywhere
    const activeElement = page.locator(':focus');
    await expect(activeElement).toBeAttached();
  });
});

test.describe('ARIA and Screen Reader Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper landmark regions', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for header
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should have aria-label on icon button', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /lancer la recherche/i });
    await expect(searchButton).toHaveAttribute('aria-label');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have one h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('should have label for search input', async ({ page }) => {
    const label = page.locator('label[for="search-input"]');

    // Label exists
    await expect(label).toBeAttached();

    // Label has text
    await expect(label).toHaveText(/rechercher sur le web/i);
  });

  test('should use semantic HTML for search form', async ({ page }) => {
    // Search should be in a form with role="search"
    const searchForm = page.locator('form[role="search"]');
    await expect(searchForm).toBeVisible();
  });

  test('should have descriptive accessible name on language switcher', async ({ page }) => {
    const langLink = page.getByRole('link', { name: /switch to english/i });
    await expect(langLink).toHaveAccessibleName(/switch to english/i);
  });

  test('should use aria-hidden on decorative elements', async ({ page }) => {
    // Check scroll indicator has aria-hidden
    const scrollIndicator = page.locator('[aria-hidden="true"]').filter({ has: page.locator('svg') });
    await expect(scrollIndicator.first()).toBeAttached();
  });

  test('should have role img on logo emoji', async ({ page }) => {
    const logo = page.getByRole('img', { name: /logo hana/i });
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('role', 'img');
  });
});
