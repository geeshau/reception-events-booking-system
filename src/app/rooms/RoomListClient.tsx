"use client"

import { useState } from "react"
import { Home, Plus, Users, Trash2, X, Settings, Edit } from "lucide-react"
import { addRoom, deleteRoom, updateRoom } from "@/app/actions/rooms"
import { Button } from "@/components/ui/button"

export default function RoomListClient({ initialRooms }: { initialRooms: any[] }) {
  const [rooms, setRooms] = useState(initialRooms)
  const [isAdding, setIsAdding] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData)
      } else {
        await addRoom(formData)
      }
      window.location.reload()
    } catch (err: any) {
      alert("Error saving room: " + err.message)
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this room? It will fail if events are tied to it!")) return;
    try {
      await deleteRoom(id)
      setRooms(rooms.filter(r => r.id !== id))
    } catch (err: any) {
      alert("Error deleting: " + err.message)
    }
  }

  const openEditModal = (room: any) => {
    setEditingRoom(room)
    setIsAdding(true)
  }

  const closeForm = () => {
    setIsAdding(false)
    setEditingRoom(null)
  }

  return (
    <>
      <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-200 dark:border-[#262626] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#262626] flex justify-end items-center bg-gray-50/50 dark:bg-[#141414]">
          <Button onClick={() => setIsAdding(true)} className="bg-[#00a650] hover:bg-[#008f44] text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Space
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#0f0f0f] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#262626]">
              <tr>
                <th className="px-6 py-4 font-medium">Room Name</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Price Range (KSh)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Home className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                    No rooms added. Please add booking spaces.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition border-b border-gray-100 dark:border-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold mr-3">
                          <Home className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{room.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" /> {room.capacity} People
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#00a650] dark:text-[#00a650]">
                        {room.min_price?.toLocaleString() || 0} - {room.max_price?.toLocaleString() || 0} <span className="text-[10px] opacity-70">KSh</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${room.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                        {room.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(room)} className="text-gray-500 hover:text-[#00a650] hover:bg-green-50 dark:hover:bg-green-900/20 mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-[#262626]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#262626] flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">{editingRoom ? "Edit Room Details" : "Add Space or Room"}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room / Space Name *</label>
                <input type="text" name="name" defaultValue={editingRoom ? editingRoom.name : ""} placeholder="e.g. Church Hall 1" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input type="text" name="image_url" defaultValue={editingRoom ? editingRoom.image_url || "" : ""} placeholder="/images/rooms/main-hall.jpg" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Charge (KSh)</label>
                  <input type="number" name="min_price" defaultValue={editingRoom ? editingRoom.min_price : 0} required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Charge (KSh)</label>
                  <input type="number" name="max_price" defaultValue={editingRoom ? editingRoom.max_price : 0} required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seat Capacity</label>
                  <input type="number" name="capacity" defaultValue={editingRoom ? editingRoom.capacity : 50} required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select name="status" defaultValue={editingRoom ? editingRoom.status : "available"} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out_of_service">Out of Service</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                  {loading ? "Saving..." : (editingRoom ? "Save Changes" : "Save Room")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
