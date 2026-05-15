// Testing CI/CD Pipeline
const express = require("express");
const path = require("path");
const session = require("express-session");

const {
  getActivities,
  addActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
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
  }),
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
    destinations: getDestinations(),
  });
});

app.post("/destinations/visit/:id", (req, res) => {
  incrementVisit(req.params.id);
  res.redirect("/destinations");
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
    filteredActivities = allActivities.filter(
      (act) => act.type === selectedType,
    );
  } else {
    filteredActivities = allActivities;
  }

  res.render("activities", {
    pageTitle: "Activities",
    activities: filteredActivities,
    currentFilter: selectedType || "None",
    user: req.session.user || null,
  });
});

// Show create activity form
app.get("/activities/create", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("createActivity", {
    pageTitle: "Share Activity",
    user: req.session.user,
    activity: null,
    formAction: "/activities/create",
    formTitle: "Log Your Activity",
    formDescription: "Share your trail or water experience with the community.",
    buttonText: "Post Activity",
  });
});

// Submit create activity form
app.post("/activities/create", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { title, type, difficulty, rating, description, image } = req.body;

  const newActivity = {
    title,
    type,
    difficulty: parseInt(difficulty),
    rating: parseInt(rating) || 5,
    description,
    image: image || "/images/chief.jpg",
    creator: {
      id: req.session.user.id,
      uname: req.session.user.uname,
    },
  };

  addActivity(newActivity);
  res.redirect("/activities");
});

// Show edit activity form
app.get("/activities/edit/:id", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const activity = getActivityById(req.params.id);

  if (!activity) {
    return res.redirect("/activities");
  }

  if (!activity.creator || activity.creator.id !== req.session.user.id) {
    return res.redirect("/activities");
  }

  res.render("createActivity", {
    pageTitle: "Edit Activity",
    user: req.session.user,
    activity,
    formAction: `/activities/edit/${activity.id}`,
    formTitle: "Edit Your Activity",
    formDescription: "Update your activity details below.",
    buttonText: "Save Changes",
  });
});

// Submit edit activity form
app.post("/activities/edit/:id", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const activity = getActivityById(req.params.id);

  if (!activity) {
    return res.redirect("/activities");
  }

  if (!activity.creator || activity.creator.id !== req.session.user.id) {
    return res.redirect("/activities");
  }

  const { title, type, difficulty, rating, description, image } = req.body;

  updateActivity(req.params.id, {
    title,
    type,
    difficulty: parseInt(difficulty),
    rating: parseInt(rating) || 5,
    description,
    image: image || "/images/chief.jpg",
  });

  res.redirect("/activities");
});

// Delete activity
app.post("/activities/delete/:id", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const activity = getActivityById(req.params.id);

  if (!activity) {
    return res.redirect("/activities");
  }

  if (!activity.creator || activity.creator.id !== req.session.user.id) {
    return res.redirect("/activities");
  }

  deleteActivity(req.params.id);
  res.redirect("/activities");
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ ExploreBC running — http://localhost:${PORT}`);
  });
}

module.exports = app;
