import { getEvents } from "@/app/actions/events"
import CalendarClient from "./CalendarClient"

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const data = await getEvents() || []
  
  // Cleanly map the raw Supabase data into react-big-calendar format
  const formattedEvents = data.map((evt: any) => {
    const [year, month, day] = evt.date.split("-").map(Number)
    const [startHours, startMinutes] = (evt.start_time || "00:00").split(":").map(Number)
    const [endHours, endMinutes] = (evt.end_time || "00:00").split(":").map(Number)
    
    return {
      id: evt.id,
      title: evt.title,
      start: new Date(year, month - 1, day, startHours, startMinutes),
      end: new Date(year, month - 1, day, endHours, endMinutes),
      color: evt.color || 'bg-indigo-500',
      description: evt.description,
      location: evt.rooms?.name || evt.location || 'Location TBD',
      total_cost: evt.total_cost,
      payment_status: evt.payment_status,
    }
  })

  return (
    <main className="h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950">
      <CalendarClient initialEvents={formattedEvents} />
    </main>
  )
}