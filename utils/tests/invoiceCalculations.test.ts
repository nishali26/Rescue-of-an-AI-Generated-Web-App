import { describe, it, expect } from 'vitest'

// Sample helper function jo invoices ke total amount ko calculate karta hai
function calculateTotalRevenue(invoices: { amount: number; status: string }[]): number {
  return invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
}

describe('Invoice Calculations Unit Tests', () => {
  it('should correctly calculate total revenue from paid invoices only', () => {
    const mockInvoices = [
      { amount: 1500, status: 'paid' },
      { amount: 500, status: 'pending' },
      { amount: 2000, status: 'paid' },
    ]

    const result = calculateTotalRevenue(mockInvoices)
    
    // Expectation: Sirf paid invoices (1500 + 2000) ka sum 3500 hona chahiye
    expect(result).toBe(3500)
  })

  it('should return 0 if there are no paid invoices', () => {
    const mockInvoices = [
      { amount: 1000, status: 'pending' },
      { amount: 300, status: 'overdue' },
    ]

    const result = calculateTotalRevenue(mockInvoices)
    expect(result).toBe(0)
  })
})