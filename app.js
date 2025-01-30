const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.port || 3000;

require("dotenv").config();

const uri = "mongodb://localhost:27017/enissue";
const client = new MongoClient(uri, { useNewUrlParser: true });
const db = client.db("enissue");

// Import du router
const issuesRouter = require("./routes/issues");

// Configuration
app.set("views", "./public/views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");

    // Utilisation du router avec la base de données
    app.use("/", issuesRouter(db));

    // Routes d'erreur
    app.get("/404", (req, res) => {
      res.render("404");
    });

    app.use((req, res, next) => {
      if (req.path !== "/404") {
        res.status(404).redirect("/404");
      } else {
        next();
      }
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).redirect("/error");
    });

    // Démarrage du serveur
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to server:", err);
  });
