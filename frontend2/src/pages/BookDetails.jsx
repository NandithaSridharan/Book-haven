import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

// ─── AI Synopsis Generator ─────────────────────────────────────────────────────
async function generateAISynopsis(title, author, description, genres) {
  const prompt = `You are a knowledgeable literary assistant on a book discovery platform. Write a compelling, spoiler-free synopsis for the book "${title}" by ${author}.
${description && description !== "No description" ? `Existing description hint: ${description}` : ""}
${genres?.length ? `Genres: ${genres.join(", ")}` : ""}

Write 3–4 engaging sentences that:
1. Introduce the premise and central conflict
2. Hint at themes without spoiling the story
3. End with a hook that makes someone want to read it

Write in a warm, bookstore-quality tone. Do not start with "Synopsis:" or any label.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text || null;
}

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange?.(star)}
          className={`text-2xl leading-none transition-transform ${
            readonly ? "cursor-default" : "hover:scale-110 cursor-pointer"
          }`}
        >
          <span
            className={
              (hovered || value) >= star ? "text-amber-400" : "text-gray-200"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const initials = review.user?.name?.[0]?.toUpperCase() || "?";
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {review.user?.name || "Anonymous"}
          </p>
          <div className="flex items-center gap-2">
            <StarRating value={review.rating} readonly />
            {date && <span className="text-xs text-gray-400">{date}</span>}
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed mt-1 pl-12">
          {review.comment}
        </p>
      )}
    </div>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────────
function SkeletonPulse({ className }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

// ─── Main BookDetails Page ─────────────────────────────────────────────────────
export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // AI synopsis
  const [synopsis, setSynopsis] = useState("");
  const [synopsisLoading, setSynopsisLoading] = useState(false);
  const [synopsisGenerated, setSynopsisGenerated] = useState(false);

  // Review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Action feedback
  const [actionMsg, setActionMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Load book + reviews on mount
  useEffect(() => {
    API.get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => {
        alert("Failed to load book details.");
        navigate("/books");
      })
      .finally(() => setLoading(false));

    API.get(`/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => {}); // reviews are optional — fail silently
  }, [id, navigate]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleGenerateSynopsis = async () => {
    if (!book) return;
    setSynopsisLoading(true);
    try {
      const text = await generateAISynopsis(
        book.title,
        book.author,
        book.description,
        book.genres
      );
      setSynopsis(text);
      setSynopsisGenerated(true);
    } catch {
      alert("Failed to generate synopsis. Check API connectivity.");
    } finally {
      setSynopsisLoading(false);
    }
  };

  const showFeedback = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const addToWishlist = async () => {
    setActionLoading(true);
    try {
      await API.post(`/users/wishlist/${id}`);
      showFeedback("Added to wishlist ✓");
    } catch (err) {
      showFeedback(err.response?.data?.message || "Error adding to wishlist");
    } finally {
      setActionLoading(false);
    }
  };

  const markAsRead = async () => {
    setActionLoading(true);
    try {
      await API.post(`/users/read/${id}`);
      showFeedback("Marked as read ✓");
    } catch (err) {
      showFeedback(err.response?.data?.message || "Error");
    } finally {
      setActionLoading(false);
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      setReviewError("Please select a star rating first.");
      return;
    }
    setSubmitting(true);
    setReviewError("");
    try {
      const res = await API.post(`/reviews/${id}`, { rating, comment });
      setReviews([res.data, ...reviews]);
      setRating(0);
      setComment("");
    } catch (err) {
      setReviewError(
        err.response?.data?.message || "Could not submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          <SkeletonPulse className="h-80 w-full rounded-xl" />
          <div className="space-y-4 pt-2">
            <SkeletonPulse className="h-8 w-3/4" />
            <SkeletonPulse className="h-5 w-1/3" />
            <SkeletonPulse className="h-4 w-1/4 mt-2" />
            <SkeletonPulse className="h-24 w-full mt-4" />
            <div className="flex gap-3 mt-4">
              <SkeletonPulse className="h-10 w-36" />
              <SkeletonPulse className="h-10 w-36" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  // Compute average rating from fetched reviews (live, not stale DB value)
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>

      {/* ── Book Hero ── */}
      <div className="grid md:grid-cols-[220px_1fr] gap-8 items-start">
        {/* Cover image */}
        <img
          src={book.image || "/placeholder.jpg"}
          alt={book.title}
          className="w-full rounded-xl shadow-lg object-cover"
          style={{ maxHeight: 320 }}
        />

        {/* Book info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {book.title}
            </h1>
            <p className="text-lg text-gray-500 mt-1">by {book.author}</p>
          </div>

          {/* Genres + tags */}
          {(book.genres?.length > 0 || book.tags?.length > 0) && (
            <div className="flex gap-2 flex-wrap">
              {book.genres?.map((g) => (
                <span
                  key={g}
                  className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
              {book.tags?.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Community rating */}
          {avgRating && (
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xl leading-none">★</span>
              <span className="font-semibold text-gray-800">{avgRating}</span>
              <span className="text-gray-400 text-sm">
                ({reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          {/* Availability badge */}
          {book.availability && (
            <span
              className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                book.availability === "available"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {book.availability === "available"
                ? "✓ Available"
                : "✗ Currently lent out"}
            </span>
          )}

          {/* Description from Open Library / DB */}
          {book.description && book.description !== "No description" && (
            <p className="text-gray-600 leading-relaxed text-sm">
              {book.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap pt-1">
            <button
              onClick={addToWishlist}
              disabled={actionLoading}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              ⭐ Add to Wishlist
            </button>
            <button
              onClick={markAsRead}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              ✓ Mark as Read
            </button>
          </div>

          {/* Inline feedback */}
          {actionMsg && (
            <p className="text-sm text-emerald-600 font-medium">{actionMsg}</p>
          )}
        </div>
      </div>

      {/* ── AI Synopsis ── */}
      <div className="border border-amber-200 rounded-2xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="font-semibold text-amber-900">
                AI-Powered Synopsis
              </h2>
              <p className="text-xs text-amber-600">
                Claude generates a compelling, spoiler-free overview of this book
              </p>
            </div>
          </div>

          {!synopsisGenerated && (
            <button
              onClick={handleGenerateSynopsis}
              disabled={synopsisLoading}
              className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
            >
              {synopsisLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                "✨ Generate Synopsis"
              )}
            </button>
          )}
        </div>

        {/* Synopsis body */}
        <div className="px-6 py-5 bg-white min-h-[80px] flex items-start">
          {!synopsisGenerated && !synopsisLoading && (
            <p className="text-sm text-gray-400 italic self-center">
              Click "Generate Synopsis" — Claude will craft a literary overview
              just for this book.
            </p>
          )}
          {synopsisLoading && (
            <div className="space-y-2 w-full animate-pulse pt-1">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
              <div className="h-3 bg-gray-100 rounded w-4/6" />
            </div>
          )}
          {synopsis && !synopsisLoading && (
            <div className="w-full">
              <p className="text-gray-700 leading-relaxed">{synopsis}</p>
              <button
                onClick={handleGenerateSynopsis}
                disabled={synopsisLoading}
                className="mt-3 text-xs text-amber-500 hover:text-amber-700 underline transition-colors"
              >
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews{" "}
          {reviews.length > 0 && (
            <span className="text-base font-normal text-gray-400">
              ({reviews.length})
            </span>
          )}
        </h2>

        {/* Submit review form */}
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Write a Review
          </h3>

          <div>
            <p className="text-xs text-gray-500 mb-1.5">Your rating</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
          />

          {reviewError && (
            <p className="text-red-500 text-xs">{reviewError}</p>
          )}

          <button
            onClick={submitReview}
            disabled={submitting}
            className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Review"}
          </button>
        </div>

        {/* Review list */}
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">
            No reviews yet — be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <ReviewCard key={r._id} review={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}