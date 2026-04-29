import express from "express";
import passport from "../middleware/passport";
import * as db from "../fake-db";
const router = express.Router();
const devMode = process.env.MODE === "dev";

router.get("/login", async (req, res) => {
  res.render("login", { 
    devMode, 
    error: req.query.error || null
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/auth/login",
  }),
);

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

//added by Lindy
// GET: Renders the signup page and checks for URL error messages
router.get("/signup", async (req, res) => {
  try {
    const user = await req.user;
    res.render("signup", { user, error: req.query.error || null });
  } catch (err) {
    res.status(500).send("Error loading signup page");
  }
});

//added by Lindy
// POST: Processes the form data
router.post("/signup", async (req, res, next) => {
  const { uname, password } = req.body;
  
  // 1. Check if username is taken (uses our new safe db function)
  const existingUser = await db.getUserByUsername(uname);
  if (existingUser) {
    return res.redirect("/auth/signup?error=Username already taken");
  }

  // 2. Add the user to the fake database
  const newUser = await db.addUser(uname, password);

  // 3. Log them in automatically
  req.login(newUser, (err) => {
    if (err) return next(err);
    res.redirect("/posts");
  });
});

export default router;
