"use client"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MoreHorizontal, Trash2, Film } from "lucide-react"

export default function ContentManager() {
  const [media, setMedia] = useState<any[]>([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    release_date: "",
    duration: "",
    synopsis: "",
    image: "",
    genre: "",
    licence_expire_date: "",
    views: "",
    rating: "",
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  async function fetchMedia() {
    try {
      const res = await fetch("/api/media")
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      }
    } catch (err) {
      console.error("Failed to load media", err)
    }
  }

  async function handleAddMedia() {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(res)
      if (res.ok) {
        setOpenAdd(false)
        await fetchMedia()
        setFormData({
          title: "",
          release_date: "",
          duration: "",
          synopsis: "",
          image: "",
          genre: "",
          licence_expire_date: "",
          views: "",
          rating: "",
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete() {
    if (!selectedMedia) return
    try {
      const res = await fetch(`/api/media/${selectedMedia.media_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOpenDelete(false)
        await fetchMedia()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "draft": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] border border-gray-800 shadow-md">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle className="text-white flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-400" /> Content Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage movies, TV shows & media
          </CardDescription>
        </div>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
  <DialogTrigger asChild>
    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
      <Plus className="h-4 w-4 mr-2" /> Add Content
    </Button>
  </DialogTrigger>

  <DialogContent
    className="bg-gray-900 border border-gray-700 text-white max-w-2xl max-h-[80vh] flex flex-col"
  >
    <DialogHeader>
      <DialogTitle>Add New Media</DialogTitle>
    </DialogHeader>

    {/* Scrollable body */}
    <div className="overflow-y-auto flex-1 space-y-4 py-4 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* Title */}
      <div className="space-y-1">
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Release Date */}
      <div className="space-y-1">
        <Label>Release Date</Label>
        <Input
            type="date"
            value={formData.release_date}
            onChange={(e) =>
            setFormData((prev) => ({ ...prev, release_date: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
        />
    </div>


      {/* Duration */}
      <div className="space-y-1">
        <Label>Duration</Label>
        <Input
          type="time"
          step={1} // include seconds
          value={formData.duration}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, duration: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Age Rating */}
      <div className="space-y-1">
  <Label>Rating</Label>
  <Input
    type="number"
    step="0.1"
    min="0"
    max="10"
    value={formData.rating}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, rating: e.target.value }))
    }
    className="bg-gray-800 border-gray-700 text-white"
  />
</div>

      {/* Synopsis */}
      <div className="space-y-1">
        <Label>Synopsis</Label>
        <Input
          value={formData.synopsis}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, synopsis: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Image URL */}
      <div className="space-y-1">
        <Label>Image URL</Label>
        <Input
          value={formData.image}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, image: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* License Expiry */}
      <div className="space-y-1">
        <Label>License Expiry Date & Time</Label>
        <Input
          type="datetime-local"
          value={formData.licence_expire_date}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              licence_expire_date: e.target.value,
            }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Views */}
      <div className="space-y-1">
        <Label>Views</Label>
        <Input
          type="number"
          value={formData.views}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, views: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
    </div>

    {/* Footer */}
    <DialogFooter className="flex-shrink-0 mt-2">
      <Button
        onClick={handleAddMedia}
        className="bg-amber-600 hover:bg-amber-700"
      >
        Save
      </Button>
      <Button
        variant="ghost"
        onClick={() => setOpenAdd(false)}
        className="ml-2"
      >
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Genre</TableHead>
              <TableHead className="text-gray-400">Rating</TableHead>
              <TableHead className="text-gray-400">Views</TableHead>
              <TableHead className="text-gray-400">Year</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {media.map((m) => (
              <TableRow key={m.media_id} className="border-gray-800 hover:bg-white/5">
                <TableCell className="text-white font-medium">{m.title}</TableCell>
                <TableCell className="text-gray-400">
                  {Array.isArray(m.genres)
                    ? m.genres.join(", ")
                    : m.genre || "Unknown"}
                </TableCell>
                <TableCell>
                  <span className="text-amber-400">★</span>{" "}
                  {m.rating ? Number(m.rating).toFixed(1) : "N/A"}
                </TableCell>
                <TableCell className="text-gray-400">{m.views || 0}</TableCell>
                <TableCell className="text-gray-400">{m.release_year}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor("Published")}>
                    Published
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
                      <DropdownMenuItem
                        className="text-red-400 hover:bg-gray-700"
                        onClick={() => {
                          setSelectedMedia(m)
                          setOpenDelete(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="text-amber-400">{selectedMedia?.title}</span>?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
