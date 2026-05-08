import express from "express";
import * as db from "../fake-db"; 

const router = express.Router();

// Home Page
router.get("/", (req, res) => {
    const posts = db.getPosts(); 
    res.render("index", { posts });
});

// Destinations Page
router.get("/destinations", (req, res) => {
    res.render("destinations");
});

// Activities Page
router.get("/activities", (req, res) => {
    res.render("activities");
});

// Food & Restaurants Page
router.get("/food", (req, res) => {
    res.render("food");
});

// Contact Page
router.get("/contact", (req, res) => {
  res.render("contact");
});

export default router;