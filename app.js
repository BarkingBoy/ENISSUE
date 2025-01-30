const express = require("express");
const issuesRouter = require("./routes/issues");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");


require("dotenv").config();

const db =mongoose
  .connect("mongodb://localhost:27017/enissue", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected successfully to server"))
  .catch((err) => console.log("Error connecting to server:", err));

// Configuration
app.set("views", "./public/views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


// Utilisation du router avec la base de données
app.use("/", issuesRouter(db));


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

 // Démarrage du serveur
 try{
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }
  catch(err) {
    console.log("Error connecting to server: ", err)
  };
