import { demoEvents } from "@/data/demoEvents"

type Event = any

let events: Event[] = (demoEvents as Event[]).map((e, idx) => ({
  ...e,
  id: e.id ?? idx + 1,
}))

let nextId = events.length + 1

export function getAllEvents(): Event[] {
  return events
}

export function getEventById(id: string | number): Event | undefined {
  return events.find((e) => String(e.id) === String(id))
}

export function addEvent(event: Event): Event {
  const newEvent = {
    ...event,
    id: nextId++,
  }
  events.push(newEvent)
  return newEvent
}

export function updateEvent(id: string | number, updates: Event): Event | undefined {
  const index = events.findIndex((e) => String(e.id) === String(id))
  if (index === -1) return undefined
  events[index] = { ...events[index], ...updates }
  return events[index]
}

export function deleteEvent(id: string | number): boolean {
  const index = events.findIndex((e) => String(e.id) === String(id))
  if (index === -1) return false
  events.splice(index, 1)
  return true
}

export function resetEvents() {
  events = (demoEvents as Event[]).map((e, idx) => ({
    ...e,
    id: e.id ?? idx + 1,
  }))
  nextId = events.length + 1
}
