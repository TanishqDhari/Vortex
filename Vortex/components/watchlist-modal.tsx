"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export function CreateWatchlistModal({ open, onClose, onCreated }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        alert("You must be logged in.");
        return;
      }

      const userId = parseInt(storedUserId, 10);
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          created_by: userId,
          title,
          watchlist_desc: description,
          visibility: visibility === "public",
        }),
      });

      if (!res.ok) throw new Error("Failed to create watchlist");

      onCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create watchlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-wide mb-2">
            Create New Watchlist
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter watchlist title"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-white/10">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-3 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="h-10 px-5"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="h-10 px-5 bg-primary hover:bg-primary/80"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
