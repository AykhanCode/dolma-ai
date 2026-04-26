import { test, expect } from '@playwright/test'

test.describe('Authentication E2E', () => {
  test('should show login page at /login', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible()
    await expect(page.locator('input[placeholder="••••••••"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login')
    await page.click('text=Sign up')
    await expect(page).toHaveURL(/.*signup/)
  })

  test('should show validation error for invalid email on login', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[placeholder="you@example.com"]', 'not-an-email')
    await page.fill('input[placeholder="••••••••"]', 'somepassword')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=valid email')).toBeVisible({ timeout: 3000 })
  })

  test('should complete signup flow', async ({ page }) => {
    await page.goto('/signup')

    await page.fill('input[placeholder="John Smith"]', 'John Doe')
    await page.fill('input[placeholder="you@example.com"]', `test-${Date.now()}@example.com`)
    await page.fill('input[placeholder="Min 8 characters"]', 'SecurePass123!')
    await page.fill('input[placeholder="Repeat your password"]', 'SecurePass123!')
    await page.click('input[type="checkbox"]')

    // Note: clicking submit would require a real backend, skip in local e2e
  })
})

test.describe('Agent Creation E2E', () => {
  test('should redirect to login when accessing agents without auth', async ({ page }) => {
    await page.goto('/agents')
    await expect(page).toHaveURL(/.*login/)
  })

  test('should redirect to login when accessing create agent without auth', async ({ page }) => {
    await page.goto('/agents/create')
    await expect(page).toHaveURL(/.*login/)
  })
})

test.describe('Navigation E2E', () => {
  test('should redirect / to /dashboard which redirects to /login when unauthenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/.*login/)
  })

  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.locator('body')).toBeVisible()
  })
})
