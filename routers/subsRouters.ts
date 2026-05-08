// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
import * as db from "../fake-db"; //added by Lindy

const router = express.Router();

/** added by Lindy
 * GET /subs/list
 * Displays a list of all subgroups
 */
router.get("/list", async (req, res) => {
  const subs = db.getSubs().sort();
  res.render("subs", { subs: subs, user: req.user });
});

/**
 * GET /subs/show/:subname
 * Displays all posts that belong to a specific subgroup
 */
router.get("/show/:subname", async (req, res) => {

  // 1. Extract subgroup name from URL
  const subname = req.params.subname;
  
  // 2. Get posts from database filtered by subgroup
  // getPosts(n, sub) → returns 'n' posts from a specific subgroup
  const posts = await database.getPosts(20, subname);
  
  // 3. Render the 'sub' view and pass data
  res.render("sub", {
    posts: posts, // list of posts in this subgroup
    subname: subname,
    user: req.user, // used for displaying subgroup name in UI
  });
});

export default router;
