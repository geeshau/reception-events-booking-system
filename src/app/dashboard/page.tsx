import Link from 'next/link';
import { Plus, Calendar, CheckCircle, DollarSign, Users, ChevronRight, Edit2, ExternalLink } from 'react-feather';
import { getEvents } from '@/app/actions/events';
import WeeklyEventsChart from '@/components/WeeklyEventsChart';
import UpcomingEventsList from '@/components/UpcomingEventsList';
import { demoEvents } from '@/data/demoEvents';

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

  const stats = [
    { label: 'Total Revenue', value: `KSh ${events.reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-500' },
    { label: 'Upcoming Events', value: events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0))).length.toString(), icon: Calendar, color: 'bg-blue-500' },
    { label: 'Paid Revenue', value: `KSh ${events.filter(e => e.payment_status === 'paid').reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0).toLocaleString()}`, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Pending Payment', value: `KSh ${events.filter(e => e.payment_status !== 'paid').reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0).toLocaleString()}`, icon: ExternalLink, color: 'bg-rose-500' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Executive Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time performance metrics and event orchestration</p>
        </div>
        <div className="flex gap-3">
          <Link href="/calendar">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition shadow-sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </button>
          </Link>
          <Link href="/add-event">
            <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition shadow-lg shadow-indigo-200 dark:shadow-none font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              Schedule Event
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full transition-transform group-hover:scale-110 ${stat.color}`}></div>
            <div className="flex flex-col">
              <div className={`p-3 rounded-xl w-fit mb-4 ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyEventsChart events={events} />
        </div>
        <div>
          <UpcomingEventsList events={events} />
        </div>
      </div>
    </main>
  );
}