"use client"

import { useState } from "react"
import Link from "next/link"
import moment from "moment"
import Pagination from "@/components/Pagination"
import EventEditModal from "@/components/EventEditModal"

const ITEMS_PER_PAGE = 15

export default function EventsTable({ events, clients = [], rooms = [] }: { events: any[], clients?: any[], rooms?: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(null)
  const sortedEvents = [...events].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getLocation = (event: any) => {
    if (event.rooms?.name) return event.rooms.name
    if (event.room_id) {
      const room = rooms.find((r: any) => String(r.id) === String(event.room_id))
      if (room?.name) return room.name
    }
    return event.location || '-'
  }

  const getClient = (event: any) => {
    if (event.clients) {
      const c = event.clients
      if (typeof c === 'object') return `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.company_name || '-'
    }
    if (event.client_id) {
      const client = clients.find((c: any) => String(c.id) === String(event.client_id))
      if (client) return `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.company_name || '-'
    }
    return '-'
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Events</h2>
        <Link href="/calendar" className="text-xs sm:text-sm text-[#00a650] hover:underline">View all</Link>
      </div>
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#0a0a0a]">
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400 w-12">#</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400">Event</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">Client</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">Date</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Time</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Location</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">No events</td>
                </tr>
              ) : (
                paginatedEvents.map((event: any, idx: number) => (
                  <tr 
                    key={event.id} 
                    className="border-b border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {(event.rooms?.image_url || event.image_url) && (
                          <img 
                            src={event.rooms?.image_url || event.image_url} 
                            alt={getLocation(event)} 
                            className="w-10 h-10 rounded object-cover flex-shrink-0" 
                          />
                        )}
                        <div className="flex items-center gap-2 min-w-0">
                          {!event.rooms?.image_url && !event.image_url && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${event.color?.replace('bg-', 'bg-') || 'bg-[#00a650]'}`} />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                            {event.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{event.description}</p>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      <span className="truncate max-w-[150px] block">{getClient(event)}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      {event.date ? moment(event.date).format('MMM DD, YYYY') : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {event.start_time?.substring(0,5)} - {event.end_time?.substring(0,5)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      <span className="truncate max-w-[120px] block">{getLocation(event)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        event.payment_status === 'paid' 
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {event.payment_status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedEventId(event.id); }} 
                          className="p-1 text-gray-600 hover:text-[#00a650] dark:text-gray-400 dark:hover:text-[#00a650]"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button 
                          onClick={async (e) => { 
                            e.stopPropagation(); 
                            if (confirm("Are you sure you want to delete this event?")) {
                              const { deleteEvent } = await import('@/app/actions/events');
                              await deleteEvent(event.id);
                              window.location.reload();
                            }
                          }} 
                          className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
