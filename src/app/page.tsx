import { getEvents } from '@/app/actions/events';
import { getClients } from '@/app/actions/clients';
import { getRooms } from '@/app/actions/rooms';
import { Calendar } from 'react-feather';
import Link from 'next/link';
import { demoEvents } from '@/data/demoEvents';
import EventDirectoryClient from './EventDirectoryClient';

export const dynamic = 'force-dynamic';

export default async function PublicEventsPage() {
  let events = [];
  let clients = [];
  let rooms = [];
  try {
    events = await getEvents() || [];
  } catch (err) {
    events = [];
  }
  try {
    clients = await getClients() || [];
  } catch (err) {
    clients = [];
  }
  try {
    rooms = await getRooms() || [];
  } catch (err) {
    rooms = [];
  }

  // Use demo events if no events from database
  const displayEvents = events.length > 0 ? events : demoEvents;

  // Keep all events from the database natively without omitting past events
  const allEvents = [...displayEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <header className="border-b border-gray-200 dark:border-[#262626] bg-white dark:bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#00a650] p-1.5 rounded">
                <Calendar className="text-white h-5 w-5" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">STANDS Conference Facilities</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#00a650] px-2 py-1">
              Dashboard
            </Link>
          </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Event Directory</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Browse all events</p>
        </div>

        <EventDirectoryClient events={allEvents} clients={clients} rooms={rooms} />
      </div>
    </main>
  );
}
