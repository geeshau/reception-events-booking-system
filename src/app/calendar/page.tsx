import { getEvents } from "@/app/actions/events"
import CalendarClient from "./CalendarClient"
import { demoEvents } from "@/data/demoEvents"

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  let data: any[] = [];
  try {
    data = await getEvents() || [];
  } catch (err) {
    data = [];
  }
  if (!data || data.length === 0) data = demoEvents as any;
  
  // Cleanly map the raw data into react-big-calendar format
  const formattedEvents = data.map((evt: any) => {
    if (!evt.date) return null
    const [year, month, day] = evt.date.split("-").map((n: string) => parseInt(n))
    const [startHours, startMinutes] = (evt.start_time || "00:00").split(":").map((n: string) => parseInt(n))
    const [endHours, endMinutes] = (evt.end_time || "00:00").split(":").map((n: string) => parseInt(n))
    if (isNaN(year)) return null
    
    return {
      id: evt.id,
      title: evt.title,
      start: new Date(year, month - 1, day, startHours || 0, startMinutes || 0),
      end: new Date(year, month - 1, day, endHours || 0, endMinutes || 0),
      color: evt.color || 'bg-[#00a650]',
      description: evt.description,
      location: evt.rooms?.name || evt.location || 'Location TBD',
      total_cost: evt.total_cost,
      payment_status: evt.payment_status,
    }
  }).filter(Boolean)

  return (
    <main className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950">
      <CalendarClient initialEvents={formattedEvents} />
    </main>
  )
}