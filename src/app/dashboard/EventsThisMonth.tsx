"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Users } from "react-feather"
import moment from "moment"
import EventEditModal from "@/components/EventEditModal"

interface EventCardProps {
  event: any
  onClick: (id: string | number) => void
  rooms?: any[]
}

function EventCard({ event, onClick, rooms = [] }: EventCardProps) {
  const date = event.date ? moment(event.date) : null
  let room = event.rooms || null
  if (!room && event.room_id) {
    room = rooms.find((r: any) => String(r.id) === String(event.room_id)) || null
  }
  const roomImage = room?.image_url || event.image_url || event.poster_url || null
  const [imgKey, setImgKey] = useState(0)
  
  return (
    <div onClick={() => onClick(event.id)} className="cursor-pointer">
      <div className="flex-shrink-0 w-[200px] xs:w-[220px] sm:w-[320px] h-[260px] sm:h-[380px] flex flex-col bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg hover:border-gray-300 dark:hover:border-[#404040] hover:shadow-sm transition-all overflow-hidden">
        {roomImage && (
          <div className="w-full h-24 xs:h-28 sm:h-36 flex-shrink-0 overflow-hidden">
            <img 
              key={imgKey}
              src={roomImage}
              alt={room?.name || event.location || "Event venue"} 
              className="w-full h-full object-cover" 
              onError={(e) => { 
                const target = e.currentTarget as HTMLImageElement
                if (!target.dataset.fallback) {
                  target.dataset.fallback = 'true'
                  target.src = '/images/placeholder-room.svg'
                } else {
                  target.style.display = 'none'
                }
              }} 
            />
          </div>
        )}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col">
          <div className="mb-1 sm:mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm line-clamp-2 leading-tight">
              {event.title}
            </h3>
          </div>
          
          {event.description && (
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-1 sm:line-clamp-2 mb-1.5 sm:mb-3">
              {event.description}
            </p>
          )}
          
          <div className="space-y-1">
            {date && (
              <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{date.format('MMM DD, YYYY')}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>
                {event.start_time?.substring(0, 5)} - {event.end_time?.substring(0, 5)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="truncate">
                {room?.name || event.location || 'TBD'}
              </span>
            </div>
            {(event.expected_people || event.attendees || room?.capacity) && (
              <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>
                  {event.expected_people || event.attendees || room?.capacity} people
                </span>
              </div>
            )}
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
      const width = window.innerWidth
      const scrollAmount = width < 480 ? 210 : width < 640 ? 230 : 340
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
              <EventCard key={event.id} event={event} onClick={setSelectedEventId} rooms={rooms} />
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
