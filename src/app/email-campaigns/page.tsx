import { getClients } from "@/app/actions/clients"
import EmailCampaignsClient from "./EmailCampaignsClient"

export const dynamic = 'force-dynamic'

export default async function EmailCampaignsPage() {
  const clients = await getClients() || []

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Campaigns</h1>
        <p className="text-gray-500 dark:text-gray-400">Compose and send promotional emails to clients</p>
      </div>

      <EmailCampaignsClient clients={clients} />
    </main>
  )
}
