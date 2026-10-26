import { getEvents } from '@/app/actions/events';
import { Calendar, MapPin, Clock } from 'react-feather';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { demoEvents } from '@/data/demoEvents';

export const dynamic = 'force-dynamic';

export default async function PublicEventsPage() {
  let events = [];
  try {
    events = await getEvents() || [];
  } catch (err) {
    events = [];
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
            <div className="hidden md:block">
              <SearchBar />
            </div>
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
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Browse all upcoming and past events</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {allEvents.length === 0 ? (
            <div className="border border-gray-200 dark:border-[#262626] rounded-lg p-8 sm:p-12 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              There are no scheduled events at this time.
            </div>
          ) : (
            allEvents.map(event => (
              <div 
                key={event.id}
                className="border border-gray-200 dark:border-[#262626] rounded-lg hover:border-gray-300 dark:hover:border-[#404040] transition-colors overflow-hidden bg-white dark:bg-[#141414]"
              >
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className={`w-full sm:w-1 h-1 sm:h-16 rounded-full flex-shrink-0 ${event.color?.replace('bg-', 'bg-') || 'bg-[#00a650]'}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {event.title}
                    </h2>
                    {event.description && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-1">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <time dateTime={event.date}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>
                        {event.start_time?.substring(0, 5)} - {event.end_time?.substring(0, 5)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="truncate max-w-[200px] sm:max-w-[150px]">
                        {event.location || event.rooms?.name || 'TBD'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
