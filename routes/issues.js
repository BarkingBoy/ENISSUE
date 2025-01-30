const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");

// List all issues
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find({});
    res.render("index.ejs", { issues });
  } catch (err) {
    console.error(err);
    res.status(500).redirect("/error");
  }
});

// Create new issue
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
     console.log("ID recherché:", issueId);

      const issue = await Issue.findOne({ id: issueId });
      console.log("Issue trouvée:", issue);

      if (!issue) {
        console.log("Aucune issue trouvée");
        return res.status(404).redirect("/404");
      }

      res.render("detail.ejs", { issue });
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      res.status(500).redirect("/error");
    }
  });

// Update issue
router.post("/issues/detail/:id", async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    const { auteur, probleme, description } = req.body;

    const response = await Issue.updateOne(
      { id: issueId },
      { $set: { auteur, probleme, description } }
    );

    if (response.modifiedCount === 0) {
      return res.redirect("/");
    }

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).redirect("/error");
  }
});

// Delete issue
router.post("/issues/delete", async (req, res) => {
  try {
    const issueId = parseInt(req.body.issueId);
    const response = await Issue.deleteOne({ id: issueId });

    if (response.deletedCount === 1) {
      res.redirect("/");
    } else {
      res.status(404).send("Error: No issue found");
    }
  } catch (err) {
        console.error(err);
        res.status(500).redirect("/error");
      }
  });

module.exports = router;
