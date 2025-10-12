"use client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { getStatusColor, getPriorityColor } from "./utils"

export default function SupportTab() {
  const supportRequests = [
    { id: 1, user: "Alice Brown", type: "Bug Report", subject: "Video playback issue", status: "Open", priority: "High", date: "2024-03-15" },
    { id: 2, user: "Bob Wilson", type: "Feature Request", subject: "Download feature", status: "In Progress", priority: "Medium", date: "2024-03-14" },
    { id: 3, user: "Carol Davis", type: "Account Issue", subject: "Billing problem", status: "Resolved", priority: "High", date: "2024-03-13" },
  ]

  return (
    <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] border border-gray-800 shadow-md">
      <CardHeader>
        <CardTitle className="text-white">Support Requests</CardTitle>
        <CardDescription className="text-gray-400">Manage user feedback & tickets</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supportRequests.map((r) => (
              <TableRow key={r.id} className="border-gray-800 hover:bg-white/5">
                <TableCell>{r.user}</TableCell>
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
  )
}
