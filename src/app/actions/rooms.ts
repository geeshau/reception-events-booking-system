"use server"

import { revalidatePath } from "next/cache"
import { writeLog } from "@/lib/logger"

let rooms: any[] = [
  { id: 1, name: "Main Hall", capacity: 200, status: "available", min_price: 5000, max_price: 8000, image_url: "https://www.husseyseating.com/wp-content/uploads/2024/10/lecture-scaled-1920x749.jpg" },
  { id: 2, name: "Boardroom A", capacity: 20, status: "available", min_price: 1500, max_price: 2000, image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Conference Room B", capacity: 50, status: "available", min_price: 2500, max_price: 3500, image_url: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80" },
];
let nextRoomId = 4;

export async function getRooms() {
  return rooms.sort((a, b) => a.name.localeCompare(b.name))
}

export async function addRoom(formData: FormData) {
  const roomData = {
    id: nextRoomId++,
    name: formData.get("name") as string,
    capacity: parseInt(formData.get("capacity") as string) || 0,
    status: formData.get("status") || "available",
    min_price: parseFloat(formData.get("min_price") as string) || 0,
    max_price: parseFloat(formData.get("max_price") as string) || 0,
    image_url: (formData.get("image_url") as string) || null,
  }

  rooms.push(roomData)
  revalidatePath("/rooms")
  return true
}

export async function deleteRoom(id: string) {
  rooms = rooms.filter((r) => String(r.id) !== String(id))
  writeLog(`System purged Physical Room UUID: ${id}`, 'WARN')
  revalidatePath("/rooms")
  return true
}

export async function updateRoom(id: string, formData: FormData) {
  const index = rooms.findIndex((r) => String(r.id) === String(id))
  if (index === -1) throw new Error("Room not found")
  
  rooms[index] = {
    ...rooms[index],
    name: formData.get("name") as string,
    capacity: parseInt(formData.get("capacity") as string) || 0,
    status: formData.get("status") || "available",
    min_price: parseFloat(formData.get("min_price") as string) || 0,
    max_price: parseFloat(formData.get("max_price") as string) || 0,
    image_url: (formData.get("image_url") as string) || rooms[index].image_url || null,
  }

  writeLog(`Configuration modified for physical Room space mapping: ${rooms[index].name} (ID: ${id})`, 'SUCCESS')
  revalidatePath("/rooms")
  return true
}

