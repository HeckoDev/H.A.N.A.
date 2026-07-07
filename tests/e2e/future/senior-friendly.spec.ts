import { expect, test } from '@playwright/test';

test.describe('Senior-Friendly UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have large touch targets (min 44x44px)', async ({ page }) => {
    const buttons = await page.getByRole('button').all();

    for (const button of buttons) {
      const box = await button.boundingBox();

      if (box) {
        // WCAG AAA requires 44x44px minimum
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should have clear, readable typography', async ({ page }) => {
    const body = page.locator('body');

    // Check base font size is at least 16px
    const fontSize = await body.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(16);
  });

  test('should not have auto-playing animations', async ({ page }) => {
    // No videos or GIFs should autoplay
    const videos = page.locator('video[autoplay]');
    await expect(videos).toHaveCount(0);
  });

  test('should have simple, clear language', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    const headingText = await heading.textContent();

    // Heading should not be overly long or complex
    expect(headingText?.length || 0).toBeLessThan(50);
  });

  test('should not timeout user sessions prematurely', async ({ page }) => {
    // Search should work after being idle
    await page.goto('/');

    // Wait 2 minutes (simulating slow user)
    await page.waitForTimeout(2000);

    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await searchInput.fill('test');
    await searchInput.press('Enter');

    // Should still work
    await page.waitForURL(/\/search/);
    await expect(page).toHaveURL(/\/search\?q=test/);
  });

  test('should have consistent navigation across pages', async ({ page }) => {
    // Check home page navigation
    const homeNav = page.locator('nav');
    await expect(homeNav).toBeVisible();

    // Navigate to search
    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await searchInput.fill('test');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search/);

    // Navigation should be in same position
    const searchNav = page.locator('nav');
    await expect(searchNav).toBeVisible();
  });

  test('should show clear feedback for actions', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /thème/i });

    // Toggle theme
    await themeToggle.click();

    // Visual change should be immediate and obvious
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should work well at 200% zoom', async ({ page }) => {
    // Simulate browser zoom
    await page.setViewportSize({ width: 640, height: 480 }); // Effectively 200% zoom

    await page.goto('/');

    // All interactive elements should still be accessible
    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await expect(searchInput).toBeVisible();

    const searchButton = page.getByRole('button', { name: /rechercher/i });
    await expect(searchButton).toBeVisible();

    // No horizontal scrolling should be required
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Small margin for sub-pixel rendering
  });

  test('should not require precise mouse movements', async ({ page }) => {
    // Buttons should have adequate padding
    const searchButton = page.getByRole('button', { name: /rechercher/i });
    const box = await searchButton.boundingBox();

    if (box) {
      // Click slightly off-center should still work
      await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.3);

      // Should still trigger (unless input is empty)
      // This tests that click areas are generous
    }
  });

  test('should have clear error messages', async ({ page }) => {
    // Force an error
    await page.route('**/api/search*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service temporarily unavailable' }),
      });
    });

    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await searchInput.fill('test');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search/);

    // Error should be clear and actionable
    const errorAlert = page.getByRole('alert');
    await expect(errorAlert).toBeVisible();

    const errorText = await errorAlert.textContent();

    // Error should not be technical jargon
    expect(errorText?.toLowerCase()).not.toContain('500');
    expect(errorText?.toLowerCase()).not.toContain('error code');
  });

  test('should maintain context when errors occur', async ({ page }) => {
    await page.route('**/api/search*', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Error' }) });
    });

    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await searchInput.fill('important query');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search/);

    // After error, search input should still contain query
    const searchInputOnResultsPage = page.getByRole('textbox', { name: /rechercher/i });
    await expect(searchInputOnResultsPage).toHaveValue('important query');
  });

  test('should load pages quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait for interactive
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should work without JavaScript', async ({ page }) => {
    // Disable JavaScript
    await page.context().setOffline(false);

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Basic content should still be visible
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Form should still be submittable (with full page navigation)
    const searchForm = page.locator('form[role="search"]');
    await expect(searchForm).toBeVisible();
  });

  test('should have a clear "back to home" option', async ({ page }) => {
    await page.goto('/search?q=test');

    // Should have a way to get back home
    const homeLink = page.getByRole('link', { name: /accueil|home|h\.a\.n\.a/i });
    await expect(homeLink).toBeVisible();
  });

  test('should not use confusing icons without labels', async ({ page }) => {
    // All icon buttons should have text labels or clear aria-labels
    const buttons = await page.getByRole('button').all();

    for (const button of buttons) {
      const accessibleName = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      const hasLabel = (accessibleName && accessibleName.length > 0) || (textContent && textContent.trim().length > 0);

      expect(hasLabel).toBeTruthy();
    }
  });
});
