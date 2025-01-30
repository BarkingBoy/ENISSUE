const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017/enissue", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected successfully to server"))
  .catch((err) => console.log("Error connecting to server:", err));

  //Schema mongoose
  const issueSchema = new mongoose.Schema({
    auteur: auteur,
    probleme: probleme,
    description: description,
    Etat: "Nouveau",
    dateCrea: new Date().toLocaleDateString(),
    id: id,
  });

//Modele
const Issue = mongoose.model('Issue',issueSchema);

// Configuration
app.set("views", "./public/views");
app.set("view engine", "ejs");
app.use(express.static("public")); // For serving static files
app.use(express.urlencoded({ extended: true }));


// Routes
app.get("/", async (req, res) => {
  try{
    const issues = await Issue.find({});
res.render("index.ejs", {issues});
    } catch(err){
      next(err);
    }
   });


app.post("/views/create", async (req, res, next) => {
 try{
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
}catch(err){
  next(err);
}
});

//details
app.get("/views/detail/:id", async (req, res, next) => {
  try{
  const issueId = parseInt(req.params.id);
  const issue = await issue.findOne({id:issueId});

  if(!issue){
    return res.status(404).redirect('/404');
  }
    
  res.render("detail", { issue });
  } catch(err){
    next(err);
  }
});

//update
app.post("/issues/detail/:id", async (req, res, next) => {
  try{
  const issueId = parseInt(req.params.id);
  const { auteur, probleme, description } = req.body;

  const response = await Issue.updateOne(
  {id:issueId},
  {
    set:{
    auteur,
    probleme,
    description,
    }
  });

  if(response.modifiedCount === 0){
        return res.status(404).redirect("/404");
  }

  res.redirect("/");
}catch(err){
  next(err);
}
});


app.post("/issues/delete", async (req, res, next) => {
  try{
  const issueId = parseInt(req.body.issueId);

  const response = await Issue.deleteOne({id:issueId});

 if (response.deletedCount === 1) {
 res.redirect('/')
 } else {
 res.status(404).send('Error: No city found');
 }
  }
  catch(err){
    next(err);
  }
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


