"use client"

import { useState } from "react"
import { Users, Plus, Mail, Phone, Trash2, X } from "lucide-react"
import { addClient, deleteClient } from "@/app/actions/clients"
import { Button } from "@/components/ui/button"

export default function ClientListClient({ initialClients }: { initialClients: any[] }) {
  const [clients, setClients] = useState(initialClients)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      await addClient(formData)
      // Form submitted successfully, just refresh the page data
      window.location.reload()
    } catch (err: any) {
      alert("Error adding client: " + err.message)
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteClient(id)
      setClients(clients.filter(c => c.id !== id))
    } catch (err: any) {
      alert("Error deleting: " + err.message)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-200 dark:border-[#262626] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#262626] flex justify-between items-center bg-gray-50/50 dark:bg-[#141414]">
          <div className="relative w-64">
             <input type="text" placeholder="Search clients..." className="w-full pl-3 pr-4 py-2 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#262626] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a650]" />
          </div>
          <Button onClick={() => setIsAdding(true)} className="bg-[#00a650] hover:bg-[#008f44] text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Client
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#0f0f0f] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#262626]">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Users className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                    No clients added yet.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition border-b border-gray-100 dark:border-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 text-[#00a650] dark:text-[#00a650] flex items-center justify-center font-bold mr-3">
                          {client.first_name[0]}{client.last_name[0]}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{client.first_name} {client.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      {client.email && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Mail className="h-3.5 w-3.5 mr-2" /> {client.email}
                        </div>
                      )}
                      {client.phone_number && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Phone className="h-3.5 w-3.5 mr-2" /> {client.phone_number}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {client.company_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">Add New Client</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                  <input type="text" name="first_name" required className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                  <input type="text" name="last_name" required className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="email" name="email" className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input type="text" name="phone_number" className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company (Optional)</label>
                <input type="text" name="company_name" className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white" />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#262626]">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#00a650] hover:bg-[#008f44] text-white" disabled={loading}>
                  {loading ? "Saving..." : "Save Client"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
