const express = require("express");
const router = express.Router();

// Middleware pour passer l'instance db aux routes
const setupRouter = (db) => {
  // Route pour afficher la liste des issues
  router.get("/", (req, res) => {
    db.collection("issues")
      .find()
      .toArray()
      .then((issues) => {
        res.render("index.ejs", { issues: issues });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).redirect("/error");
      });
  });

  // Route pour créer une issue
  router.post("/views/create", (req, res) => {
    const { auteur, probleme, description } = req.body;
    db.collection("issues")
      .insertOne({
        auteur: auteur,
        probleme: probleme,
        description: description,
        Etat: "Nouveau",
        dateCrea: new Date().toLocaleDateString(),
        id: Date.now(), // Utilisation du timestamp comme ID unique
      })
      .then(() => res.redirect("/"))
      .catch((err) => {
        console.error(err);
        res.status(500).redirect("/error");
      });
  });

  // Route pour voir les détails d'une issue
  router.get("/views/detail/:id", (req, res) => {
    const issueId = parseInt(req.params.id);
    db.collection("issues")
      .findOne({ id: issueId })
      .then((issue) => {
        if (!issue) {
          return res.status(404).redirect("/404");
        }
        res.render("detail", { issue });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).redirect("/error");
      });
  });

  // Route pour supprimer une issue
  router.post("/issues/delete", (req, res) => {
    const issueId = parseInt(req.body.issueId);
    db.collection("issues")
      .deleteOne({ id: issueId })
      .then((response) => {
        if (response.deletedCount === 1) {
          res.redirect("/");
        } else {
          res.status(404).redirect("/404");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).redirect("/error");
      });
  });

  return router;
};

module.exports = setupRouter;
