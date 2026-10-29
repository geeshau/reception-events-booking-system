"use client"

import { useState } from "react"
import { Send, X } from "lucide-react"
import { sendEmailCampaign } from "@/app/actions/campaigns"
import { Button } from "@/components/ui/button"

export default function EmailCampaignsClient({ clients }: { clients: any[] }) {
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorText("")
    const formData = new FormData(e.currentTarget)
    try {
      const res: any = await sendEmailCampaign(formData)
      alert(`Campaign sent to ${res.count} recipient(s).`)
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      setErrorText(err.message || "Failed to send campaign.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-200 dark:border-[#262626] p-6">
      {errorText && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
          {errorText}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient</label>
          <select name="recipients" className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white">
            <option value="all">All clients with email</option>
            {clients.filter(c => c.email).map(c => (
              <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
          <input type="text" name="subject" required className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea name="body" required rows={8} className="w-full px-3 py-2 border border-gray-200 dark:border-[#262626] rounded-lg bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white" />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#262626]">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Sending..." : "Send Campaign"}
          </Button>
        </div>
      </form>
    </div>
  )
}
