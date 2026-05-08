const express = require("express");
const path = require("path");
const session = require("express-session");

const {
  getActivities,
  addActivity,
  getUserByUsername,
  getDestinations,
  incrementVisit,
} = require("./fake-db");

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "explorebc-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- ROUTES ---

// Home Page
app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
    user: req.session.user || null,
  });
});

// Destinations Page
app.get("/destinations", (req, res) => {
  res.render("destinations", {
    pageTitle: "Destinations",
    user: req.session.user || null,
    destinations: getDestinations() // Pass the counts to the EJS
  });
});

app.post("/destinations/visit/:id", (req, res) => {
  incrementVisit(req.params.id);
  res.redirect("/destinations"); // Refresh the page to show the new count
});

// Food & Restaurants Page
app.get("/food", (req, res) => {
  res.render("food", {
    pageTitle: "Food & Restaurants",
    user: req.session.user || null,
  });
});

// Contact Page
app.get("/contact", (req, res) => {
  res.render("contact", {
    pageTitle: "Contact Us",
    user: req.session.user || null,
  });
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login", {
    pageTitle: "Login",
    user: req.session.user || null,
    error: null,
  });
});

// Login Form Submit
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = getUserByUsername(username);

  if (!user) {
    return res.render("login", {
      pageTitle: "Login",
      user: null,
      error: "Username not found.",
    });
  }

  if (user.password !== password) {
    return res.render("login", {
      pageTitle: "Login",
      user: null,
      error: "Incorrect password.",
    });
  }

  req.session.user = {
    id: user.id,
    uname: user.uname,
  };

  res.redirect("/");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// --- ACTIVITIES ROUTES ---

app.get("/activities", (req, res) => {
    const allActivities = getActivities();
    const selectedType = req.query.act_filter;

    let filteredActivities;
    if (selectedType && selectedType !== "None") {
        filteredActivities = allActivities.filter(act => act.type === selectedType);
    } else {
        filteredActivities = allActivities;
    }

    res.render("activities", {
        pageTitle: "Activities",
        activities: filteredActivities,
        currentFilter: selectedType || "None", // This fixes your ReferenceError
        user: req.session.user || null,
    });
});

app.get("/activities/create", (req, res) => {
    // Basic protection: if no user in session, redirect to login
    if (!req.session.user) {
        return res.redirect("/login");
    }
    
    res.render("createActivity", {
        pageTitle: "Share Activity",
        user: req.session.user || null,
    });
});

app.post("/activities/create", (req, res) => {
    const { title, type, difficulty, rating, description, image } = req.body;

    const creatorName = req.session.user ? req.session.user.uname : "GuestExplorer";

    const newActivity = {
        title,
        type,
        difficulty: parseInt(difficulty),
        rating: parseInt(rating) || 5,
        description,
        image: image || "/images/chief.jpg",
        creator: { uname: creatorName },
    };

    addActivity(newActivity);
    res.redirect("/activities");
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ ExploreBC running — http://localhost:${PORT}`);
    });
}


module.exports = app;