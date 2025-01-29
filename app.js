const e = require("express");
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.port || 3000;

require("dotenv").config();

const uri = "mongodb://localhost:27017/enissue";
const client = new MongoClient(uri, { useNewUrlParser: true });
const db = client.db("enissue");

client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");
  })
  .catch((err) => {
    console.log("Error connecting to server:", err);
  });



// Configuration
app.set("views", "./public/views");
app.set("view engine", "ejs");
app.use(express.static("public")); // For serving static files
app.use(express.urlencoded({ extended: true }));

let issues = [];

// Routes
app.get("/", (req, res) => {
  
    db.collection('issues').find().toArray().then((issues)=>{
res.render("index.ejs", {issues:issues});
   });
});


app.post("/views/create", (req, res) => {
  const { auteur, probleme, description } = req.body;
   db.collection('issues').insertOne({
    auteur:auteur,
    probleme:probleme,
    description:description,
    Etat: "Nouveau", 
    dateCrea: new Date().toLocaleDateString(), 
    id: issues.length++,
  });

  console.log(issues);
  res.redirect("/");
});

app.post("/issues/delete", (req, res) => {
  const issueId = parseInt(req.body.issueId);

  db.collection('issues').deleteOne({id:issueId}).then((response) => {
 if (response.deletedCount === 1) {
 res.redirect('/')
 } else {
 res.status(404).send('Error: No city found')
 }
})
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Definir le chemin vers la page d'erreur
app.get('/404', (req, res) => {
    res.render('404'); 
});

// Gestion de la page d'erreur
app.use((req, res, next) => {
    
    if (req.path !== "/404") {
      res.status(404).redirect("/404");
    } else {
      next();
    }
});

app.use((err,req,res,next)=> {
  console.error(err.stack);
  res.status(err.status || 500).redirect("/error")
})


console.log(issues.dateCrea);
console.log(issues.etat);
