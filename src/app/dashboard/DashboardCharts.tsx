"use client"

import { TrendingUp, Users } from "react-feather"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardCharts({ revenueTrendData, topClients }: { revenueTrendData: any[], topClients: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
      <div className="lg:col-span-2 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue Progress
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(v) => `KSh ${v/1000}k`} />
            <Tooltip formatter={(value: any) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="#00a650" strokeWidth={2} dot={{ fill: '#00a650' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Top 5 Clients
        </h2>
        <div className="space-y-3">
          {topClients.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No client data</p>
          ) : (
            topClients.map((client, idx) => (
              <div key={client.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{idx + 1}</span>
                  <span className="text-sm text-gray-900 dark:text-white truncate max-w-[120px]">{client.name}</span>
                </div>
                <span className="text-sm font-semibold text-[#00a650]">KSh {client.revenue.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
