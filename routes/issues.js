const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {issue} = require("./models/issue");


// Middleware pour passer l'instance db aux routes
const setupRouter = (db) => {
  //Schema mongoose
  // const issueSchema = new mongoose.Schema({
  //   auteur: String,
  //   probleme: String,
  //   description: String,
  //   Etat: {
  //     type: String,
  //     default: "Nouveau",
  //   },
  //   dateCrea: { type: String, default: new Date().toLocaleDateString() },
  //   id: Number,
  // });

  //Modele
  const Issue = mongoose.model("Issue", issueSchema);

  // Route pour afficher la liste des issues
  router.get("/", async (req, res) => {
    try {
      const issues = await Issue.find({});
      res.render("index.ejs", { issues });
    } catch (err) {
      console.error(err);
      res.status(500).redirect("/error");
    }
  });

  // Route pour créer une issue
  router.post("/views/create", async (req, res) => {
    try {
      const { auteur, probleme, description } = req.body;
      const lastIssue = await Issue.findOne().sort({ id: -1 });
      const nextId = lastIssue ? lastIssue.id + 1 : 0;
      await Issue.create({
        auteur,
        probleme,
        description,
        id: nextId,
      });
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).redirect("/error");
    }
  });

  // Route pour voir les détails d'une issue
  router.get("/views/detail/:id", async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const issue = await issue.findOne({ id: issueId });

      if (!issue) {
        return res.status(404).redirect("/404");
      }

      res.render("detail", { issue });
    } catch (err) {
      console.error(err);
      res.status(500).redirect("/error");
    }
  });

  //update
  router.post("/issues/detail/:id", async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const { auteur, probleme, description } = req.body;

      const response = await Issue.updateOne(
        { id: issueId },
        {
          set: {
            auteur,
            probleme,
            description,
          },
        }
      );

      if (response.modifiedCount === 0) {
        return res.status(404).redirect("/404");
      }

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  });


  // Route pour supprimer une issue
  router.post("/issues/delete", async (req, res) => {
    try {
    const issueId = parseInt(req.body.issueId);

    const response = await Issue.deleteOne({ id: issueId });

    if (response.deletedCount === 1) {
      res.redirect("/");
    } else {
      res.status(404).send("Error: No city found");
    }
  } catch (err) {
        console.error(err);
        res.status(500).redirect("/error");
      };
  });

  return router;
};

module.exports = setupRouter;
