const express = require("express");
const path = require("path");
const { getActivities, addActivity } = require("./fake-db");

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---

// This allows Express to read data sent from your EJS forms (req.body)
app.use(express.urlencoded({ extended: true }));

// Serves static files from the public folder (CSS, Images)
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- ROUTES ---

// Home Page
app.get("/", (req, res) => {
  res.render("index", { pageTitle: "Home", user: null });
});

// Destinations Page
app.get("/destinations", (req, res) => {
  res.render("destinations", { pageTitle: "Destinations", user: null });
});

// Food & Restaurants Page
app.get("/food", (req, res) => {
  res.render("food", { pageTitle: "Food & Restaurants", user: null });
});

// Contact Page
app.get("/contact", (req, res) => {
  res.render("contact", { pageTitle: "Contact Us", user: null });
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login", { pageTitle: "Login", user: null });
});

// Login Form Submit
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", username, password);

  res.redirect("/");
});

// --- ACTIVITIES ROUTES ---

// 1. GET: Display the main Activities list
app.get("/activities", (req, res) => {
  const allActivities = getActivities();
  res.render("activities", {
    activities: allActivities,
    user: null, // Passing null to avoid navbar errors until auth is set up
  });
});

// 2. GET: Display the "Log Adventure" form page
app.get("/activities/create", (req, res) => {
  res.render("createActivity", { user: null });
});

// 3. POST: Receive form data and update the fake-db
app.post("/activities/create", (req, res) => {
  // Destructure data from the form
  const { title, type, difficulty, rating, description, image } = req.body;

  const newActivity = {
    title,
    type,
    difficulty: parseInt(difficulty),
    rating: parseInt(rating) || 5,
    description,
    // Fallback to Chief image if no URL is provided
    image: image || "/images/chief.jpg",
    creator: { uname: "GuestExplorer" },
  };

  // Add the new object to your array in fake-db.js
  addActivity(newActivity);

  // Redirect back to the main list to see the update
  res.redirect("/activities");
});

// Start Server
app.listen(PORT, () =>
  console.log(`✅ ExploreBC running — http://localhost:${PORT}`),
);
