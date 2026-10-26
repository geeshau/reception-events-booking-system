"use server"

import { revalidatePath } from "next/cache"
import { getAllEvents, getEventById as getEventByIdStore, addEvent as addEventStore, updateEvent as updateEventStore, deleteEvent as deleteEventStore } from "@/lib/store/eventsStore"
import { writeLog } from "@/lib/logger"
import { createInvoiceForEvent } from "./invoices"

function validateTimes(start: string, end: string) {
  if (!start || !end) throw new Error("Start time and end time are required.")
  if (start >= end) throw new Error("End time must be after start time.")
}

export async function addEvent(formData: FormData) {
  const title = formData.get("eventName")?.toString().trim() || ""
  const date = formData.get("date")?.toString() || ""
  const end_date = formData.get("end_date")?.toString() || date
  const start_time = formData.get("start_time")?.toString() || ""
  const end_time = formData.get("end_time")?.toString() || ""
  const description = formData.get("description")?.toString() || ""
  const room_id = formData.get("room_id")?.toString() || null
  const client_id = formData.get("client_id")?.toString() || null
  const poster_url = formData.get("poster_url")?.toString() || null
  const location = (room_id && room_id !== "none") ? null : (formData.get("location")?.toString() || null)
  const total_cost = parseFloat(formData.get("total_cost") as string) || 0

  if (!title) throw new Error("Event name is required.")
  if (!date) throw new Error("Date is required.")
  validateTimes(start_time, end_time)

  if (room_id && room_id !== "none" && date && start_time && end_time) {
    const events = getAllEvents()
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number)
      return h * 60 + m
    }
    const s = toMinutes(start_time)
    const e = toMinutes(end_time)
    for (const c of events) {
      if (String(c.room_id) === String(room_id) && c.date === date) {
        const cs = toMinutes(c.start_time || "00:00")
        const ce = toMinutes(c.end_time || "00:00")
        if (s < ce && e > cs) {
          throw new Error(`Conflict: This Space is already booked for '${c.title}' during this time block.`)
        }
      }
    }
  }

  const newEvent = addEventStore({
    title,
    date,
    start_time,
    end_time,
    description,
    poster_url,
    location,
    total_cost,
    room_id: room_id === "none" ? null : room_id,
    client_id: client_id === "none" ? null : client_id,
    duration_hours: 1,
    color: "bg-blue-500",
    status: "confirmed",
    payment_status: "pending",
  })

  writeLog(`System booked new master timeline Event: '${title}' set for ${date}`, 'SUCCESS')

  try {
    if (newEvent && (total_cost > 0 || client_id)) {
      await createInvoiceForEvent(newEvent.id, {
        client_id: client_id === "none" ? null : client_id,
        amount: total_cost,
        currency: 'KES'
      })
    }
  } catch (e: any) {
    writeLog(`Invoice auto-creation failed for event ${newEvent?.id}: ${e.message}`, 'WARN')
  }

  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  revalidatePath("/")
  return [newEvent]
}

export async function deleteEvent(eventId: number | string) {
  const ok = deleteEventStore(eventId)
  if (!ok) throw new Error("Event not found")
  
  writeLog(`Administrative action forcibly wiped Event Record (UUID: ${eventId}) completely off grid`, 'WARN')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  revalidatePath("/")
}

export async function updateEvent(eventId: number | string, formData: FormData) {
  const title = formData.get("eventName")?.toString().trim() || ""
  const date = formData.get("date")?.toString() || ""
  const start_time = formData.get("start_time")?.toString() || ""
  const end_time = formData.get("end_time")?.toString() || ""
  const description = formData.get("description")?.toString() || ""
  const room_id = formData.get("room_id")?.toString() || null
  const client_id = formData.get("client_id")?.toString() || null
  const poster_url = formData.get("poster_url")?.toString() || null
  const location = formData.get("location")?.toString() || null
  const payment_status = formData.get("payment_status")?.toString() || undefined
  const total_cost = parseFloat(formData.get("total_cost") as string) || 0

  if (!title) throw new Error("Event name is required.")
  if (!date) throw new Error("Date is required.")
  validateTimes(start_time, end_time)

  if (room_id && room_id !== "none" && date && start_time && end_time) {
    const events = getAllEvents()
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number)
      return h * 60 + m
    }
    const s = toMinutes(start_time)
    const e = toMinutes(end_time)
    for (const c of events) {
      if (String(c.id) === String(eventId)) continue
      if (String(c.room_id) === String(room_id) && c.date === date) {
        const cs = toMinutes(c.start_time || "00:00")
        const ce = toMinutes(c.end_time || "00:00")
        if (s < ce && e > cs) {
          throw new Error(`Conflict: This Space is already booked for '${c.title}' during this time block.`)
        }
      }
    }
  }

  const updated = updateEventStore(eventId, {
    title,
    date,
    start_time,
    end_time,
    description,
    poster_url,
    location,
    total_cost,
    room_id: room_id === "none" ? null : room_id,
    client_id: client_id === "none" ? null : client_id,
    ...(payment_status ? { payment_status } : {}),
  })

  if (!updated) throw new Error("Event not found")
  
  writeLog(`Operator manually mutated configuration for Event record '${title}' (UUID: ${eventId})`, 'WARN')

  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  revalidatePath("/")
  return [updated]
}

export async function getEvents() {
  try {
    const events = getAllEvents()
    return [...events].sort((a: any, b: any) => {
      if (a.date === b.date) return (a.start_time || "").localeCompare(b.start_time || "")
      return (a.date || "").localeCompare(b.date || "")
    })
  } catch (err) {
    console.error("Failed to fetch events:", err)
    return []
  }
}

export async function getEventById(eventId: string | number) {
  const event = getEventByIdStore(eventId)
  if (!event) {
    throw new Error("Event not found")
  }
  return event
}

export async function updatePaymentStatus(eventId: string | number, status: string) {
  const updated = updateEventStore(eventId, { payment_status: status })
  if (!updated) throw new Error("Event not found")

  writeLog(`Payment status for event ${eventId} updated to ${status}`, 'INFO')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  return updated
}
