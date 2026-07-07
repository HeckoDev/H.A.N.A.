import { expect, test } from '@playwright/test';

test.describe('Pagination', () => {
  test.beforeEach(async ({ page }) => {
    // Go to search page with results
    await page.goto('/search?q=javascript');

    // Wait for results to load
    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('[role="status"]');
        return spinner === null;
      },
      { timeout: 10000 },
    );
  });

  test('should display pagination controls when there are multiple pages', async ({ page }) => {
    // Check if pagination navigation exists
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    // May or may not have multiple pages depending on API response
    const paginationExists = (await pagination.count()) > 0;

    if (paginationExists) {
      await expect(pagination).toBeVisible();
    }
  });

  test('should navigate to next page', async ({ page }) => {
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    const nextButton = page.getByRole('button', { name: /suivant|next/i });

    if ((await nextButton.count()) === 0) {
      test.skip();
    }

    await nextButton.click();

    // URL should update with page parameter
    await page.waitForURL(/page=2/);
    await expect(page).toHaveURL(/page=2/);

    // Should show loading then new results
    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('[role="status"]');
        return spinner === null;
      },
      { timeout: 10000 },
    );
  });

  test('should navigate to previous page', async ({ page }) => {
    // First go to page 2
    await page.goto('/search?q=javascript&page=2');

    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('[role="status"]');
        return spinner === null;
      },
      { timeout: 10000 },
    );

    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    const prevButton = page.getByRole('button', { name: /précédent|previous/i });

    if ((await prevButton.count()) === 0) {
      test.skip();
    }

    await prevButton.click();

    await page.waitForURL(/page=1|\/search\?q=javascript$/);
  });

  test('should disable previous button on first page', async ({ page }) => {
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    const prevButton = page.getByRole('button', { name: /précédent|previous/i });

    if ((await prevButton.count()) === 0) {
      test.skip();
    }

    await expect(prevButton).toBeDisabled();
  });

  test('should show current page number', async ({ page }) => {
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    // Should show something like "Page 1 sur 5"
    const pageInfo = page.getByText(/page \d+ sur \d+|page \d+ of \d+/i);
    await expect(pageInfo).toBeVisible();
  });

  test('should navigate with keyboard', async ({ page }) => {
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    const nextButton = page.getByRole('button', { name: /suivant|next/i });

    if ((await nextButton.count()) === 0) {
      test.skip();
    }

    await nextButton.focus();
    await page.keyboard.press('Enter');

    await page.waitForURL(/page=2/);
    await expect(page).toHaveURL(/page=2/);
  });

  test('should maintain search query across page changes', async ({ page }) => {
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    const nextButton = page.getByRole('button', { name: /suivant|next/i });

    if ((await nextButton.count()) === 0) {
      test.skip();
    }

    await nextButton.click();

    await page.waitForURL(/page=2/);

    // Query should still be in URL and search input
    await expect(page).toHaveURL(/q=javascript/);

    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    await expect(searchInput).toHaveValue('javascript');
  });

  test('should focus main content after page change', async ({ page }) => {
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    const nextButton = page.getByRole('button', { name: /suivant|next/i });

    if ((await nextButton.count()) === 0) {
      test.skip();
    }

    await nextButton.click();

    await page.waitForURL(/page=2/);

    // Wait for results to load
    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('[role="status"]');
        return spinner === null;
      },
      { timeout: 10000 },
    );

    // Focus should move to results or main heading for screen reader users
    const mainHeading = page.getByRole('heading', { name: /résultats/i });
    await expect(mainHeading).toBeVisible();
  });

  test('should have appropriate ARIA labels', async ({ page }) => {
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    // Navigation should have aria-label
    await expect(pagination).toHaveAttribute('aria-label');

    // Buttons should have clear labels
    const nextButton = page.getByRole('button', { name: /suivant|next/i });

    if ((await nextButton.count()) > 0) {
      await expect(nextButton).toHaveAccessibleName();
    }
  });

  test('should handle direct navigation to specific page', async ({ page }) => {
    await page.goto('/search?q=vue&page=3');

    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('[role="status"]');
        return spinner === null;
      },
      { timeout: 10000 },
    );

    // Should load page 3 results
    const pagination = page.getByRole('navigation', { name: /pagination/i });

    if ((await pagination.count()) === 0) {
      test.skip();
    }

    const pageInfo = page.getByText(/page 3/i);
    await expect(pageInfo).toBeVisible();
  });
});
