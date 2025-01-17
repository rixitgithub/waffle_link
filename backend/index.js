const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const ngoRoutes = require("./routes/ngoRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const campaignRoutes = require("./routes/campaignRoutes.js");
const commentsRoutes = require("./routes/commentsRoutes.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/comments", commentsRoutes);

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
