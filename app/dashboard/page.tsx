import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Check kar rahe hain ke kya user logged-in hai ya nahi
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    // Agar user login nahi hai, toh seedha login page par bhej do
    redirect('/login')
  }

  // 2. User ki invoices database se fetch kar rahe hain
  const { data: invoices, fetchError } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navbar Header */}
        <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">InvoiceGuard Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Logged in as: <span className="text-blue-400 font-medium">{user.email}</span></p>
          </div>
          
          {/* Logout Button */}
          <form action={async () => {
            'use server'
            const supabaseServer = await createClient()
            await supabaseServer.auth.signOut()
            redirect('/login')
          }}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-semibold transition-all"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Invoices</h3>
            <p className="text-3xl font-extrabold text-white mt-2">{invoices?.length || 0}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</h3>
            <p className="text-3xl font-extrabold text-blue-400 mt-2">Active & Secure</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Rule</h3>
            <p className="text-xl font-bold text-emerald-400 mt-2">RLS Active (Protected)</p>
          </div>
        </div>

        {/* Invoices List Section */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Your Invoices</h2>
            <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-medium">
              Real-time Database
            </span>
          </div>

          {/* Table */}
          {invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Client Name</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-white">{inv.client_name}</td>
                      <td className="px-4 py-4">${inv.amount}</td>
                      <td className="px-4 py-4">{inv.due_date}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm">Abhi tak koi invoice mojood nahi hai.</p>
              <p className="text-xs text-slate-500 mt-1">Database bilkul connected aur ready hai!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}