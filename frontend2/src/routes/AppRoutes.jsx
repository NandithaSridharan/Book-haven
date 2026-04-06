import { Routes, Route, Link } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Books from "../pages/Books";
import BookDetails from "../pages/BookDetails";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";

import Discussions from "../pages/Discussions";

export default function AppRoutes() {
  return (
    <>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discussions" element={<Discussions />} />
   
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
