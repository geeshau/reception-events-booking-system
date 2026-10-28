"use server"

import { revalidatePath } from "next/cache"
import { writeLog } from "@/lib/logger"

let clients: any[] = [
  { id: 1, first_name: "John", last_name: "Mwangi", email: "john@example.com", phone_number: "+254700000001", company_name: "Acme Ltd" },
  { id: 2, first_name: "Sarah", last_name: "Ochieng", email: "sarah@example.com", phone_number: "+254700000002", company_name: "TechCorp" },
  { id: 3, first_name: "David", last_name: "Kimani", email: "david.kimani@example.com", phone_number: "+254700000003", company_name: "Innovate Solutions" },
  { id: 4, first_name: "Grace", last_name: "Njeri", email: "grace.njeri@example.com", phone_number: "+254700000004", company_name: "Elite Events Co." },
  { id: 5, first_name: "Michael", last_name: "Otieno", email: "michael.otieno@example.com", phone_number: "+254700000005", company_name: "Global Corp" },
  { id: 6, first_name: "Emily", last_name: "Wanjiku", email: "emily.wanjiku@example.com", phone_number: "+254700000006", company_name: "Dream Weddings" },
  { id: 7, first_name: "Robert", last_name: "Kipchoge", email: "robert.kipchoge@example.com", phone_number: "+254700000007", company_name: "MediaPro" },
  { id: 8, first_name: "Lucy", last_name: "Akinyi", email: "lucy.akinyi@example.com", phone_number: "+254700000008", company_name: "HealthCare Plus" },
  { id: 9, first_name: "James", last_name: "Mutua", email: "james.mutua@example.com", phone_number: "+254700000009", company_name: "Youth Empowerment" },
  { id: 10, first_name: "Peter", last_name: "Kamau", email: "peter.kamau@example.com", phone_number: "+254700000010", company_name: "Board Associates" },
  { id: 11, first_name: "Ann", last_name: "Wambui", email: "ann.wambui@example.com", phone_number: "+254700000011", company_name: "Charity Foundation" },
  { id: 12, first_name: "Kevin", last_name: "Omondi", email: "kevin.omondi@example.com", phone_number: "+254700000012", company_name: "Marketing Masters" },
  { id: 13, first_name: "Samuel", last_name: "Njenga", email: "samuel.njenga@example.com", phone_number: "+254700000013", company_name: "UniEvents Ltd" },
  { id: 14, first_name: "Jane", last_name: "Muthoni", email: "jane.muthoni@example.com", phone_number: "+254700000014", company_name: "PropertyPlus" },
  { id: 15, first_name: "Tom", last_name: "Smith", email: "tom.smith@example.com", phone_number: "+254700000015", company_name: "Smith Family" },
  { id: 16, first_name: "Daniel", last_name: "Kariuki", email: "daniel.kariuki@example.com", phone_number: "+254700000016", company_name: "FinancePro" },
  { id: 17, first_name: "Mary", last_name: "Atieno", email: "mary.atieno@example.com", phone_number: "+254700000017", company_name: "Festive Events" },
  { id: 18, first_name: "Paul", last_name: "Maina", email: "paul.maina@example.com", phone_number: "+254700000018", company_name: "SecureTech" },
  { id: 19, first_name: "Rachel", last_name: "Chebet", email: "rachel.chebet@example.com", phone_number: "+254700000019", company_name: "Awards Committee" },
  { id: 20, first_name: "George", last_name: "Ndung'u", email: "george.ndungu@example.com", phone_number: "+254700000020", company_name: "Business Network KE" },
];
let nextClientId = 21;

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

export async function updateClient(id: string, formData: FormData) {
  const index = clients.findIndex((c) => String(c.id) === String(id))
  if (index === -1) throw new Error("Client not found")
  clients[index] = {
    ...clients[index],
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: (formData.get("email") as string) || null,
    phone_number: (formData.get("phone_number") as string) || null,
    company_name: (formData.get("company_name") as string) || null,
  }
  writeLog(`System updated client record (ID: ${id})`, 'SUCCESS')
  revalidatePath("/clients")
  return true
}

export async function deleteClient(id: string) {
  clients = clients.filter((c) => String(c.id) !== String(id))
  writeLog(`System purged client record (ID: ${id})`, 'WARN')
  revalidatePath("/clients")
  return true
}

