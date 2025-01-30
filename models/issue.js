const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  auteur: { type: String, required: true },
  probleme: { type: String, required: true },
  description: { type: String, required: true },
  Etat: {
    type: String,
    required: true,
    default: "Nouveau",
  },
  dateCrea: {
    type: String,
    required: true,
    default: () => new Date().toLocaleDateString(),
  },
  id: { type: Number, required: true },
});

module.exports = mongoose.model("Issue", issueSchema);
module.exports = mongoose.model("Issue", issueSchema);
