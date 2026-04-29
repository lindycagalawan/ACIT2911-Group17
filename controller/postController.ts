import * as db from "../fake-db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub?: string) {
  // Force TypeScript to accept optional sub
  return db.getPosts(n, sub as any);
}

async function getPost(id: number) {
  return db.getPost(id);
}

async function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string,
) {
  return db.addPost(title, link, creator, description, subgroup);
}

async function addComment(
  post_id: string,
  creator: number,
  description: string,
) {
  return db.addComment(post_id, creator, description);
}

// Get a single comment by ID
async function getComment(id: number) {
  return db.getComment(id);
}

// Edit a comment
async function editComment(comment_id: number, description: string) {
  return db.editComment(comment_id, description);
}

// Delete a comment
async function deleteComment(comment_id: number) {
  return db.deleteComment(comment_id);
}

async function setVote(post_id: number, user_id: number, value: number) {
  return db.setVote(post_id, user_id, value);
}

export {
  getPosts,
  getPost,
  addComment,
  addPost,
  setVote,
  getComment,
  editComment,
  deleteComment,
};

//added by Lindy
export const getDeleteConfirm = (req: any, res: any) => {
  const postid = req.params.postid;
  const post = db.getPost(postid);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  if (!req.user || req.user.id !== post.creator.id) {
    return res
      .status(403)
      .send("You do not have permission to delete this post.");
  }

  res.render("deleteconfirm", { post });
};

export const postDelete = (req: any, res: any) => {
  const postid = req.params.postid;
  const post = db.getPost(postid);

  if (!post) {
    return res.redirect("/posts");
  }

  const subName = post.subgroup;
  db.deletePost(postid);

  res.redirect("/subs/show/" + subName);
};
