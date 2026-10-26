import { NextResponse } from 'next/server'
import { getEventById } from '@/app/actions/events'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const event = await getEventById(id)
  } catch (e) {
    return new NextResponse('Event not found or database error', { status: 404 })
  }
  const event = await getEventById(id).catch(() => null)
  if (!event) {
    return new NextResponse('Event not found or database error', { status: 404 })
  }

  // Create Date objects natively
  const startDate = new Date(`${event.date}T${event.start_time}`)
  const endDate = new Date(`${event.date}T${event.end_time}`)

  // Standard string format for iCalendar: YYYYMMDDThhmmssZ
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  // Fallback safely if joined tables are missing
  // @ts-ignore (Supabase nested arrays typescript inference)
  const roomName = event.rooms?.name || event.location || 'TBD'
  // @ts-ignore
  const clientName = event.clients ? `${event.clients.first_name} ${event.clients.last_name}` : ''
  const description = `${event.description || ''}${clientName ? `\\nOrganizer: ${clientName}` : ''}`

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventSync Pro Manager//EN
BEGIN:VEVENT
UID:${event.id}@eventsyncpro.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
LOCATION:${roomName}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics"`,
    },
  })
}
