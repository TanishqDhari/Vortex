import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

type Review = {
  review_id: number;
  media_id: number;
  user_id: number;
  review_type?: string | null;
  review_desc?: string | null;
  rating?: number | null;
  username?: string | null;
};

export default function ReviewSection({ mediaId }: { mediaId: number }) {
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWritingVisible, setIsWritingVisible] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    userId: null as number | null,
  });
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (!stored) window.location.href = "/login";
    else setUserId(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    if (userId === null) return;
    fetchReviews();
  }, [mediaId, userId]);

  useEffect(() => {
    if (userId === null) return;

    const my = reviews.find((r) => r.user_id === userId && r.review_desc?.trim());

    if (my) {
      setIsWritingVisible(false);
      setReviewText(my.review_desc ?? "");
      setEditingReviewId(my.review_id);
    } else {
      setIsWritingVisible(true);
      setEditingReviewId(null);
      setReviewText("");
    }
  }, [reviews, userId]);

  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height = taRef.current.scrollHeight + "px";
  }, [reviewText]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(`/api/review?media_id=${mediaId}&user_id=${userId}`);
      const data = res.ok ? await res.json() : [];
      setReviews(data);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  }

  async function submitReview() {
    const text = reviewText.trim();
    if (!text) return alert("Review cannot be empty.");

    const my = reviews.find((r) => r.user_id === userId);

    const payload = {
      user_id: userId,
      media_id: mediaId,
      review_desc: text,
    };

    const method = my ? "PATCH" : "POST";

    await fetch("/api/review", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchReviews();
    setIsWritingVisible(false);
  }

  function startEditing() {
    setIsWritingVisible(true);
    setTimeout(() => {
      if (!taRef.current) return;
      taRef.current.focus();
      taRef.current.style.height = "auto";
      taRef.current.style.height = taRef.current.scrollHeight + "px";
    }, 50);
  }

  function requestDelete(user_id: number) {
    setDeleteModal({ open: true, userId: user_id });
  }

  async function confirmDelete() {
    if (!deleteModal.userId) return;

    await fetch("/api/review", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: deleteModal.userId, media_id: mediaId }),
    });

    await fetchReviews();

    setReviewText("");
    setIsWritingVisible(true);
    setEditingReviewId(null);
    setDeleteModal({ open: false, userId: null });
  }

  if (userId === null) return null;

  return (
    <div className="space-y-6">

      {/* MAIN TEXTAREA ONLY */}
      {isWritingVisible && (
        <div className="space-y-3">
          <p className="font-medium">Write a Review</p>
          <textarea
            ref={taRef}
            className="w-full p-3 rounded border bg-background focus:outline-none"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            style={{ resize: "none" }}
          />
          <div className="flex gap-2">
            <Button onClick={submitReview}>Save</Button>
            <Button
              variant="outline"
              onClick={() => {
                const my = reviews.find((r) => r.user_id === userId);
                if (my) setIsWritingVisible(false);
                else setReviewText("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isWritingVisible && <hr className="my-4" />}

      {/* REVIEWS LIST */}
      <div className="space-y-3">
        {loading && <p className="text-muted-foreground">Loading reviews...</p>}

        {!loading &&
          reviews
            .filter((r) => r.review_desc?.trim())
            .map((r) => (
              <ReviewCard
                key={`${r.user_id}-${r.media_id}`}
                r={r}
                currentUserId={userId}
                onEdit={startEditing}
                onDelete={() => requestDelete(r.user_id)}
              />
            ))}
      </div>

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteModal({ open: false, userId: null })}
          />
          <div className="relative z-10 bg-card p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold">Delete review?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ open: false, userId: null })}
              >
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-600 focus:bg-red-600 active:bg-red-600 transition-none">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* REVIEW CARD */
function ReviewCard({
  r,
  currentUserId,
  onEdit,
  onDelete,
}: {
  r: Review;
  currentUserId: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="py-4 border-y border-white/15">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-3">
            <p className="font-semibold">{r.username}</p>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400" fill="currentColor" stroke="none" />
              <span>{r.rating ?? "—"}/10</span>
            </div>
          </div>

          <p className="mt-2 leading-relaxed">{r.review_desc}</p>
        </div>

        {r.user_id === currentUserId && (
          <div className="flex gap-2 h-fit">
            <button className="px-2 py-1 text-sm border rounded" onClick={onEdit}>
              Edit
            </button>
            <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={onDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
