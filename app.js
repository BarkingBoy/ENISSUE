const express = require("express");
const issuesRouter = require("../ENISSUE/routes/issues");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
app.use(express.static('public')); // Link to your static files (like CSS and JS)

require("dotenv").config();

// Database connection
mongoose
  .connect("mongodb://localhost:27017/enissue", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configuration
app.set("views", "./public/views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", issuesRouter);

// Error handling
app.get("/404", (req, res) => res.render("404"));
app.get("/error", (req, res) => res.render("error"));

app.use((req, res) => res.status(404).redirect("/404"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).redirect("/error");
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
