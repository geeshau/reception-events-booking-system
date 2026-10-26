"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock } from 'react-feather'
import EventEditModal from "@/components/EventEditModal"

export default function EventDirectoryClient({ events, clients = [], rooms = [] }: { events: any[], clients?: any[], rooms?: any[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(null)

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {events.length === 0 ? (
          <div className="border border-gray-200 dark:border-[#262626] rounded-lg p-8 sm:p-12 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            There are no scheduled events at this time.
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className="border border-gray-200 dark:border-[#262626] rounded-lg hover:border-gray-300 dark:hover:border-[#404040] transition-colors overflow-hidden bg-white dark:bg-[#141414] cursor-pointer"
            >
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {(event.rooms?.image_url || event.image_url) && (
                  <img 
                    src={event.rooms?.image_url || event.image_url} 
                    alt={event.rooms?.name || event.location || event.title} 
                    className="w-full sm:w-24 h-32 sm:h-16 rounded object-cover flex-shrink-0" 
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className={`w-full sm:w-1 h-1 sm:h-16 rounded-full flex-shrink-0 ${event.color?.replace('bg-', 'bg-') || 'bg-[#00a650]'}`} />
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {event.title}
                  </h2>
                  {event.description && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-1">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <time dateTime={event.date}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>
                      {event.start_time?.substring(0, 5)} - {event.end_time?.substring(0, 5)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="truncate max-w-[200px] sm:max-w-[150px]">
                      {event.rooms?.name || event.location || 'TBD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <EventEditModal 
        eventId={selectedEventId} 
        isOpen={!!selectedEventId} 
        onClose={() => setSelectedEventId(null)} 
        clients={clients}
        rooms={rooms}
      />
    </>
  )
}
