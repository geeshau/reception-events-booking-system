"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin } from "react-feather"
import moment from "moment"

interface EventCardProps {
  event: any
}

function EventCard({ event }: EventCardProps) {
  const date = event.date ? moment(event.date) : null
  
  return (
    <Link href={`/edit-event/${event.id}`}>
      <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg hover:border-gray-300 dark:hover:border-[#404040] hover:shadow-sm transition-all cursor-pointer overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${event.color?.replace('bg-', 'bg-') || 'bg-[#00a650]'}`} />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 flex-1">
              {event.title}
            </h3>
          </div>
          
          {event.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 ml-4">
              {event.description}
            </p>
          )}
          
          <div className="space-y-1.5 ml-4">
            {date && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{date.format('MMM DD, YYYY')}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>
                {event.start_time?.substring(0, 5)} - {event.end_time?.substring(0, 5)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {event.rooms?.name || event.location || 'TBD'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function EventsThisMonth({ events }: { events: any[] }) {
  const now = moment().startOf('day')
  const upcomingEvents = events
    .filter((e) => {
      if (!e.date) return false
      const eventDate = moment(e.date).startOf('day')
      return eventDate.isSameOrAfter(now)
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (upcomingEvents.length === 0) {
    return (
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
        </div>
        <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg p-6 text-center text-sm text-gray-500 dark:text-gray-400">
          No upcoming events
        </div>
      </section>
    )
  }

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Upcoming Events ({upcomingEvents.length})
        </h2>
        <Link href="/calendar" className="text-xs sm:text-sm text-[#00a650] hover:underline">
          View calendar
        </Link>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}
