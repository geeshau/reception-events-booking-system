"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { writeLog } from "@/lib/logger"

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
  const supabase = await createClient()
  const invoice_number = generateInvoiceNumber()
  const { data, error } = await supabase
    .from("invoices")
    .insert([
      {
        invoice_number,
        event_id: eventId,
        client_id: opts.client_id || null,
        amount: opts.amount || 0,
        currency: opts.currency || 'KES',
        status: 'draft',
        due_date: opts.due_date || null,
      },
    ])
    .select()
    .single()

  if (error) {
    writeLog(`Invoice creation failed for event ${eventId}: ${error.message}`, 'ERROR')
    throw new Error(error.message)
  }

  writeLog(`Created draft invoice ${invoice_number} for event ${eventId}`, 'INFO')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  return data
}

export async function getInvoiceByEventId(eventId: string | number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("getInvoiceByEventId error:", error)
    throw new Error(error.message)
  }
  return data
}

export async function getInvoiceById(invoiceId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select("*, events(*, clients(*), rooms(*))")
    .eq("id", invoiceId)
    .single()

  if (error) {
    console.error("getInvoiceById error:", error)
    throw new Error(error.message)
  }
  return data
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", invoiceId)

  if (error) {
    writeLog(`Failed to update invoice ${invoiceId} status: ${error.message}`, 'ERROR')
    throw new Error(error.message)
  }

  writeLog(`Invoice ${invoiceId} status updated to ${status}`, 'INFO')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
}

export async function markInvoicePaid(invoiceId: string, amountPaid?: number) {
  const supabase = await createClient()
  const invoice = await getInvoiceById(invoiceId).catch(() => null)
  const { error } = await supabase
    .from("invoices")
    .update({ status: 'paid' })
    .eq("id", invoiceId)

  if (error) {
    writeLog(`Failed to mark invoice ${invoiceId} paid: ${error.message}`, 'ERROR')
    throw new Error(error.message)
  }

  if (invoice?.event_id) {
    await supabase
      .from("events")
      .update({ payment_status: 'paid', amount_paid: amountPaid ?? invoice.amount })
      .eq("id", invoice.event_id)
  }

  writeLog(`Invoice ${invoiceId} marked paid`, 'SUCCESS')
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
}
