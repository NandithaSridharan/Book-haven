import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingBookId, setLoadingBookId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔍 SEARCH BOOKS (Open Library)
  const searchBooks = async () => {
    if (!search) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://openlibrary.org/search.json?q=${search}`
      );
      const data = await res.json();

      const formatted = data.docs.slice(0, 20).map((book) => ({
        key: book.key,
        title: book.title,
        author: book.author_name?.[0] || "Unknown",
        image: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : "/placeholder.jpg",
      }));

      setBooks(formatted);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ENSURE BOOK EXISTS IN MONGODB
  const ensureBookExists = async (book) => {
    try {
      // 1. Check if already exists
      const res = await API.get(`/books/search?title=${book.title}`);

      if (res.data) return res.data;

      // 2. Fetch full details
      const workId = book.key.split("/").pop();

      const detailRes = await fetch(
        `https://openlibrary.org/works/${workId}.json`
      );
      const details = await detailRes.json();

      // 3. Save to MongoDB
      const newBook = await API.post("/books", {
        title: book.title,
        author: book.author,
        image: book.image,
        description:
          typeof details.description === "string"
            ? details.description
            : details.description?.value || "No description",
      });

      return newBook.data;
    } catch (err) {
      console.error("Error ensuring book exists", err);
    }
  };

  // ❤️ Wishlist
  const handleWishlist = async (book) => {
    try {
      setLoadingBookId(book.key);

      const dbBook = await ensureBookExists(book);
      await API.post(`/users/wishlist/${dbBook._id}`);

      alert("Added to wishlist");
    } catch (err) {
      alert("Error adding to wishlist");
    } finally {
      setLoadingBookId(null);
    }
  };

  // 📖 Mark as Read
  const handleRead = async (book) => {
    try {
      setLoadingBookId(book.key);

      const dbBook = await ensureBookExists(book);
      await API.post(`/users/read/${dbBook._id}`);

      alert("Marked as read");
    } catch (err) {
      alert("Error marking as read");
    } finally {
      setLoadingBookId(null);
    }
  };

  // 📘 Go to Book Detail Page
  const handleBookClick = async (book) => {
    const dbBook = await ensureBookExists(book);
    navigate(`/books/${dbBook._id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search books..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={searchBooks}
          className="bg-amber-600 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* Books Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">Search for a book to begin.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.key}
              className="border rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition flex flex-col cursor-pointer"
            >
              {/* CLICKABLE */}
              <div onClick={() => handleBookClick(book)}>
                <img
                  src={book.image || "/placeholder.jpg"}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>

                <div className="mt-auto space-y-2">
                  <button
                    disabled={loadingBookId === book.key}
                    onClick={() => handleWishlist(book)}
                    className="w-full bg-amber-600 text-white p-2 rounded disabled:opacity-50"
                  >
                    {loadingBookId === book.key
                      ? "Processing..."
                      : "Add to Wishlist"}
                  </button>

                  <button
                    disabled={loadingBookId === book.key}
                    onClick={() => handleRead(book)}
                    className="w-full border p-2 rounded disabled:opacity-50"
                  >
                    {loadingBookId === book.key
                      ? "Processing..."
                      : "Mark as Read"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}