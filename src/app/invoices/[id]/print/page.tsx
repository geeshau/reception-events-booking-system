import { getInvoiceById } from "@/app/actions/invoices"
import { notFound } from "next/navigation"
import PrintInvoiceClient from "./PrintInvoiceClient"

export default async function InvoicePrintPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoiceById(params.id).catch(() => null)
  if (!invoice) return notFound()

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <PrintInvoiceClient invoice={invoice} />
    </main>
  )
}
