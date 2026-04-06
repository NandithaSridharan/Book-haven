import { useState, useEffect } from "react";
import API from "../api/axios";

// ─── Mock data (replace with real API calls once backend is wired up) ──────────
const MOCK_DISCUSSIONS = [
  {
    id: 1,
    title: "Best books for beginners?",
    category: "Recommendations",
    author: "Alice",
    avatar: "A",
    replies: [
      { id: 1, author: "Bob", avatar: "B", text: "Start with 'The Alchemist' — short, profound, easy to digest.", createdAt: "2h ago", likes: 4 },
      { id: 2, author: "Cara", avatar: "C", text: "I'd suggest 'Harry Potter'. It hooks you immediately!", createdAt: "1h ago", likes: 2 },
    ],
    createdAt: "3h ago",
    tags: ["beginners", "recommendations"],
  },
  {
    id: 2,
    title: "Fantasy vs Sci-Fi — which do you prefer?",
    category: "Genre Talk",
    author: "Dave",
    avatar: "D",
    replies: [
      { id: 1, author: "Eve", avatar: "E", text: "Fantasy for the world-building. Nothing beats Middle-Earth.", createdAt: "5h ago", likes: 7 },
    ],
    createdAt: "6h ago",
    tags: ["fantasy", "sci-fi", "genre"],
  },
  {
    id: 3,
    title: "Books that changed your life",
    category: "Personal Picks",
    author: "Frank",
    avatar: "F",
    replies: [],
    createdAt: "1d ago",
    tags: ["life-changing", "personal"],
  },
];

const CATEGORIES = ["All", "Recommendations", "Genre Talk", "Personal Picks", "Book Clubs", "Reviews"];

// ─── AI reply generator using Claude API ─────────────────────────────────────
async function getAISuggestion(topic, userQuestion) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a helpful book discussion assistant on a book community platform called Book Haven. A user is discussing: "${topic}". They asked: "${userQuestion}". Give a thoughtful, engaging, book-lover's response in 2-3 sentences. Be warm and conversational.`,
        },
      ],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Couldn't generate a suggestion.";
}

// ─── Components ───────────────────────────────────────────────────────────────

function Avatar({ letter, size = "md" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  const colors = { A: "bg-violet-500", B: "bg-emerald-500", C: "bg-amber-500", D: "bg-sky-500", E: "bg-rose-500", F: "bg-indigo-500" };
  const bg = colors[letter] || "bg-gray-700";
  return (
    <div className={`${sizes[size]} ${bg} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {letter}
    </div>
  );
}

function ReplyCard({ reply, onLike }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <Avatar letter={reply.avatar} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{reply.author}</span>
          <span className="text-xs text-gray-400">{reply.createdAt}</span>
          {reply.isAI && (
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">✨ AI suggested</span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{reply.text}</p>
        <button
          onClick={() => onLike(reply.id)}
          className="mt-1.5 text-xs text-gray-400 hover:text-violet-600 flex items-center gap-1 transition-colors"
        >
          ♡ {reply.likes || 0} likes
        </button>
      </div>
    </div>
  );
}

function DiscussionThread({ discussion, onBack }) {
  const [replies, setReplies] = useState(discussion.replies);
  const [newReply, setNewReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const handlePost = () => {
    if (!newReply.trim()) return;
    const reply = {
      id: Date.now(),
      author: "You",
      avatar: "Y",
      text: newReply,
      createdAt: "just now",
      likes: 0,
    };
    setReplies([...replies, reply]);
    setNewReply("");
    setAiSuggestion("");
  };

  const handleAISuggest = async () => {
    if (!newReply.trim()) {
      alert("Type something first, then ask AI to help refine it!");
      return;
    }
    setAiLoading(true);
    try {
      const suggestion = await getAISuggestion(discussion.title, newReply);
      setAiSuggestion(suggestion);
    } catch {
      alert("AI suggestion failed. Check your API connection.");
    } finally {
      setAiLoading(false);
    }
  };

  const useAISuggestion = () => {
    setNewReply(aiSuggestion);
    setAiSuggestion("");
  };

  const handleLike = (replyId) => {
    setReplies(replies.map(r => r.id === replyId ? { ...r, likes: (r.likes || 0) + 1 } : r));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        ← Back to discussions
      </button>

      {/* Thread header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <Avatar letter={discussion.avatar} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{discussion.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Posted by <span className="font-medium">{discussion.author}</span> · {discussion.createdAt}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mt-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{discussion.category}</span>
          {discussion.tags?.map(tag => (
            <span key={tag} className="text-xs bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Replies */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          {replies.length} {replies.length === 1 ? "reply" : "replies"}
        </h3>
        {replies.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">No replies yet. Be the first!</p>
        ) : (
          replies.map(reply => <ReplyCard key={reply.id} reply={reply} onLike={handleLike} />)
        )}
      </div>

      {/* Reply composer */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add a reply</h3>
        <textarea
          rows={3}
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
        />

        {/* AI suggestion result */}
        {aiSuggestion && (
          <div className="mt-3 bg-violet-50 border border-violet-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-violet-700 mb-1">✨ AI suggestion:</p>
            <p className="text-sm text-gray-700">{aiSuggestion}</p>
            <button
              onClick={useAISuggestion}
              className="mt-2 text-xs bg-violet-600 text-white px-3 py-1.5 rounded-md hover:bg-violet-700 transition-colors"
            >
              Use this suggestion
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handlePost}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            Post reply
          </button>
          <button
            onClick={handleAISuggest}
            disabled={aiLoading}
            className="px-4 py-2 border border-violet-300 text-violet-700 text-sm rounded-lg hover:bg-violet-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {aiLoading ? (
              <><span className="animate-spin">⏳</span> Thinking...</>
            ) : (
              <>✨ AI help</>
            )}
          </button>
          <span className="text-xs text-gray-400 ml-1">AI can help polish your reply</span>
        </div>
      </div>
    </div>
  );
}

function NewDiscussionModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Recommendations");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({
      id: Date.now(),
      title,
      category,
      author: "You",
      avatar: "Y",
      replies: [],
      createdAt: "just now",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Start a Discussion</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Question</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="fantasy, beginners, classics..."
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Create Discussion
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Discussions Page ────────────────────────────────────────────────────
export default function Discussions() {
  const [discussions, setDiscussions] = useState(MOCK_DISCUSSIONS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = discussions.filter((d) => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleCreate = (newDiscussion) => {
    setDiscussions([newDiscussion, ...discussions]);
  };

  if (selectedDiscussion) {
    return (
      <div className="py-4">
        <DiscussionThread
          discussion={selectedDiscussion}
          onBack={() => setSelectedDiscussion(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showModal && (
        <NewDiscussionModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
          <p className="text-gray-500 mt-1">Join the conversation with fellow readers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          + New Discussion
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search topics or tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
      />

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              activeCategory === cat
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discussion list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-12">No discussions found. Start one!</p>
        )}
        {filtered.map((discussion) => (
          <div
            key={discussion.id}
            onClick={() => setSelectedDiscussion(discussion)}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md cursor-pointer transition-all hover:border-violet-200 group"
          >
            <div className="flex items-start gap-3">
              <Avatar letter={discussion.avatar} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors truncate">
                  {discussion.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-medium">{discussion.author}</span> · {discussion.createdAt}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{discussion.category}</span>
                  {discussion.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-700">{discussion.replies.length}</p>
                <p className="text-xs text-gray-400">replies</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI info callout */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl">✨</span>
        <div>
          <p className="text-sm font-semibold text-violet-800">AI-powered replies</p>
          <p className="text-xs text-violet-600 mt-0.5">
            Open any discussion and use the "AI help" button to get Claude to help craft or improve your reply.
          </p>
        </div>
      </div>
    </div>
  );
}