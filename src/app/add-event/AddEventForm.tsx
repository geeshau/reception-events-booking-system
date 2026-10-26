"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { addEvent } from "@/app/actions/events"

export default function AddEventForm({ clients, rooms }: { clients: any[], rooms: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [roomId, setRoomId] = useState("none")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorText("")
    
    try {
      const formData = new FormData(e.currentTarget)
      await addEvent(formData)
      alert("Event successfully scheduled!")
      // @ts-ignore
      e.target.reset()
    } catch (error: any) {
      console.error(error)
      setErrorText(error.message || "Failed to schedule event.")
    } finally {
      setIsSubmitting(false)
    }
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
        <Input id="eventName" name="eventName" type="text" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="client_id">Assign Client / Organizer</Label>
          <select id="client_id" name="client_id" className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="none">-- No Client Selected --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.first_name} {c.last_name} {c.company_name ? `(${c.company_name})` : ''}</option>
            ))}
            <option value="add_new">+ Add New Client</option>
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
          <Label htmlFor="total_cost">Agreed Event Charge (KSh)</Label>
          <Input id="total_cost" name="total_cost" type="number" placeholder="Enter amount in shillings" defaultValue={roomId !== "none" ? rooms.find(r => r.id === roomId)?.min_price || 0 : 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" name="date" type="date" required />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" name="end_date" type="date" />
        </div>
        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input id="start_time" name="start_time" type="time" required />
        </div>
        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input id="end_time" name="end_time" type="time" required />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Event Description & Notes</Label>
        <Textarea id="description" name="description" />
      </div>

      <div>
        <Label htmlFor="poster_url">Promotional Poster URL / Leaflet Link</Label>
        <Input id="poster_url" name="poster_url" type="url" placeholder="https://example.com/poster.jpg" />
        <p className="text-xs text-slate-500 mt-1.5 font-medium">Link directly to a .png or .jpg file stored on Google Drive, AWS, or directly hosted.</p>
      </div>

      <div className="text-right">
        <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {isSubmitting ? "Booking Space..." : "Schedule Event"}
        </Button>
      </div>
    </form>
  )
}
