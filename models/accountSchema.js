const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  // required fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  verifyEmail: { type: Boolean, default: false },
  verifyEmailToken: { type: [String], default: [] },
  resetToken: { type: [String], default: [] },
  auth: { type: String, default: "USER" },
  // example of custom field
  customField: { type: String, default: "initialValue" },
});

module.exports = mongoose.model("Account", accountSchema);
