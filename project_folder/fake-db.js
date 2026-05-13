// @ts-nocheck

const users = {
  1: { id: 1, uname: "lindy", password: "123" },
  2: { id: 2, uname: "theo", password: "123" },
};

const posts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam",
    description:
      "New mochi donut shop, Mochido, is set to open later this week. A must-try for foodies in the area!",
    image: "/images/Vancouver.jpg",
    creator: 1,
    timestamp: 1643648446955,
  },
};

const activities = [
  {
    id: 1,
    title: "Hiking Stawamus Chief",
    type: "Hiking",
    difficulty: 5,
    rating: 4,
    description: "A challenging hike with rewarding views of the Howe Sound.",
    image: "/images/chief.jpg",
    creator: { uname: "MeghanC" },
  },
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
  activity.id =
    activities.length > 0 ? activities[activities.length - 1].id + 1 : 1;

  activities.push(activity);
  return activity;
};

const getActivityById = (id) => {
  return activities.find((act) => act.id === Number(id));
};

const updateActivity = (id, updatedActivity) => {
  const activity = getActivityById(id);

  if (!activity) {
    return null;
  }

  activity.title = updatedActivity.title;
  activity.type = updatedActivity.type;
  activity.difficulty = updatedActivity.difficulty;
  activity.rating = updatedActivity.rating;
  activity.description = updatedActivity.description;
  activity.image = updatedActivity.image;

  return activity;
};

const deleteActivity = (id) => {
  const index = activities.findIndex((act) => act.id === Number(id));

  if (index === -1) {
    return false;
  }

  activities.splice(index, 1);
  return true;
};

// --- DESTINATION FUNCTIONS ---
const destinations = [
  { id: "whistler", name: "Whistler", visitCount: 0 },
  { id: "vancouver", name: "Vancouver", visitCount: 0 },
  { id: "tofino", name: "Tofino", visitCount: 0 },
  { id: "victoria", name: "Victoria", visitCount: 0 },
  { id: "kelowna", name: "Kelowna", visitCount: 0 },
  { id: "revelstoke", name: "Revelstoke", visitCount: 0 },
];

const getDestinations = () => destinations;

const incrementVisit = (id) => {
  const dest = destinations.find((d) => d.id === id);

  if (dest) {
    dest.visitCount += 1;
    return dest.visitCount;
  }

  return null;
};

// --- GENERAL DEBUG ---
function debug() {
  console.log("==== DB DEBUGGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("activities", activities);
  console.log("destinations", destinations);
  console.log("==== DB DEBUGGING ====");
}

module.exports = {
  getActivities,
  addActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  addPost,
  addUser,
  getDestinations,
  incrementVisit,
};
