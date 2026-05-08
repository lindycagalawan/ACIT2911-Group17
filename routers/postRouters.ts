// @ts-nocheck

// Import required modules
import express from "express";
import * as database from "../controller/postController";
import { ensureAuthenticated } from "../middleware/checkAuth";
import * as db from "../fake-db"; // direct DB access (used in some routes)
import e from "express";

const router = express.Router();

/**
 * GET /posts
 * Displays the homepage with a list of posts
 */
router.get("/", async (req, res) => {
  const posts = await database.getPosts(20); // get latest 20 posts
  const user = await req.user; // current logged-in user (if any)
  res.render("posts", { posts, user });
});

/** Edited by Austin
 * GET /posts/create
 * Displays form to create a new post (only for logged-in users)
 */
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", { user: req.user });
});

/** Edited by Austin
 * POST /posts/create
 * Handles creation of a new post
 * * Validates that title, subgroup, and at least link or description are provided
 * Creates the post and redirects to the new post's page
 */
router.post("/create", ensureAuthenticated, async (req, res) => {
  const { title, link, description, subgroup } = req.body;

  // Rejects if missing required fields
  if (!title || !subgroup || (!link && !description)) {
    return res.render("createPosts", {
      error: "Title, subgroup, and either link or description are needed",
    });
  }

  // Create post in database
  const post = await database.addPost(
    title,
    link,
    req.user.id,
    description,
    subgroup,
  );

  // Redirect to the newly created post
  res.redirect(`/posts/show/${post.id}`);
});

/**
 * GET /posts/show/:postid
 * Displays a single post with its details
 */

router.get("/show/:postid", async (req, res) => {
  const post = await database.getPost(Number(req.params.postid));
  const currentUser = await req.user;

  if (!post) return res.status(404).send("Post not found");

  res.render("individualPost", {
    post,
    user: currentUser,
    isEdit: false,
  });
});

// Edited by Bareera
/**
 * GET /posts/edit/:postid
 * Displays the edit form for a post
 * Only accessible if user is logged in AND is the creator of the post
 */
router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(Number(req.params.postid));
  const currentUser = await req.user;

  if (!post) {
    return res.status(404).send("Post not found");
  }

  if (Number(currentUser.id) !== Number(post.creator.id)) {
    return res.status(403).send("You cannot edit a post you didn't create!");
  }

  res.render("individualPost", {
    post,
    user: currentUser,
    isEdit: true,
  });
});
// Edited by Bareera
/**
 * GET /posts/show/:postid
 * Displays a single post
 */
router.get("/show/:postid", async (req, res) => {
  // Get the post using the post id from the URL
  const post = await database.getPost(Number(req.params.postid));

  // Get the currently logged-in user
  const currentUser = await req.user;

  // If post does not exist, show error
  if (!post) return res.status(404).send("Post not found");

  // Render the page in normal view mode (not editing)
  res.render("individualPost", {
    post,
    user: currentUser,
    isEdit: false,
  });
});

// Edited by Bareera
/**
 * GET /posts/edit/:postid
 * Shows the edit form for a post
 */
router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // Get the post and current user
  const post = await database.getPost(Number(req.params.postid));
  const currentUser = await req.user;

  // If post not found, return error
  if (!post) {
    return res.status(404).send("Post not found");
  }

  // Check if the logged-in user is the creator of the post
  if (Number(currentUser.id) !== Number(post.creator.id)) {
    return res.status(403).send("You cannot edit a post you didn't create!");
  }

  // Render the same page but in edit mode
  res.render("individualPost", {
    post,
    user: currentUser,
    isEdit: true,
  });
});

// Edited by Bareera
/**
 * POST /posts/edit/:postid
 * Updates the post after form submission
 */
router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // Get the post and current user
  const post = await database.getPost(Number(req.params.postid));
  const currentUser = await req.user;

  // If post not found, redirect to homepage
  if (!post) {
    return res.redirect("/");
  }

  // Check if user is allowed to edit this post
  if (Number(currentUser.id) !== Number(post.creator.id)) {
    return res.status(403).send("You cannot edit a post you didn't create!");
  }

  // Get updated values from the form
  const { title, description, link, subgroup } = req.body;

  // Update the post in the database
  db.editPost(req.params.postid, {
    title,
    description,
    link,
    subgroup,
  });

  // Redirect back to the updated post page
  res.redirect(`/posts/show/${req.params.postid}`);
});

/** added by Lindy
 * GET /posts/deleteconfirm/:postid
 * Shows confirmation page before deleting a post
 */
router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const post = await db.getPost(Number(req.params.postid)); // Find the specific post data
  const currentUser = await req.user;

  if (!post) return res.status(404).send("Post not found");

  if (Number(currentUser.id) !== Number(post.creator.id)) {
    return res.status(403).send("You cannot delete a post you didn't create!");
  }
  // Renders a confirmation page so the user doesn't delete by accident
  res.render("deleteconfirm", { post });
});

/** added by Lindy
 * POST /posts/delete/:postid
 * Handles deletion of a post
 */
router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // 1. Fetch the post from the DB and the currently logged-in user
  const post = await db.getPost(Number(req.params.postid));
  const currentUser = await req.user;

  // 2. Safety check: If the post doesn't exist, send them back to the home page
  if (!post) return res.redirect("/");

  // 3. Verifies that the person logged in is the one who created the post
  if (Number(currentUser.id) !== Number(post.creator.id)) {
    return res.status(403).send("You cannot delete a post you didn't create!");
  }

  // If the user clicked a 'cancel' button in the form, redirect them back to the post details without deleting anything.
  if (req.body.cancel) {
    return res.redirect(`/posts/show/${req.params.postid}`);
  }

  const subname = post.subgroup;
  db.deletePost(req.params.postid);
  res.redirect(`/subs/show/${subname}`);
});
//Edited by Bareera
/**
 * POST /posts/vote/:postid
 */
// VOTING LOGIC:
// If a user is at homepage and click on upvote/downvote button it will take the user to individual post page and apply the vote there.
//  The vote will be applied based on the following logic:
// - If a user has not voted before and clicks upvote → create a new upvote
// - If a user has not voted before and clicks downvote → create a new downvote
// - If a user has already upvoted and clicks upvote again → cancel the upvote (remove it)
// - If a user has already downvoted and clicks downvote again → cancel the downvote (remove it)
// - If a user has already upvoted and clicks downvote → cancel the upvote, then apply a downvote
// - If a user has already downvoted and clicks upvote → cancel the downvote, then apply an upvote
router.post("/vote/:postid", ensureAuthenticated, async (req, res) => {
  const postid = Number(req.params.postid);
  const currentUser = await req.user;
  const userId = Number(currentUser.id);
  const requestedVote = Number(req.body.setvoteto);

  // LOGIC: Check if vote exists in fake-db
  const existingVoteIndex = db.votes.findIndex(
    (v) => Number(v.post_id) === postid && Number(v.user_id) === userId,
  );

  if (existingVoteIndex !== -1) {
    const existingValue = Number(db.votes[existingVoteIndex].value);
    if (existingValue === requestedVote) {
      db.votes.splice(existingVoteIndex, 1); // Cancel vote
    } else {
      db.votes[existingVoteIndex].value = requestedVote; // Switch vote
    }
  } else {
    db.votes.push({
      user_id: userId,
      post_id: postid,
      value: requestedVote,
    });
  }

  res.redirect(`/posts/show/${postid}`);
});

/** Edited by Austin
 * POST /posts/comment-create/:postid
 * Handles comment form submission from the individual post page
 * Requires login, rejects empty comments
 * Saves comment with the current user as creator and redirects back to the post
 */

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    const postid = Number(req.params.postid);
    const description = req.body.description;
    const currentUser = await req.user;
    console.log("currentUser:", currentUser);
    console.log("currentUser.id:", currentUser.id);
    if (!description) return res.redirect(`/posts/show/${postid}`);
    await database.addComment(postid, currentUser.id, description);
    res.redirect(`/posts/show/${postid}`);
  },
);

export default router;
