"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"

interface Media {
  media_id: string
  title: string
  release_year: number
  duration: string
  synopsis: string
  image: string
  licence_expire_date: string
  views: number
}

export default function MediaManager() {
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  const [newMedia, setNewMedia] = useState<Partial<Media>>({
    media_id: "",
    title: "",
    release_year: new Date().getFullYear(),
    duration: "",
    synopsis: "",
    image: "",
    licence_expire_date: "",
    views: 0,
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/media")
      const data = await res.json()
      setMediaList(data)
    } catch (err) {
      console.error("Error fetching media:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMedia),
      })
      if (res.ok) {
        await fetchMedia()
        setShowAddModal(false)
      } else {
        console.error("Failed to add media")
      }
    } catch (err) {
      console.error("Error adding media:", err)
    }
  }

  const handleDelete = async () => {
    if (!selectedMedia) return
    try {
      const res = await fetch(`/api/media/${selectedMedia.media_id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        await fetchMedia()
        setShowDeleteModal(false)
      } else {
        console.error("Failed to delete media")
      }
    } catch (err) {
      console.error("Error deleting media:", err)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>🎬 Media Library</CardTitle>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Media
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : mediaList.length === 0 ? (
          <p className="text-gray-500">No media found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaList.map((m) => (
              <Card key={m.media_id} className="relative">
                <img
                  src={m.image}
                  alt={m.title}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <CardContent className="space-y-2">
                  <h3 className="font-semibold text-lg">{m.title}</h3>
                  <p className="text-sm text-gray-500">{m.synopsis}</p>
                  <p className="text-xs text-gray-400">
                    {m.release_year} • {m.duration} • {m.views} views
                  </p>
                </CardContent>

                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedMedia(m)
                    setShowDeleteModal(true)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Media</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Media ID</Label>
              <Input
                value={newMedia.media_id}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, media_id: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={newMedia.title}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Release Year</Label>
                <Input
                  type="number"
                  value={newMedia.release_year}
                  onChange={(e) =>
                    setNewMedia({
                      ...newMedia,
                      release_year: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={newMedia.duration}
                  onChange={(e) =>
                    setNewMedia({ ...newMedia, duration: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Synopsis</Label>
              <Input
                value={newMedia.synopsis}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, synopsis: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={newMedia.image}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, image: e.target.value })
                }
              />
            </div>
            <div>
              <Label>License Expiry</Label>
              <Input
                type="date"
                value={newMedia.licence_expire_date}
                onChange={(e) =>
                  setNewMedia({
                    ...newMedia,
                    licence_expire_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedMedia?.title}</strong>? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
