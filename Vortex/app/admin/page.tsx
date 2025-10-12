"use client"
import { useState, useEffect } from "react"
import HeaderBar from "./components/HeaderBar"
import StatsGrid from "./components/StatsGrid"
import UsersTab from "./components/UsersTab"
import SupportTab from "./components/SupportTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Film, DollarSign } from "lucide-react"
import ContentManager from "./components/ContentTab"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, mediaRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/media"),
        ])
        if (usersRes.ok) setUsers(await usersRes.json())
        if (mediaRes.ok) setMedia(await mediaRes.json())
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { title: "Total Users", value: users.length.toString(), change: "+12%", icon: Users },
    { title: "Active Subscriptions", value: "8,234", change: "+8%", icon: TrendingUp },
    { title: "Total Content", value: media.length.toString(), change: "+24", icon: Film },
    { title: "Monthly Revenue", value: "$89,234", change: "+15%", icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0f] to-[#12091b] text-white">
      <HeaderBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="container mx-auto px-6 py-8">
        <StatsGrid stats={stats} />

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gray-900/60 border-gray-800 rounded-lg">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTab users={users} />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager/>
          </TabsContent>

          <TabsContent value="support">
            <SupportTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
