"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Film,
  TrendingUp,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
          fetch("/api/media")
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }

        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setMedia(mediaData);
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { title: "Total Users", value: users.length.toString(), change: "+12%", icon: Users },
    { title: "Active Subscriptions", value: "8,234", change: "+8%", icon: TrendingUp },
    { title: "Total Content", value: media.length.toString(), change: "+24", icon: Film },
    { title: "Monthly Revenue", value: "$89,234", change: "+15%", icon: DollarSign },
  ]

  const supportRequests = [
    { id: 1, user: "Alice Brown", type: "Bug Report", subject: "Video playback issue", status: "Open", priority: "High", date: "2024-03-15" },
    { id: 2, user: "Bob Wilson", type: "Feature Request", subject: "Download feature", status: "In Progress", priority: "Medium", date: "2024-03-14" },
    { id: 3, user: "Carol Davis", type: "Account Issue", subject: "Billing problem", status: "Resolved", priority: "High", date: "2024-03-13" },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "published":
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "inactive":
      case "draft":
      case "open":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "in progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0f] to-[#12091b] text-white">
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

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card
                key={i}
                className="bg-[linear-gradient(-45deg,#192145,#210e17)] border border-gray-800 shadow-lg hover:shadow-amber-600/20 transition"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-green-400 text-sm mt-1">{stat.change} from last month</p>
                    </div>
                    <div className="bg-amber-600/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gray-900/60 border-gray-800 rounded-lg">
            <TabsTrigger value="users" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Content
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] border border-gray-800 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Users Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage accounts and subscriptions</CardDescription>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Subscription</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Join Date</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.user_id} className="border-gray-800 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-700 text-white text-xs">
                                {u.fname?.[0]}{u.lname?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium">{u.fname} {u.lname}</p>
                              <p className="text-gray-400 text-sm">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-amber-500/30 text-amber-400">Premium</Badge>
                        </TableCell>
                        <TableCell><Badge variant="outline" className={getStatusColor("Active")}>Active</Badge></TableCell>
                        <TableCell className="text-gray-400">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "Unknown"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700"><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700"><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-gray-700"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] border border-gray-800 shadow-md">
              <CardHeader className="flex justify-between">
                <div>
                  <CardTitle className="text-white">Content Management</CardTitle>
                  <CardDescription className="text-gray-400">Manage movies, TV shows & media</CardDescription>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="h-4 w-4 mr-2" /> Add Content
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">Title</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Genre</TableHead>
                      <TableHead className="text-gray-400">Rating</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {media.map((m) => (
                      <TableRow key={m.media_id} className="border-gray-800 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{m.title}</TableCell>
                        <TableCell><Badge variant="outline" className="border-blue-500/30 text-blue-400">Media</Badge></TableCell>
                        <TableCell className="text-gray-400">
                          {Array.isArray(m.genres) ? m.genres.join(", ") : m.genres || "Unknown"}
                        </TableCell>
                        <TableCell><span className="text-amber-400">★</span> {m.rating != null ? Number(m.rating).toFixed(1) : "N/A"}</TableCell>
                        <TableCell><Badge variant="outline" className={getStatusColor("Published")}>Published</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700"><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700"><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-gray-700"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPPORT */}
          <TabsContent value="support">
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] border border-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-white">Support Requests</CardTitle>
                <CardDescription className="text-gray-400">Manage user feedback & tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Subject</TableHead>
                      <TableHead className="text-gray-400">Priority</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportRequests.map((r) => (
                      <TableRow key={r.id} className="border-gray-800 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{r.user}</TableCell>
                        <TableCell><Badge variant="outline" className="border-purple-500/30 text-purple-400">{r.type}</Badge></TableCell>
                        <TableCell className="text-gray-400">{r.subject}</TableCell>
                        <TableCell><Badge variant="outline" className={getPriorityColor(r.priority)}>{r.priority}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className={getStatusColor(r.status)}>{r.status}</Badge></TableCell>
                        <TableCell className="text-gray-400">{r.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-green-400 hover:bg-gray-800"><CheckCircle className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-gray-800"><Clock className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:bg-gray-800"><XCircle className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
