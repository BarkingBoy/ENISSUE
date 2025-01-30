const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  auteur: { type: String, required: true },
  probleme: { type: String, required: true },
  description: { type: String, required: true },
  Etat: { type: String},
  dateCrea: { type: String },
  id: { type: Number },
});

module.exports = mongoose.model("Issue", issueSchema);
