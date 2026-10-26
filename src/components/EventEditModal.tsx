"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getEventById, updateEvent, deleteEvent } from "@/app/actions/events"
import { useRouter } from "next/navigation"

interface EventEditModalProps {
  eventId: string | number | null
  isOpen: boolean
  onClose: () => void
  clients?: any[]
  rooms?: any[]
}

export default function EventEditModal({ eventId, isOpen, onClose, clients = [], rooms = [] }: EventEditModalProps) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [roomId, setRoomId] = useState("none")
  const router = useRouter()

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId || !isOpen) {
        setEvent(null)
        return
      }
      setLoading(true)
      try {
        const data = await getEventById(eventId)
        setEvent(data)
        setRoomId(data?.room_id ? String(data.room_id) : "none")
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [eventId, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!eventId) return
    setIsSubmitting(true)
    setErrorText("")
    
    try {
      const formData = new FormData(e.currentTarget)
      await updateEvent(eventId, formData)
      alert("Event updated successfully!")
      router.refresh()
      onClose()
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      setErrorText(error.message || "Failed to update event.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!eventId) return
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return
    setIsSubmitting(true)
    setErrorText("")
    try {
      await deleteEvent(eventId)
      alert("Event deleted successfully!")
      router.refresh()
      onClose()
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      setErrorText(error.message || "Failed to delete event.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#262626]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Event Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : event ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorText && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                  {errorText}
                </div>
              )}
              
              <div>
                <Label htmlFor="eventName">Event Name</Label>
                <Input id="eventName" name="eventName" type="text" required defaultValue={event.title} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_id">Client / Organizer</Label>
                  <select id="client_id" name="client_id" defaultValue={event.client_id || "none"} className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="none">-- No Client --</option>
                    {clients.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name} {c.company_name ? `(${c.company_name})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="room_id">Room / Space</Label>
                  <select id="room_id" name="room_id" onChange={(e) => setRoomId(e.target.value)} value={roomId} className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="none">-- None --</option>
                    {rooms.map((r: any) => (
                      <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="total_cost">Event Charge (KSh)</Label>
                  <Input id="total_cost" name="total_cost" type="number" defaultValue={event.total_cost || 0} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required defaultValue={event.date} />
                </div>
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input id="start_time" name="start_time" type="time" required defaultValue={event.start_time} />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input id="end_time" name="end_time" type="time" required defaultValue={event.end_time} />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_status">Payment Status</Label>
                <select id="payment_status" name="payment_status" defaultValue={event.payment_status || "pending"} className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description & Notes</Label>
                <Textarea id="description" name="description" defaultValue={event.description || ""} rows={3} />
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
          ) : (
            <div className="text-center py-8 text-gray-500">Event not found</div>
          )}
        </div>
      </div>
    </div>
  )
}
