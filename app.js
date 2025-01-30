const e = require("express");
const express = require("express");
const app = express();
const port = 3000;

// Configuration
app.set("views", "./public/views");
app.set("view engine", "ejs");
app.use(express.static("public")); // For serving static files
app.use(express.urlencoded({ extended: true }));

let issues = [];

// Routes
app.get("/", (req, res) => {
  res.render("index", { issues });
});

app.post("/views/create", (req, res) => {
  const { auteur, probleme, description } = req.body;
  issues.push({
    auteur,
    probleme,
    description,
    Etat: "Nouveau", 
    dateCrea: new Date().toLocaleDateString(), 
    id: issues.length++,
  });
  console.log(issues);
  res.redirect("/");
});
app.get("/views/detail/:id", (req, res) => {
  const issueId = req.params.id;
    
  res.render("detail", { issue: issues[issueId] });
});
// app.post("/issues/detail/:id", (req, res) => {
//   const { auteur, probleme, description } = req.body;
//   issues.push({
//     auteur,
//     probleme,
//     description,
//   });
//   res.redirect("/");
// });

app.post("/issues/delete", (req, res) => {
  const issueId = parseInt(req.body.issueId);
  issues = issues.filter((issue) => issue.id !== issueId); 
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

console.log(issues.dateCrea);
console.log(issues.etat);
