// @ts-nocheck
import express from "express";
import * as database from "../fake-db";
import { ensureAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

// GET /comments/show/:commentid
// Shows a single comment — used as a landing page for comment links
router.get("/show/:commentid", async (req, res) => {
  const comment = await database.getComment(Number(req.params.commentid));
  if (!comment) return res.status(404).send("Comment not found");
  res.render("comments/show", { comment, user: req.user });
});

// GET /comments/edit/:commentid
// Shows the edit form for a comment
// Only the comment's creator can access this page
router.get("/edit/:commentid", ensureAuthenticated, async (req, res) => {
  const comment = await database.getComment(Number(req.params.commentid));
  if (!comment) return res.status(404).send("Comment not found");
  const currentUser = await req.user;
  // Block access if user is not the creator
  if (Number(comment.creator) !== Number(currentUser.id)) {
    return res.status(403).send("You cannot edit a comment you didn't create!");
  }
  res.render("comments/edit", { comment, user: currentUser });
});

// POST /comments/edit/:commentid
// Handles the edit form submission
// Verifies ownership before updating the comment text
router.post("/edit/:commentid", ensureAuthenticated, async (req, res) => {
  const comment = await database.getComment(Number(req.params.commentid));
  if (!comment) return res.status(404).send("Comment not found");
  const currentUser = await req.user;
  if (Number(comment.creator) !== Number(currentUser.id)) {
    return res.status(403).send("You cannot edit a comment you didn't create!");
  }
  // Update the comment description in the database
  await database.editComment(
    Number(req.params.commentid),
    req.body.description,
  );
  res.redirect(`/posts/show/${comment.post_id}`);
});

// GET /comments/deleteconfirm/:commentid
// Shows a confirmation page before deleting a comment
// Only the comment's creator can access this page
router.get(
  "/deleteconfirm/:commentid",
  ensureAuthenticated,
  async (req, res) => {
    const comment = await database.getComment(Number(req.params.commentid));
    if (!comment) return res.status(404).send("Comment not found");
    const currentUser = await req.user;
    if (Number(comment.creator) !== Number(currentUser.id)) {
      return res
        .status(403)
        .send("You cannot delete a comment you didn't create!");
    }
    res.render("comments/deleteconfirm", { comment, user: currentUser });
  },
);

// POST /comments/delete/:commentid
// Handles the delete confirmation form submission
// If cancelled, redirects back to the post
// If confirmed, deletes the comment and redirects back to the post
router.post("/delete/:commentid", ensureAuthenticated, async (req, res) => {
  const comment = await database.getComment(Number(req.params.commentid));
  if (!comment) return res.status(404).send("Comment not found");
  const currentUser = await req.user;
  if (Number(comment.creator) !== Number(currentUser.id)) {
    return res
      .status(403)
      .send("You cannot delete a comment you didn't create!");
  }
  const post_id = comment.post_id;
  // If user clicked cancel, go back to the post without deleting
  if (req.body.cancel) return res.redirect(`/posts/show/${post_id}`);
  // Delete the comment and redirect back to the post
  await database.deleteComment(Number(req.params.commentid));
  res.redirect(`/posts/show/${post_id}`);
});

export default router;
