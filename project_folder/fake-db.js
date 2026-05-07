// @ts-nocheck

const users = {
  1: { id: 1, uname: "lindy", password: "123" },
  2: { id: 2, uname: "theo", password: "123" },
};

const posts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam",
    description: "New mochi donut shop, Mochido, is set to open later this week. A must-try for foodies in the area!",
    image: "/images/Vancouver.jpg",
    creator: 1,
    timestamp: 1643648446955,
  },
};

const activities = [
{
  id: 1,
  title: "Hiking Stawamus Chief",
  type: "Outdoor",
  difficulty: 5,
  rating: 4,
  description: "A challenging hike with rewarding views of the Howe Sound.",
  image: "/images/chief.jpg",
  creator: { uname: "MeghanC" }
}
];

// --- USER FUNCTIONS ---
function getUser(id) {
  return users[id];
}

function getUserByUsername(uname) {
  return Object.values(users).find((user) => user.uname === uname) || null;
}

function addUser(uname, password) {
  const id = Math.max(...Object.keys(users).map(Number)) + 1;
  const newUser = { id, uname, password };
  users[id] = newUser;
  return newUser;
}

// --- POST FUNCTIONS (Home Page Stories) ---
function decoratePost(post) {
  return {
    ...post,
    creator: users[post.creator],
  };
}

function getPosts(n = 5) {
  let allPosts = Object.values(posts);
  allPosts.sort((a, b) => b.timestamp - a.timestamp);
  return allPosts.slice(0, n).map(decoratePost);
}

function addPost(title, description, creator, image) {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    description,
    creator: Number(creator),
    image: image || "/images/default.jpg",
    timestamp: Date.now(),
  };
  posts[id] = post;
  return post;
}

// --- ACTIVITY FUNCTIONS ---
const getActivities = () => activities;

const addActivity = (activity) => {
  activity.id = activities.length + 1; 
  activities.push(activity);
};

const getActivityById = (id) => {
  return activities.find(act => act.id === id);
};

// --- GENERAL DEBUG ---
function debug() {
  console.log("==== DB DEBUGGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("activities", activities);
  console.log("==== DB DEBUGGING ====");
}

// At the bottom of fake-db.js, replace the ' lines with:
module.exports = {
    activities,
    getActivities,
    addActivity,
    getActivityById,
    debug,
    getUser,
    getUserByUsername,
    getPosts,
    addPost,
    addUser
};