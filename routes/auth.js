const express = require("express");
const router = express.Router();
const { LoginExpress } = require("login-express");
const Account = require("../models/accountSchema");

// Initialize LoginExpress FIRST
const loginJS = new LoginExpress({
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtResetSecret: process.env.JWT_RESET_SECRET || "your-reset-secret",
  emailFromUser: process.env.EMAIL_USER,
  emailFromPass: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  userModel: Account,
  clientBaseUrl: process.env.CLIENT_BASE_URL || "http://localhost:3000",
});
// Show registration page
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await loginJS.register(res, { name, email, password });
    res.redirect("/login"); // Redirect to login page after successful registration
  } catch (err) {
    res.status(400).render("register", { error: err.message });
  }
});

// Add other auth routes (login, logout, etc.) here
// send verification email
router.post("/send-verify-email", loginJS.isLoggedIn, async (req, res) => {
  try {
    await loginJS.sendVerificationEmail(req.user);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// verify email
router.patch("/verify-email", async (req, res) => {
  const { token } = req.body;
  try {
    await loginJS.verify(token);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// request password change
router.post("/send-reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    await loginJS.sendPasswordResetEmail(email);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// change password
router.patch("/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    await loginJS.changePassword(res, { resetToken, newPassword });
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// login
router.get("/login", (req, res) => {
  res.render("login"); // Remove the leading slash
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await loginJS.login(res, { email, password });
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// logout
router.post("/logout", loginJS.isLoggedIn, async (req, res) => {
  try {
    loginJS.logout(res);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// get user
router.get("/user", loginJS.isLoggedIn, (req, res) => {
  res.status(200).send(req.user);
});

module.exports = router;
