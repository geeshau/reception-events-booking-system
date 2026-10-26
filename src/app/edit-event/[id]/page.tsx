import { getRooms } from "@/app/actions/rooms"
import { getClients } from "@/app/actions/clients"
import { getEventById } from "@/app/actions/events"
import EditEventClient from "@/app/edit-event/[id]/EditEventClient"
import { demoEvents } from "@/data/demoEvents"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params
  
  let eventData = null;
  let rooms = [];
  let clients = [];
  
  try {
    const [event, roomsData, clientsData] = await Promise.all([
      getEventById(unwrappedParams.id),
      getRooms(),
      getClients()
    ])
    eventData = event;
    rooms = roomsData || [];
    clients = clientsData || [];
  } catch (err) {
    // Use demo data if database fails
    eventData = demoEvents.find(e => e.id.toString() === unwrappedParams.id) || demoEvents[0];
    rooms = [];
    clients = [];
  }

  if (!eventData) {
    eventData = demoEvents.find(e => e.id.toString() === unwrappedParams.id) || demoEvents[0];
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Modify Event Details</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Adjust the physical properties or timeblocks for this event.
        </p>
        
        <EditEventClient event={eventData} clients={clients || []} rooms={rooms || []} />
      </div>
    </main>
  )
}
