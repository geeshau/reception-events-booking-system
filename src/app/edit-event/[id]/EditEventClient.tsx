"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateEvent } from "@/app/actions/events"

export default function EditEventClient({ event, clients, rooms }: { event: any, clients: any[], rooms: any[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState("")
  
  // Safely prepopulate all relationships based on the backend data payload
  const [roomId, setRoomId] = useState(event?.room_id || "none")
  
  // Slice off any fractional seconds from Supabase time values securely
  const formatTime = (timeStr: string) => timeStr ? timeStr.substring(0, 5) : ""

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorText("")
    
    try {
      const formData = new FormData(e.currentTarget)
      await updateEvent(event.id, formData)
      alert("Event updated successfully!")
      router.push("/calendar")
    } catch (error: any) {
      console.error(error)
      setErrorText(error.message || "Failed to update event.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!event) {
    return <div className="text-gray-500">Event record failed to load. Please return to the calendar.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorText && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
          {errorText}
        </div>
      )}
      
      <div>
        <Label htmlFor="eventName">Event Name</Label>
        <Input id="eventName" name="eventName" type="text" defaultValue={event.title} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="client_id">Assign Client / Organizer</Label>
          <select id="client_id" name="client_id" defaultValue={event.client_id || "none"} className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="none">-- No Client Selected --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.first_name} {c.last_name} {c.company_name ? `(${c.company_name})` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="room_id">Select Room / Space</Label>
          <select id="room_id" name="room_id" onChange={(e) => setRoomId(e.target.value)} value={roomId} className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="none">-- None --</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>
            ))}
          </select>
          {roomId !== "none" && (
            <div className="mt-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-100 dark:border-indigo-800 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 animate-in fade-in slide-in-from-left-1">
              Recommended Charge: {rooms.find(r => r.id === roomId)?.min_price?.toLocaleString()} - {rooms.find(r => r.id === roomId)?.max_price?.toLocaleString()} KSh
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" type="text" defaultValue={event.location || ""} placeholder="Enter location" />
        </div>
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Label htmlFor="total_cost">Agreed Event Charge (KSh)</Label>
          <Input id="total_cost" name="total_cost" type="number" defaultValue={event.total_cost || 0} placeholder="Enter amount in shillings" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={event.date} required />
        </div>
        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input id="start_time" name="start_time" type="time" defaultValue={formatTime(event.start_time)} required />
        </div>
        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input id="end_time" name="end_time" type="time" defaultValue={formatTime(event.end_time)} required />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Event Description & Notes</Label>
        <Textarea id="description" name="description" defaultValue={event.description || ""} />
      </div>

      <div>
        <Label htmlFor="poster_url">Promotional Poster URL / Leaflet Link</Label>
        <Input id="poster_url" name="poster_url" type="url" defaultValue={event.poster_url || ""} placeholder="https://example.com/poster.jpg" />
        <p className="text-xs text-slate-500 mt-1.5 font-medium">Link directly to a .png or .jpg file stored on Google Drive, AWS, or directly hosted.</p>
      </div>

      <div className="text-right flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/calendar")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {isSubmitting ? "Saving Changes..." : "Save Event"}
        </Button>
      </div>
    </form>
  )
}
