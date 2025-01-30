const express = require("express");
const mongoose = require("mongoose");
const issuesRouter = require("./routes/issues");
const authRouter = require("./routes/auth"); // Add this line
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/enissue")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configuration
app.set("views", "./public/views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mount routers
app.use("/", authRouter); // Add this line BEFORE issuesRouter
app.use("/", issuesRouter);

// Error handling
app.get("/404", (req, res) => res.render("404"));
app.get("/error", (req, res) => res.render("error"));

app.use((req, res) => res.status(404).redirect("/404"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).redirect("/error");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
