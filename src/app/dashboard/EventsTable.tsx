"use client"

import { useState } from "react"
import Link from "next/link"
import moment from "moment"
import Pagination from "@/components/Pagination"

const ITEMS_PER_PAGE = 15

export default function EventsTable({ events }: { events: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const sortedEvents = [...events].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
                <th className="text-left py-2.5 px-4 font-medium text-gray-600 dark:text-gray-400">Event</th>
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
                  <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">No events</td>
                </tr>
              ) : (
                paginatedEvents.map((event: any) => (
                  <tr key={event.id} className="border-b border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${event.color?.replace('bg-', 'bg-') || 'bg-[#00a650]'}`} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                          {event.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{event.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      {event.date ? moment(event.date).format('MMM DD, YYYY') : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {event.start_time?.substring(0,5)} - {event.end_time?.substring(0,5)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      <span className="truncate max-w-[120px] block">{event.rooms?.name || event.location || '-'}</span>
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
                      <Link href={`/edit-event/${event.id}`} className="text-[#00a650] hover:underline text-xs sm:text-sm">Edit</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  )
}
