"use client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getStatusColor } from "./utils"

export default function UsersTab({ users }: any) {
  return (
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
              <TableHead>User</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
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
                <TableCell><Badge variant="outline" className="border-amber-500/30 text-amber-400">Premium</Badge></TableCell>
                <TableCell><Badge variant="outline" className={getStatusColor("Active")}>Active</Badge></TableCell>
                <TableCell className="text-gray-400">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
