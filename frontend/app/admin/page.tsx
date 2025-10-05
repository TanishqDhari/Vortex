"use client"

import { useState } from "react"
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

  // Mock data
  const stats = [
    { title: "Total Users", value: "12,847", change: "+12%", icon: Users },
    { title: "Active Subscriptions", value: "8,234", change: "+8%", icon: TrendingUp },
    { title: "Total Content", value: "2,456", change: "+24", icon: Film },
    { title: "Monthly Revenue", value: "$89,234", change: "+15%", icon: DollarSign },
  ]

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      subscription: "Premium",
      status: "Active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      subscription: "Standard",
      status: "Active",
      joinDate: "2024-02-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      subscription: "Basic",
      status: "Inactive",
      joinDate: "2024-03-10",
    },
  ]

  const content = [
    {
      id: 1,
      title: "The Dark Knight",
      type: "Movie",
      genre: "Action",
      rating: "9.0",
      status: "Published",
      addedDate: "2024-01-10",
    },
    {
      id: 2,
      title: "Breaking Bad",
      type: "TV Show",
      genre: "Drama",
      rating: "9.5",
      status: "Published",
      addedDate: "2024-01-15",
    },
    {
      id: 3,
      title: "Inception",
      type: "Movie",
      genre: "Sci-Fi",
      rating: "8.8",
      status: "Draft",
      addedDate: "2024-02-01",
    },
  ]

  const supportRequests = [
    {
      id: 1,
      user: "Alice Brown",
      type: "Bug Report",
      subject: "Video playback issue",
      status: "Open",
      priority: "High",
      date: "2024-03-15",
    },
    {
      id: 2,
      user: "Bob Wilson",
      type: "Feature Request",
      subject: "Download feature",
      status: "In Progress",
      priority: "Medium",
      date: "2024-03-14",
    },
    {
      id: 3,
      user: "Carol Davis",
      type: "Account Issue",
      subject: "Billing problem",
      status: "Resolved",
      priority: "High",
      date: "2024-03-13",
    },
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
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your cinema platform</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 w-64"
                />
              </div>
              <Avatar>
                <AvatarImage src="/admin-avatar.png" />
                <AvatarFallback className="bg-amber-600 text-white">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="users" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Users Management
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Content Management
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Support Requests
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Users Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage user accounts and subscriptions</CardDescription>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
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
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-700 text-white text-xs">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                            {user.subscription}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.joinDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-gray-700">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
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

          {/* Content Management */}
          <TabsContent value="content">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Content Management</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage movies, TV shows, and media content
                    </CardDescription>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
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
                    {content.map((item) => (
                      <TableRow key={item.id} className="border-gray-800">
                        <TableCell className="text-white font-medium">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">{item.genre}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400">★</span>
                            <span className="text-white">{item.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Content
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-gray-700">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Content
                              </DropdownMenuItem>
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

          {/* Support Requests */}
          <TabsContent value="support">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Support Requests</CardTitle>
                <CardDescription className="text-gray-400">Manage user support tickets and feedback</CardDescription>
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
                    {supportRequests.map((request) => (
                      <TableRow key={request.id} className="border-gray-800">
                        <TableCell className="text-white font-medium">{request.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                            {request.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">{request.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">{request.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-400 hover:text-green-300 hover:bg-gray-800"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300 hover:bg-gray-800"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
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
