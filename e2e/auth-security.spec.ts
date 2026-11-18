import { test, expect } from '@playwright/test'

test.describe('InvoiceGuard Security & Auth E2E Flow', () => {
  
  test('should redirect unauthenticated users trying to access dashboard to login page', async ({ page }) => {
    // 1. Seedha dashboard URL open karne ki koshish karein bina login kiye
    await page.goto('http://localhost:3000/dashboard')
    
    // 2. Verify karein ke application ne user ko rok kar /login par redirect kar diya hai
    await expect(page).toHaveURL(/.*login/)
  })
})