"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HeaderBar({ searchTerm, setSearchTerm }: any) {
  return (
    <div className="border-b border-gray-800 bg-black/40 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your cinema platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900/70 border-gray-700 text-white placeholder-gray-400 w-64"
            />
          </div>
          <Avatar>
            <AvatarImage src="/admin-avatar.png" />
            <AvatarFallback className="bg-amber-600 text-white">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
