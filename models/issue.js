const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  auteur: { type: String, required: true },
  probleme: { type: String, required: true },
  description: { type: String, required: true },
  Etat: { type: String, required: true },
  dateCrea: { type: String, required: true },
  id: { type: Number, required: true },
});

module.exports = mongoose.model("Issue", issueSchema);
