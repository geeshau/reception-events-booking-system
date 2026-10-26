import { NextResponse } from 'next/server'
import { getEvents } from '@/app/actions/events'
import { getClients } from '@/app/actions/clients'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  
  if (q.length < 2) return NextResponse.json({ results: [] })

  const [events, clients] = await Promise.all([getEvents(), getClients()])

  interface SearchResult {
    type: 'event' | 'client';
    id: string | number;
    title: string;
    subtitle: string;
  }

  const results: SearchResult[] = []

  const ql = q.toLowerCase()
  events.forEach((e: any) => {
    if ((e.title || '').toLowerCase().includes(ql)) {
      results.push({ type: 'event', id: e.id, title: e.title, subtitle: e.date })
    }
  })
  clients.forEach((c: any) => {
    const name = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase()
    if (name.includes(ql)) {
      results.push({ type: 'client', id: c.id, title: `${c.first_name || ''} ${c.last_name || ''}`.trim(), subtitle: 'Client' })
    }
  })

  return NextResponse.json({ results: results.slice(0, 7) })
}

