import { describe, it, expect } from 'vitest'

/**
 * Enterprise Security Test: BOLA (Broken Object Level Authorization) Prevention
 * Yeh function simulate karta hai ke agar User A kisi doosre user ki invoice ID 
 * access karne ki koshish kare, toh system access deny kar de.
 */
async function getInvoiceByIdSecure(invoiceId: string, currentUserId: string) {
  // Simulated database records with ownership mapping
  const mockDatabase = [
    { id: 'inv_001', userId: 'user_A_123', amount: 5000, client: 'TechCorp' },
    { id: 'inv_002', userId: 'user_B_456', amount: 3000, client: 'GlobalSoft' },
  ]

  const invoice = mockDatabase.find(inv => inv.id === invoiceId)

  // Security Check: Agar invoice exist nahi karti ya user ID match nahi karti
  if (!invoice || invoice.userId !== currentUserId) {
    throw new Error('Security Alert: Unauthorized BOLA / IDOR Access Blocked')
  }

  return invoice
}

describe('InvoiceGuard BOLA & IDOR Security Audits', () => {
  
  it('should successfully allow a user to access their own invoice', async () => {
    // User A ('user_A_123') apni hi invoice ('inv_001') fetch kar raha hai
    const result = await getInvoiceByIdSecure('inv_001', 'user_A_123')
    
    expect(result).toBeDefined()
    expect(result.id).toBe('inv_001')
    expect(result.amount).toBe(5000)
  })

  it('should strictly block User A from accessing User B invoice (BOLA Prevention)', async () => {
    // User A ('user_A_123'), User B ki invoice ('inv_002') access karne ki na-kaam koshish kar raha hai
    await expect(
      getInvoiceByIdSecure('inv_002', 'user_A_123')
    ).rejects.toThrow('Security Alert: Unauthorized BOLA / IDOR Access Blocked')
  })

})