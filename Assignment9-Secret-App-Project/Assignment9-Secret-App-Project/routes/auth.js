import express from "express";
import passport from "passport";
import User from "../models/User.js";
import e from "connect-flash";

const router = express.Router();

// Root Route
router.get("/", (req, res) => res.render("index"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Handle
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

// Login Handle
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout((e) => {
    if (e) console.log(e);
  });
  res.redirect("/");
});

export default router;
