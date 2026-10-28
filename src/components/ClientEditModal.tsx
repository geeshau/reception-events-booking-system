"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateClient, deleteClient } from "@/app/actions/clients"
import { useRouter } from "next/navigation"

interface ClientEditModalProps {
  client: any | null
  isOpen: boolean
  onClose: () => void
}

export default function ClientEditModal({ client, isOpen, onClose }: ClientEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState("")
  const router = useRouter()

  useEffect(() => {
    setErrorText("")
  }, [client, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!client) return
    setIsSubmitting(true)
    setErrorText("")
    try {
      const formData = new FormData(e.currentTarget)
      await updateClient(String(client.id), formData)
      alert("Client updated successfully!")
      router.refresh()
      onClose()
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      setErrorText(error.message || "Failed to update client.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!client) return
    if (!confirm("Are you sure you want to delete this client?")) return
    setIsSubmitting(true)
    try {
      await deleteClient(String(client.id))
      alert("Client deleted successfully!")
      router.refresh()
      onClose()
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      alert("Error deleting: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !client) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#262626]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Client Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {errorText && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
              {errorText}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input id="first_name" name="first_name" type="text" required defaultValue={client.first_name} />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input id="last_name" name="last_name" type="text" required defaultValue={client.last_name} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue={client.email || ""} />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input id="phone_number" name="phone_number" type="text" defaultValue={client.phone_number || ""} />
            </div>
            <div>
              <Label htmlFor="company_name">Company (Optional)</Label>
              <Input id="company_name" name="company_name" type="text" defaultValue={client.company_name || ""} />
            </div>
            <div className="flex justify-between gap-2 pt-4">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>Delete</Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#00a650] hover:bg-[#008f44] text-white">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
