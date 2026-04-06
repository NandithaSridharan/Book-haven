import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`rounded-2xl p-5 flex items-center gap-4 ${color}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm mt-0.5 opacity-70">{label}</p>
      </div>
    </div>
  );
}

// ─── Book Card (Wishlist) ──────────────────────────────────────────────────────
function WishlistCard({ book, onRemove, onMarkRead }) {
  const [busy, setBusy] = useState(false);

  const handle = async (action) => {
    setBusy(true);
    await action();
    setBusy(false);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
      {/* Cover */}
      <Link to={`/books/${book._id}`} className="block relative overflow-hidden">
        <img
          src={book.image || "/placeholder.jpg"}
          alt={book.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-white font-medium">View details →</span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/books/${book._id}`}>
          <h3 className="font-bold text-gray-900 leading-snug hover:text-amber-700 transition-colors line-clamp-2">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>

        {/* Genre pills */}
        {book.genres?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {book.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-3 flex gap-2">
          <button
            disabled={busy}
            onClick={() => handle(onMarkRead)}
            className="flex-1 text-xs py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 font-medium"
          >
            ✓ Read
          </button>
          <button
            disabled={busy}
            onClick={() => handle(onRemove)}
            className="text-xs px-3 py-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Remove from wishlist"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── History Card ─────────────────────────────────────────────────────────────
function HistoryCard({ item }) {
  const book = item.book;
  const date = item.completedAt
    ? new Date(item.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <Link to={`/books/${book._id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50 transition-colors group">
      <img
        src={book.image || "/placeholder.jpg"}
        alt={book.title}
        className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
          {book.title}
        </h4>
        <p className="text-sm text-gray-500 truncate">{book.author}</p>
        {date && <p className="text-xs text-gray-400 mt-0.5">Completed {date}</p>}
      </div>
      <div className="flex-shrink-0">
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
          ✓ Done
        </span>
      </div>
    </Link>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ icon, message, linkTo, linkLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-sm px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [wishlist, setWishlist] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    API.get("/users/dashboard")
      .then((res) => {
        setWishlist(res.data.wishlist || []);
        setReadingHistory(res.data.readingHistory || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await API.delete(`/users/wishlist/${bookId}`);
      setWishlist((prev) => prev.filter((b) => b._id !== bookId));
      showToast("Removed from wishlist");
    } catch {
      showToast("Failed to remove");
    }
  };

  const markAsRead = async (bookId) => {
    try {
      await API.post(`/users/read/${bookId}`);
      const book = wishlist.find((b) => b._id === bookId);
      setWishlist((prev) => prev.filter((b) => b._id !== bookId));
      if (book) {
        setReadingHistory((prev) => [
          { book, completedAt: new Date().toISOString() },
          ...prev,
        ]);
      }
      showToast("Marked as read ✓");
    } catch (err) {
      showToast(err.response?.data?.message || "Error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-bounce">
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Track your reading journey</p>
        </div>
        <Link
          to="/books"
          className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors"
        >
          + Browse Books
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="📚"
          label="Books Read"
          value={readingHistory.length}
          color="bg-amber-50 border border-amber-200 text-amber-900"
        />
        <StatCard
          icon="⭐"
          label="In Wishlist"
          value={wishlist.length}
          color="bg-orange-50 border border-orange-200 text-orange-900"
        />
        <StatCard
          icon="🔥"
          label="Reading Streak"
          value={`${Math.min(readingHistory.length, 7)} days`}
          color="bg-rose-50 border border-rose-200 text-rose-900"
        />
      </div>

      {/* ── Wishlist ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            ⭐ Wish List
            {wishlist.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({wishlist.length})</span>
            )}
          </h2>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon="📖"
            message="Your wishlist is empty. Find books you'd love to read!"
            linkTo="/books"
            linkLabel="Browse books"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlist.map((book) => (
              <WishlistCard
                key={book._id}
                book={book}
                onRemove={() => removeFromWishlist(book._id)}
                onMarkRead={() => markAsRead(book._id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Reading History ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📖 Reading History
            {readingHistory.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({readingHistory.length})</span>
            )}
          </h2>
        </div>

        {readingHistory.length === 0 ? (
          <EmptyState
            icon="🌟"
            message="No books read yet. Mark a book as read to track your progress!"
            linkTo="/books"
            linkLabel="Start reading"
          />
        ) : (
          <div className="bg-white border border-amber-100 rounded-2xl shadow-sm divide-y divide-gray-50">
            {readingHistory.map((item, i) => (
              <HistoryCard key={item.book?._id || i} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}