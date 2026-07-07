import { expect, test } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    const html = page.locator('html');
    const themeToggle = page.getByRole('button', { name: /thème/i });

    // Should start in light mode
    await expect(html).not.toHaveClass(/dark/);

    // Toggle to dark
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    // Toggle back to light
    await themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /thème/i });

    // Toggle to dark
    await themeToggle.click();

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('hana-theme'));
    expect(theme).toBe('dark');

    // Reload page
    await page.reload();

    // Should still be dark
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should show correct icon for current theme', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /thème/i });

    // In light mode, should show moon icon (to switch to dark)
    const moonIcon = themeToggle.locator('[data-icon="moon"]');
    await expect(moonIcon).toBeVisible();

    // Toggle to dark
    await themeToggle.click();

    // In dark mode, should show sun icon (to switch to light)
    const sunIcon = themeToggle.locator('[data-icon="sun"]');
    await expect(sunIcon).toBeVisible();
  });

  test('should have accessible name indicating action', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /thème/i });
    await expect(themeToggle).toHaveAccessibleName();
  });

  test('should toggle theme with keyboard', async ({ page }) => {
    const html = page.locator('html');
    const themeToggle = page.getByRole('button', { name: /thème/i });

    await themeToggle.focus();
    await page.keyboard.press('Enter');

    await expect(html).toHaveClass(/dark/);

    await page.keyboard.press('Space');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should respect prefers-color-scheme on first visit', async ({ page }) => {
    // Set OS preference to dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should work across page navigations', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /thème/i });

    // Set to dark mode
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to search page
    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await searchInput.fill('test');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search/);

    // Should still be dark
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('Font Size Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have three font size options', async ({ page }) => {
    const fontSizeButtons = page.getByRole('button', { name: /taille de police/i });
    await expect(fontSizeButtons).toHaveCount(3);
  });

  test('should change font size when clicking buttons', async ({ page }) => {
    // Get initial font size
    const html = page.locator('html');
    const initialFontSize = await html.evaluate(el => window.getComputedStyle(el).fontSize);

    // Click large font button (A+)
    const largeFontButton = page.getByRole('button', { name: /a\+/i });
    await largeFontButton.click();

    const largeFontSize = await html.evaluate(el => window.getComputedStyle(el).fontSize);

    // Font size should have increased
    expect(parseFloat(largeFontSize)).toBeGreaterThan(parseFloat(initialFontSize));

    // Click extra large font button (A++)
    const xlargeFontButton = page.getByRole('button', { name: /a\+\+/i });
    await xlargeFontButton.click();

    const xlargeFontSize = await html.evaluate(el => window.getComputedStyle(el).fontSize);

    // Font size should be even larger
    expect(parseFloat(xlargeFontSize)).toBeGreaterThan(parseFloat(largeFontSize));
  });

  test('should persist font size preference in localStorage', async ({ page }) => {
    const xlargeFontButton = page.getByRole('button', { name: /a\+\+/i });
    await xlargeFontButton.click();

    // Check localStorage
    const fontSize = await page.evaluate(() => localStorage.getItem('hana-font-size'));
    expect(fontSize).toBe('xlarge');

    // Reload page
    await page.reload();

    // Should maintain xlarge font
    const html = page.locator('html');
    const currentFontSize = await html.evaluate(el => window.getComputedStyle(el).fontSize);

    // Should be larger than default
    expect(parseFloat(currentFontSize)).toBeGreaterThan(16);
  });

  test('should indicate active font size visually', async ({ page }) => {
    // Normal should be active by default
    const normalButton = page.getByRole('button', { name: /^a$/i });
    await expect(normalButton).toHaveAttribute('aria-pressed', 'true');

    // Click large
    const largeButton = page.getByRole('button', { name: /a\+/i });
    await largeButton.click();

    // Large should now be active
    await expect(largeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(normalButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should work with keyboard navigation', async ({ page }) => {
    const largeButton = page.getByRole('button', { name: /a\+/i });
    await largeButton.focus();
    await page.keyboard.press('Enter');

    const html = page.locator('html');
    const fontSize = await html.evaluate(el => window.getComputedStyle(el).fontSize);

    expect(parseFloat(fontSize)).toBeGreaterThan(16);
  });

  test('should apply font size immediately without page reload', async ({ page }) => {
    const html = page.locator('html');

    const xlargeFontButton = page.getByRole('button', { name: /a\+\+/i });
    await xlargeFontButton.click();

    // Wait for DOM update
    await page.waitForTimeout(100);

    // Check font size class is applied
    const hasClass = await html.evaluate(
      el => el.classList.contains('text-xlarge') || el.getAttribute('data-font-size') === 'xlarge',
    );

    expect(hasClass).toBeTruthy();
  });

  test('should work across page navigations', async ({ page }) => {
    const xlargeFontButton = page.getByRole('button', { name: /a\+\+/i });
    await xlargeFontButton.click();

    // Navigate to search
    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await searchInput.fill('test');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search/);

    // Font size should be maintained
    const html = page.locator('html');
    const fontSize = await html.evaluate(el => window.getComputedStyle(el).fontSize);

    expect(parseFloat(fontSize)).toBeGreaterThan(16);
  });

  test('should scale all text, not just body', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    const initialHeadingSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);

    const xlargeFontButton = page.getByRole('button', { name: /a\+\+/i });
    await xlargeFontButton.click();

    await page.waitForTimeout(100);

    const newHeadingSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);

    // Heading should also scale
    expect(parseFloat(newHeadingSize)).toBeGreaterThan(parseFloat(initialHeadingSize));
  });
});
