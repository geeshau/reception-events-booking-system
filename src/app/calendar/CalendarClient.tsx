"use client"

import * as React from "react"
import { Calendar, momentLocalizer, Event as RBCEvent } from "react-big-calendar"
import moment from "moment"
import { format } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { deleteEvent } from "@/app/actions/events"
import { getInvoiceByEventId, createInvoiceForEvent, markInvoicePaid } from "@/app/actions/invoices"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Clock, MapPin, AlignLeft, Plus, Printer } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Mount the bulletproof Moment.js localizer which natively bridges RBC perfectly 
const localizer = momentLocalizer(moment)

interface BigEvent extends RBCEvent {
  id: number | string;
  title: string;
  color: string;
  description?: string;
  location?: string;
  total_cost?: number;
  payment_status?: string;
}

export default function CalendarClient({ initialEvents }: { initialEvents: BigEvent[] }) {
  const router = useRouter()
  const [events, setEvents] = React.useState<BigEvent[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = React.useState<BigEvent | null>(null)
  const [view, setView] = React.useState<'month' | 'week' | 'day' | 'agenda'>('month')
  const [invoice, setInvoice] = React.useState<any>(null)
  const [loadingInvoice, setLoadingInvoice] = React.useState(false)
  
  // Track viewport boundary dynamically to strictly export what the user is safely viewing
  const [currentRange, setCurrentRange] = React.useState<{ start: Date, end: Date }>({
    start: moment().startOf('month').toDate(),
    end: moment().endOf('month').toDate()
  })

  React.useEffect(() => {
    const load = async () => {
      if (!selectedEvent) {
        setInvoice(null)
        return
      }
      setLoadingInvoice(true)
      try {
        const inv = await getInvoiceByEventId(selectedEvent.id)
        setInvoice(inv)
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingInvoice(false)
      }
    }
    load()
  }, [selectedEvent])

  const handleSelectEvent = (event: BigEvent) => {
    setSelectedEvent(event)
  }

  const handleCreateInvoice = async () => {
    if (!selectedEvent) return
    try {
      const inv = await createInvoiceForEvent(selectedEvent.id, {
        amount: selectedEvent.total_cost || 0,
      })
      setInvoice(inv)
      alert("Draft invoice created")
    } catch (e: any) {
      alert(e.message || "Failed to create invoice")
    }
  }

  const handleMarkPaid = async () => {
    if (!invoice) return
    try {
      await markInvoicePaid(invoice.id, selectedEvent?.total_cost)
      setInvoice({ ...invoice, status: 'paid' })
      alert("Invoice marked as paid")
      router.refresh()
    } catch (e: any) {
      alert(e.message || "Failed to mark paid")
    }
  }

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to completely delete this event?")) return;
    try {
      await deleteEvent(id)
      setEvents(events.filter(e => e.id !== id))
      setSelectedEvent(null)
      router.refresh()
    } catch(err) {
      console.error(err)
      alert("Error deleting event.")
    }
  }

  const eventStyleGetter = (event: BigEvent) => {
    // Attempting to gracefully map tailwind bg-[color] classes into explicit inline style overrides
    let backgroundColor = '#6366f1' // default indigo-500
    if (event.color) {
      if (event.color.includes('red')) backgroundColor = '#ef4444'
      if (event.color.includes('green')) backgroundColor = '#10b981'
      if (event.color.includes('blue')) backgroundColor = '#3b82f6'
      if (event.color.includes('yellow')) backgroundColor = '#f59e0b'
      if (event.color.includes('purple')) backgroundColor = '#8b5cf6'
    }
    
    // Dim events that have already passed for visual clarity
    const isPast = moment(event.start).isBefore(moment())
    
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: isPast ? 0.5 : 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        padding: '2px 6px',
        fontSize: '0.85rem'
      }
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text("EventSync Pro - Master Schedule", 14, 15)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated: ${moment().format('MMMM Do YYYY, h:mm a')}`, 14, 22)
    doc.text(`Timeframe scope: ${moment(currentRange.start).format('MMM Do')} to ${moment(currentRange.end).format('MMM Do')}`, 14, 28)
    
    // Dynamically filter active array securely against viewport
    const visibleEvents = events.filter(e => {
       return moment(e.start).isBetween(currentRange.start, currentRange.end, 'day', '[]')
    }).sort((a,b) => moment(a.start).diff(moment(b.start)))

    const tableData = visibleEvents.map(e => [
      moment(e.start).format('MMM Do, h:mm a'),
      String(e.title),
      String(e.location || 'TBD'),
      String(e.description?.substring(0, 45) || '')
    ])

    autoTable(doc, {
      startY: 34,
      head: [['Date/Time', 'Event Title', 'Location Space', 'Description Notes']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] } // Tailwind indigo-600 styling mapping
    })

    doc.save(`Events_Schedule_${moment().format('MMM_YYYY')}.pdf`)
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 w-full h-full">
      <style>{`
        /* Overriding default react-big-calendar styles to match our modern tailwind UI */
        .rbc-calendar { font-family: inherit; }
        .rbc-btn-group button { border-color: #e2e8f0; color: #475569; transition: all 0.2s; }
        .rbc-btn-group button:hover { background-color: #f8fafc; }
        .rbc-btn-group button.rbc-active { background-color: #f1f5f9; color: #0f172a; box-shadow: none; border-color: #cbd5e1; font-weight: 500; }
        .rbc-toolbar button { border-radius: 6px; }
        .rbc-header { padding: 12px 0; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; color: #64748b; border-bottom: 2px solid #f1f5f9; }
        .rbc-today { background-color: #f8fafc; }
        .dark .rbc-today { background-color: #1e293b; }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: #e2e8f0; border-radius: 12px; background: white; overflow: hidden; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
        .dark .rbc-month-view, .dark .rbc-time-view, .dark .rbc-agenda-view { background: #0f172a; border-color: #334155; }
        .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row, .rbc-header + .rbc-header { border-color: #e2e8f0; }
        .dark .rbc-day-bg + .rbc-day-bg, .dark .rbc-month-row + .rbc-month-row, .dark .rbc-header + .rbc-header { border-color: #334155; }
        .rbc-toolbar { margin-bottom: 12px; padding: 8px 0; }
        .dark .rbc-btn-group button { border-color: #334155; color: #94a3b8; }
        .dark .rbc-btn-group button:hover { background-color: #1e293b; }
        .dark .rbc-btn-group button.rbc-active { background-color: #334155; color: #f8fafc; }
        .dark .rbc-header { color: #94a3b8; border-color: #334155; }
        .rbc-off-range-bg { background: #f8fafc; }
        .dark .rbc-off-range-bg { background: #0f172a; }
      `}</style>

      {/* ── Page Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {/* Navigation */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => {
                // @ts-ignore
                const cal = document.querySelector('.rbc-calendar')
                // trigger navigation
              }}
              className="px-2 py-1 text-sm"
            >
              ‹
            </button>
            <button
              onClick={() => {}}
              className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Today
            </button>
            <button
              onClick={() => {}}
              className="px-2 py-1 text-sm"
            >
              ›
            </button>
          </div>
          {/* View switcher tabs */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1 gap-0.5">
            {(['month', 'week', 'day', 'agenda'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                  view === v
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={exportPDF} variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm rounded-lg">
            <Printer className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Link href="/add-event">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-lg">
              <Plus className="mr-2 h-4 w-4" /> New Event
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl overflow-hidden h-full">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={(v: any) => setView(v)}
          defaultView="month"
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          onRangeChange={(range: any) => {
            if (Array.isArray(range)) {
              setCurrentRange({ start: range[0], end: range[range.length - 1] })
            } else {
              setCurrentRange({ start: range.start, end: range.end })
            }
          }}
          popup
          toolbar={true}
        />
      </div>

      {/* Event Details Overlay Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
             onClick={() => setSelectedEvent(null)}>
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200"
               onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: eventStyleGetter(selectedEvent).style.backgroundColor }} />
                 <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Event Record</span>
               </div>
               <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full transition">
                 <X className="w-4 h-4" />
               </button>
             </div>
             {/* Body */}
             <div className="p-6 space-y-5">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{selectedEvent.title}</h2>
               
               <div className="space-y-4 pt-1">
                 <div className="flex items-start gap-4">
                   <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg shrink-0">
                     <Clock className="w-5 h-5" />
                   </div>
                   <div className="pt-1">
                     <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                       {selectedEvent.start && format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}
                     </p>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                       {selectedEvent.start && format(selectedEvent.start, 'h:mm a')} — {selectedEvent.end && format(selectedEvent.end, 'h:mm a')}
                     </p>
                   </div>
                 </div>

                 {selectedEvent.location && (
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg shrink-0">
                       <MapPin className="w-5 h-5" />
                     </div>
                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedEvent.location}</p>
                   </div>
                 )}

                 {selectedEvent.description && (
                   <div className="flex items-start gap-4">
                     <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg shrink-0">
                       <AlignLeft className="w-5 h-5" />
                     </div>
                     <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1.5">{selectedEvent.description}</p>
                   </div>
                 )}

               </div>
               
             </div>
             {/* Invoice Section */}
             <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Invoice</span>
                 {loadingInvoice ? (
                   <span className="text-xs text-gray-400">Loading...</span>
                 ) : invoice ? (
                   <span className="text-xs uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{invoice.status}</span>
                 ) : (
                   <span className="text-xs text-gray-400">None</span>
                 )}
               </div>
               <div className="flex flex-wrap gap-2">
                 {!invoice && (
                   <Button size="sm" variant="outline" onClick={handleCreateInvoice}>Create Invoice</Button>
                 )}
                 {invoice && (
                   <>
                     <Button size="sm" asChild>
                       <Link href={`/invoices/${invoice.id}/print`} target="_blank">Print Invoice</Link>
                     </Button>
                     {invoice.status !== 'paid' && (
                       <Button size="sm" variant="secondary" onClick={handleMarkPaid}>Mark as Paid</Button>
                     )}
                   </>
                 )}
               </div>
             </div>
             {/* Footer Buttons */}
             <div className="px-6 py-5 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
               <Button variant="destructive" onClick={() => handleDelete(selectedEvent.id)} className="shadow-sm">Delete</Button>
               <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                 <Link href={`/edit-event/${selectedEvent.id}`}>Modify Details</Link>
               </Button>
             </div>
          </div>
        </div>
      )}

    </div>
  )
}
