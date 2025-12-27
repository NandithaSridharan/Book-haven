const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());


const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const bookRoutes = require("./routes/bookRoutes");
app.use("/api/books", bookRoutes);
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);


module.exports = app;
