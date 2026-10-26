"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "react-feather"
import moment from "moment"
import EventEditModal from "@/components/EventEditModal"

interface EventCardProps {
  event: any
  onClick: (id: string | number) => void
}

function EventCard({ event, onClick }: EventCardProps) {
  const date = event.date ? moment(event.date) : null
  const room = event.rooms || null
  const roomImage = room?.image_url || event.image_url || (event.room_id ? null : null)
  
  return (
    <div onClick={() => onClick(event.id)} className="cursor-pointer">
      <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg hover:border-gray-300 dark:hover:border-[#404040] hover:shadow-sm transition-all overflow-hidden">
        {roomImage && (
          <div className="w-full h-36 overflow-hidden">
            <img 
              src={roomImage} 
              alt={room?.name || event.location || "Event venue"} 
              className="w-full h-full object-cover" 
              onError={(e) => { 
                // If local image fails, try to hide gracefully
                (e.currentTarget as HTMLImageElement).style.display = 'none'; 
              }} 
            />
          </div>
        )}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
              {event.title}
            </h3>
          </div>
          
          {event.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {event.description}
            </p>
          )}
          
          <div className="space-y-1.5">
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
                {room?.name || event.location || 'TBD'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventsThisMonth({ events, clients = [], rooms = [] }: { events: any[], clients?: any[], rooms?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(null)
  const now = moment().startOf('day')
  const upcomingEvents = events
    .filter((e) => {
      if (!e.date) return false
      const eventDate = moment(e.date).startOf('day')
      return eventDate.isSameOrAfter(now)
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

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
      <div className="relative group">
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-full p-2 shadow-md hover:bg-gray-50 dark:hover:bg-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-full p-2 shadow-md hover:bg-gray-50 dark:hover:bg-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div 
          ref={scrollRef}
          className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} onClick={setSelectedEventId} />
            ))}
          </div>
        </div>
      </div>
      <EventEditModal 
        eventId={selectedEventId} 
        isOpen={!!selectedEventId} 
        onClose={() => setSelectedEventId(null)} 
        clients={clients}
        rooms={rooms}
      />
    </section>
  )
}
