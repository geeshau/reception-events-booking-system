"use server"

import { revalidatePath } from "next/cache"
import { writeLog } from "@/lib/logger"

let clients: any[] = [
  { id: 1, first_name: "John", last_name: "Mwangi", email: "john@example.com", phone_number: "+254700000001", company_name: "Acme Ltd" },
  { id: 2, first_name: "Sarah", last_name: "Ochieng", email: "sarah@example.com", phone_number: "+254700000002", company_name: "TechCorp" },
];
let nextClientId = 3;

export async function getClients() {
  return clients.sort((a, b) => b.id - a.id)
}

export async function addClient(formData: FormData) {
  const clientData = {
    id: nextClientId++,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: (formData.get("email") as string) || null,
    phone_number: (formData.get("phone_number") as string) || null,
    company_name: (formData.get("company_name") as string) || null,
  }

  clients.push(clientData)
  writeLog(`System registered new client: ${clientData.first_name} ${clientData.last_name}`, 'SUCCESS')
  revalidatePath("/clients")
  return true
}

export async function deleteClient(id: string) {
  clients = clients.filter((c) => String(c.id) !== String(id))
  writeLog(`System purged client record (ID: ${id})`, 'WARN')
  revalidatePath("/clients")
  return true
}

