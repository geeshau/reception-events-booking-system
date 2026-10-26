"use server"

import { revalidatePath } from "next/cache"
import { writeLog } from "@/lib/logger"
import { getEventById, updateEvent } from "./events"

let invoices: any[] = [];
let nextInvoiceId = 1;

function generateInvoiceNumber() {
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const rand = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `INV-${y}${m}-${rand}`
}

export async function createInvoiceForEvent(
  eventId: string | number,
  opts: { client_id?: string | null, amount?: number, currency?: string, due_date?: string | null } = {}
) {
  const invoice_number = generateInvoiceNumber()
  const invoice = {
    id: nextInvoiceId++,
    invoice_number,
    invoice_no: invoice_number,
    event_id: eventId,
    client_id: opts.client_id || null,
    amount: opts.amount || 0,
    currency: opts.currency || 'KES',
    status: 'draft',
    due_date: opts.due_date || null,
    created_at: new Date().toISOString(),
  }

  invoices.push(invoice)
  writeLog(`Created draft invoice ${invoice_number} for event ${eventId}`, 'INFO')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  return invoice
}

export async function getInvoiceByEventId(eventId: string | number) {
  const invoice = invoices
    .filter((inv) => String(inv.event_id) === String(eventId))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
  return invoice || null
}

export async function getInvoiceById(invoiceId: string) {
  const invoice = invoices.find((inv) => String(inv.id) === String(invoiceId))
  if (!invoice) throw new Error("Invoice not found")
  
  try {
    const event = await getEventById(invoice.event_id)
    return { ...invoice, events: event }
  } catch {
    return invoice
  }
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const invoice = invoices.find((inv) => String(inv.id) === String(invoiceId))
  if (!invoice) throw new Error("Invoice not found")
  invoice.status = status
  writeLog(`Invoice ${invoiceId} status updated to ${status}`, 'INFO')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
}

export async function markInvoicePaid(invoiceId: string, amountPaid?: number) {
  const invoice = invoices.find((inv) => String(inv.id) === String(invoiceId))
  if (!invoice) throw new Error("Invoice not found")
  invoice.status = 'paid'
  if (amountPaid !== undefined) invoice.amount = amountPaid

  if (invoice?.event_id) {
    try {
      const formData = new FormData()
      formData.append("payment_status", "paid")
      // We'll update via our store by calling updateEvent with minimal data
    } catch (e) {
      // ignore
    }
  }

  writeLog(`Invoice ${invoiceId} marked paid`, 'SUCCESS')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  return invoice
}

