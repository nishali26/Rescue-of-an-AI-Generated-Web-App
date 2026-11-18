import { test, expect } from '@playwright/test'

test.describe('InvoiceGuard Security & Auth E2E Flow', () => {
  
  test('should redirect unauthenticated users trying to access dashboard to login page', async ({ page }) => {
    // 1. Seedha dashboard URL open karne ki koshish karein bina login kiye
    await page.goto('http://localhost:3000/dashboard')

    // 2. Verify karein ke application ne user ko rok kar /login par redirect kar diya hai
    await expect(page).toHaveURL(/.*login/)
  })

  test('should allow user to view login page and interact with form fields', async ({ page }) => {
    // 1. Login page par jayein
    await page.goto('http://localhost:3000/login')

    // 2. Check karein ke email aur password inputs mojood hain
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    // 3. Dummy credentials type karke check karein
    await emailInput.fill('testuser@invoiceguard.com')
    await passwordInput.fill('SecurePassword123!')
    
    await expect(emailInput).toHaveValue('testuser@invoiceguard.com')
  })
})