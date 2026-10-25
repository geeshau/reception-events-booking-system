"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function PrintInvoiceClient({ invoice }: { invoice: any }) {
  const event = invoice.events || {}
  const client = event.clients || invoice.client || {}
  const room = event.rooms || {}

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="text-xl font-bold">Invoice Preview</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint}>Print</Button>
          <Button variant="outline" onClick={() => window.close()}>Close</Button>
        </div>
      </div>

      <div className="border border-gray-300 p-8 rounded-lg shadow-sm print:border-0 print:shadow-none print:p-0">
        <header className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">EventSync Pro</h2>
            <p className="text-sm text-gray-600">Reception Events Booking System</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">INVOICE</p>
            <p className="text-sm">#{invoice.invoice_number}</p>
            <p className="text-sm">Issued: {invoice.issued_at ? new Date(invoice.issued_at).toLocaleDateString() : ""}</p>
            {invoice.due_date && <p className="text-sm">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>}
            <p className="text-sm mt-1">Status: <span className="uppercase">{invoice.status}</span></p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-semibold mb-1">Bill To</p>
            <p className="text-sm">{client.first_name} {client.last_name}</p>
            {client.company_name && <p className="text-sm">{client.company_name}</p>}
            {client.email && <p className="text-sm">{client.email}</p>}
            {client.phone_number && <p className="text-sm">{client.phone_number}</p>}
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Event Details</p>
            <p className="text-sm font-medium">{event.title}</p>
            <p className="text-sm">{event.date} | {event.start_time?.substring(0, 5)} - {event.end_time?.substring(0, 5)}</p>
            <p className="text-sm">{room.name || event.location || 'TBD'}</p>
          </div>
        </section>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left text-sm py-2">Description</th>
              <th className="text-right text-sm py-2">Amount ({invoice.currency || 'KES'})</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 text-sm">Event Booking - {event.title}</td>
              <td className="py-3 text-sm text-right">{Number(invoice.amount || 0).toLocaleString()}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 text-sm font-semibold text-right">Total</td>
              <td className="py-3 text-sm font-semibold text-right">{Number(invoice.amount || 0).toLocaleString()} {invoice.currency || 'KES'}</td>
            </tr>
          </tfoot>
        </table>

        {invoice.notes && (
          <section className="mb-6">
            <p className="text-sm font-semibold mb-1">Notes</p>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </section>
        )}

        <footer className="text-xs text-gray-500 mt-12">
          <p>Thank you for your business.</p>
          <p>This is a computer-generated invoice.</p>
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
