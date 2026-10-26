import Link from 'next/link';
import { Plus, Calendar, CheckCircle, DollarSign, Users, ChevronRight, Edit2, ExternalLink } from 'react-feather';
import { getEvents } from '@/app/actions/events';
import WeeklyEventsChart from '@/components/WeeklyEventsChart';
import UpcomingEventsList from '@/components/UpcomingEventsList';
import { demoEvents } from '@/data/demoEvents';
import DashboardCalendar from './DashboardCalendar';
import EventsThisMonth from './EventsThisMonth';
import EventsTable from './EventsTable';
import moment from 'moment';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let events = [];
  try {
    events = await getEvents() || [];
  } catch (err) {
    console.error("Failed to fetch events for dashboard", err);
    events = [];
  }
  if (events.length === 0) events = demoEvents as any;

  const formattedCalendarEvents = events.map((evt: any) => {
    const [year, month, day] = (evt.date || '').split('-').map((n: string) => parseInt(n))
    const [startHours, startMinutes] = (evt.start_time || '00:00').split(':').map((n: string) => parseInt(n))
    const [endHours, endMinutes] = (evt.end_time || '00:00').split(':').map((n: string) => parseInt(n))
    if (isNaN(year)) return null
    return {
      id: evt.id,
      title: evt.title,
      start: new Date(year, (month || 1) - 1, day || 1, startHours || 0, startMinutes || 0),
      end: new Date(year, (month || 1) - 1, day || 1, endHours || 0, endMinutes || 0),
      color: evt.color || 'bg-[#00a650]',
      description: evt.description,
      location: evt.rooms?.name || evt.location || 'Location TBD',
      total_cost: evt.total_cost,
      payment_status: evt.payment_status,
    }
  }).filter(Boolean)

  const stats = [
    { label: 'Total Revenue', value: `KSh ${events.reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'bg-[#00a650]' },
    { label: 'Upcoming Events', value: events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0))).length.toString(), icon: Calendar, color: 'bg-blue-500' },
    { label: 'Paid Revenue', value: `KSh ${events.filter(e => e.payment_status === 'paid').reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0).toLocaleString()}`, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Pending Payment', value: `KSh ${events.filter(e => e.payment_status !== 'paid').reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0).toLocaleString()}`, icon: ExternalLink, color: 'bg-rose-500' },
  ];

  const sortedEvents = [...events].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Overview of events, revenue and schedule</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Link href="/calendar" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
              <Calendar className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Full Calendar
            </button>
          </Link>
          <Link href="/add-event" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto flex items-center justify-center bg-[#00a650] hover:bg-[#008f44] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition font-semibold text-xs sm:text-sm">
              <Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Add Event
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] p-4 sm:p-5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{stat.label}</p>
              <div className={`p-1.5 rounded ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Events This Month */}
      <EventsThisMonth events={events} />

      {/* Calendar View */}
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Calendar</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Click an event to edit</p>
        </div>
        <DashboardCalendar events={formattedCalendarEvents as any} />
      </section>

      {/* Events List Below Statistics */}
      <EventsTable events={events} />
    </main>
  );
}