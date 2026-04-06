import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      {/* LEFT: Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-xl">
        📚 Book Haven
      </Link>

      {/* CENTER: Main Navigation */}
      <div className="flex gap-6">
        <Link to="/books" className="hover:underline">
          Browse
        </Link>
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/discussions" className="hover:underline">
          Discussions
        </Link>
      </div>

      {/* RIGHT: Auth */}
      <div className="relative flex items-center gap-3">
        {!user ? (
          <>
            {/* View Profile button (NEW) */}
            <Link
              to="/profile"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              View Profile
            </Link>

            {/* Login button */}
            <Link
              to="/login"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            {/* Profile Avatar */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"
            >
              {user.email?.[0]?.toUpperCase()}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 border rounded shadow bg-white">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
