"use server"

import { getClients } from "./clients"
import { writeLog } from "@/lib/logger"

export async function sendEmailCampaign(formData: FormData) {
  const subject = (formData.get("subject") as string)?.trim() || ""
  const body = (formData.get("body") as string)?.trim() || ""
  const recipients = (formData.get("recipients") as string)?.trim() || "all"

  if (!subject || !body) throw new Error("Subject and body are required.")

  const clients = await getClients()
  const targets = clients.filter((c: any) => c.email && (recipients === "all" || String(c.id) === recipients))

  if (targets.length === 0) throw new Error("No valid recipients with email addresses.")

  for (const c of targets) {
    console.log(`\n📧 [CAMPAIGN EMAIL TO: ${c.email}]`)
    console.log(`SUBJECT: ${subject}`)
    console.log(`Hi ${c.first_name},\n${body}\n`)
  }

  writeLog(`System dispatched email campaign "${subject}" to ${targets.length} recipient(s)`, 'SUCCESS')
  return { success: true, count: targets.length }
}
