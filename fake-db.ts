// @ts-nocheck

const users = {
  1: {
    id: 1,
    uname: "alice",
    password: "alpha",
  },
  2: {
    id: 2,
    uname: "theo",
    password: "123",
  },
  3: {
    id: 3,
    uname: "prime",
    password: "123",
  },
  4: {
    id: 4,
    uname: "leerob",
    password: "123",
  },
};

const posts = {
  101: {
    id: 101,
    title: "Surfing in Tofino",
    location: "Tofino",
    description: "The waves at Cox Bay were incredible this morning!",
    creator: 1, // Alice
    image: "/images/surfing.jpg",
    timestamp: Date.now(),
  },
  // ... more entries
};

// Update addPost to include location and image
function addPost(title, location = "General", creator, description, image = "/images/default.jpg") {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    location, // This replaces subgroup for your travel blog
    description,
    creator: Number(creator),
    image,
    timestamp: Date.now(),
  };
  posts[id] = post;
  return post;
}

const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
  },
};

const votes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
];

function debug() {
  console.log("==== DB DEBUGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("comments", comments);
  console.log("votes", votes);
  console.log("==== DB DEBUGING ====");
}

function getUser(id) {
  return users[id];
}

function getUserByUsername(uname: any) {
  const user = Object.values(users).find((user) => user.uname === uname);
  return user ? user : null;
}

function getVotesForPost(post_id) {
  return votes.filter((vote) => vote.post_id === post_id);
}

function decoratePost(post) {
  post = {
    ...post,
    creator: users[post.creator],
    votes: getVotesForPost(post.id),
    comments: Object.values(comments)
      .filter((comment) => Number(comment.post_id) === Number(post.id))
      .map((comment) => ({
        ...comment,
        creator: users[Number(comment.creator)],
      })),
  };
  return post;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */

function getPosts(n = 5, loc = undefined) {
  let allPosts = Object.values(posts);
  if (loc) {
    // Change this from .subgroup to .location
    allPosts = allPosts.filter((post) => post.location === loc);
  }
  allPosts.sort((a, b) => b.timestamp - a.timestamp);
  return allPosts.slice(0, n).map(decoratePost);
}

function getPost(id) {
  return decoratePost(posts[id]);
}


function editPost(post_id, changes = {}) {
  let post = posts[post_id];

  if (!post) return; // prevent crash if post doesn't exist

  if (changes.title) {
    post.title = changes.title;
  }
  if (changes.link) {
    post.link = changes.link;
  }
  if (changes.description) {
    post.description = changes.description;
  }
  if (changes.subgroup) {
    post.subgroup = changes.subgroup;
  }
}

function deletePost(post_id) {
  // delete all comments belonging to this post
  Object.keys(comments).forEach((key) => {
    if (Number(comments[key].post_id) === Number(post_id)) {
      delete comments[key];
    }
  });
  // then delete the post itself
  delete posts[post_id];
}

function getSubs() {
  // Change this from .subgroup to .location
  return Array.from(new Set(Object.values(posts).map((post) => post.location)));
}

function addComment(post_id, creator, description) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: Number(post_id),
    creator: Number(creator),
    description,
    timestamp: Date.now(),
  };
  comments[id] = comment;
  return comment;
}

function getComment(id: number) {
  return comments[id];
}

function editComment(comment_id: number, description: string) {
  const comment = comments[comment_id];
  if (comment) comment.description = description;
}

function deleteComment(comment_id: number) {
  delete comments[comment_id];
}

function getVoteByUser(post_id: number, user_id: number) {
  return votes.find(
    (v) =>
      Number(v.post_id) === Number(post_id) &&
      Number(v.user_id) === Number(user_id),
  );
}

function setVote(post_id: number, user_id: number, value: number) {
  const existing = getVoteByUser(post_id, user_id);
  if (existing) {
    if (value === 0) {
      // remove the vote
      const index = votes.indexOf(existing);
      votes.splice(index, 1);
    } else {
      existing.value = value;
    }
  } else if (value !== 0) {
    votes.push({ post_id, user_id, value });
  }
}
// added by Lindy
// Logic to generate a new ID and save the user to the user's object
function addUser(uname, password) {
  const id = Math.max(...Object.keys(users).map(Number)) + 1;
  const newUser = { id, uname, password };
  users[id] = newUser;
  return newUser;
}

export {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  decoratePost,
  setVote,
  votes,
  getComment,
  editComment,
  deleteComment,
  addUser,
};
