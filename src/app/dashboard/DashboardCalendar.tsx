"use client"

import * as React from "react"
import { Calendar, momentLocalizer, Event as RBCEvent } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useRouter } from "next/navigation"

const localizer = momentLocalizer(moment)

interface BigEvent extends RBCEvent {
  id: number | string
  title: string
  color?: string
  description?: string
  location?: string
  total_cost?: number
  payment_status?: string
}

export default function DashboardCalendar({ events }: { events: BigEvent[] }) {
  const router = useRouter()
  const [view, setView] = React.useState<'month' | 'week' | 'day' | 'agenda'>('month')
  const [date, setDate] = React.useState(new Date())

  const handleSelectEvent = (event: BigEvent) => {
    router.push(`/edit-event/${event.id}`)
  }

  const eventStyleGetter = (event: BigEvent) => {
    let backgroundColor = '#00a650'
    if (event.color) {
      if (event.color.includes('red')) backgroundColor = '#ef4444'
      if (event.color.includes('blue')) backgroundColor = '#3b82f6'
      if (event.color.includes('yellow')) backgroundColor = '#f59e0b'
      if (event.color.includes('purple')) backgroundColor = '#8b5cf6'
      if (event.color.includes('indigo')) backgroundColor = '#6366f1'
      if (event.color.includes('green')) backgroundColor = '#10b981'
    }

    const isPast = moment(event.start).isBefore(moment(), 'day')

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: isPast ? 0.6 : 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        padding: '1px 4px',
        fontSize: '0.75rem'
      }
    }
  }

  return (
    <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dashboard-calendar .rbc-calendar { font-family: inherit; height: 600px; }
            .dashboard-calendar .rbc-toolbar { padding: 12px 16px; margin-bottom: 0; border-bottom: 1px solid #e5e7eb; }
            .dark .dashboard-calendar .rbc-toolbar { border-bottom-color: #262626; }
            .dashboard-calendar .rbc-btn-group button { border-color: #e5e7eb; color: #374151; font-size: 0.875rem; padding: 6px 12px; }
            .dark .dashboard-calendar .rbc-btn-group button { border-color: #404040; color: #d1d5db; background: transparent; }
            .dashboard-calendar .rbc-btn-group button:hover { background-color: #f9fafb; }
            .dark .dashboard-calendar .rbc-btn-group button:hover { background-color: #1a1a1a; }
            .dashboard-calendar .rbc-btn-group button.rbc-active { background-color: #f3f4f6; color: #111827; }
            .dark .dashboard-calendar .rbc-btn-group button.rbc-active { background-color: #262626; color: #f9fafb; }
            .dashboard-calendar .rbc-header { padding: 10px 0; font-weight: 500; font-size: 0.75rem; color: #6b7280; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
            .dark .dashboard-calendar .rbc-header { color: #9ca3af; border-bottom-color: #262626; }
            .dashboard-calendar .rbc-month-view, .dashboard-calendar .rbc-time-view, .dashboard-calendar .rbc-agenda-view { border: none; }
            .dashboard-calendar .rbc-day-bg + .rbc-day-bg, .dashboard-calendar .rbc-month-row + .rbc-month-row, .dashboard-calendar .rbc-header + .rbc-header { border-color: #f3f4f6; }
            .dark .dashboard-calendar .rbc-day-bg + .rbc-day-bg, .dark .dashboard-calendar .rbc-month-row + .rbc-month-row, .dark .rbc-header + .rbc-header { border-color: #1a1a1a; }
            .dashboard-calendar .rbc-today { background-color: #f0fdf4; }
            .dark .dashboard-calendar .rbc-today { background-color: rgba(0, 166, 80, 0.08); }
            .dashboard-calendar .rbc-off-range-bg { background: #fafafa; }
            .dark .dashboard-calendar .rbc-off-range-bg { background: #0a0a0a; }
            .dashboard-calendar .rbc-date-cell { padding: 4px 8px; font-size: 0.875rem; }
            .dashboard-calendar .rbc-event { cursor: pointer; }
            @media (max-width: 640px) {
              .dashboard-calendar .rbc-calendar { height: 500px; }
              .dashboard-calendar .rbc-toolbar { flex-direction: column; gap: 8px; align-items: stretch; }
              .dashboard-calendar .rbc-toolbar-label { text-align: center; }
            }
          `,
        }}
      />
      <div className="dashboard-calendar">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(v) => setView(v)}
          date={date}
          onNavigate={(d) => setDate(d)}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          popup
          views={['month', 'week', 'day', 'agenda']}
          toolbar
        />
      </div>
    </div>
  )
}
