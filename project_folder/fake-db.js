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
{
    id: 2,
    title: "Joffre Lakes Provincial Park",
    type: "Hiking",
    difficulty: 3,
    rating: 5,
    description: "The turquoise water of the three lakes is stunning. The trail is well-maintained but can get very crowded on weekends.",
    image: "/images/joffre.jpg",
    creator: { uname: "AlpineAdventurer" },
  },
  {
    id: 3,
    title: "Okanagan Lake Boating",
    type: "Boating",
    difficulty: 2,
    rating: 5,
    description: "Perfect for a summer day. The water is calm and there are plenty of spots to anchor and enjoy the vineyard views.",
    image: "/images/okanaganboating.jpg",
    creator: { uname: "LakeLife99" },
  },
  {
    id: 4,
    title: "Cultus Lake Swimming",
    type: "Swimming",
    difficulty: 1,
    rating: 4,
    description: "A classic family spot. The water is surprisingly warm for BC, and the designated swimming areas are very safe.",
    image: "/images/cultusswim.jpg",
    creator: { uname: "FamilyTravels" },
  },
  {
    id: 5,
    title: "The West Coast Trail",
    type: "Hiking",
    difficulty: 5,
    rating: 5,
    description: "The ultimate BC backpacking experience. Extremely grueling with ladders and mud, but the coastal scenery is unmatched.",
    image: "/images/westcoasttrail.jpg",
    creator: { uname: "TrailBlazer" },
  },
  {
    id: 6,
    title: "Desolation Sound Kayaking",
    type: "Boating",
    difficulty: 4,
    rating: 5,
    description: "Incredible multi-day paddling. The water is warm enough for a quick dip, and the mountain backdrop is majestic.",
    image: "/images/desolationsound.jpg",
    creator: { uname: "PaddleMaster" },
  },
  {
    id: 7,
    title: "Sasamat Lake Loop",
    type: "Hiking",
    difficulty: 2,
    rating: 3,
    description: "An easy, flat stroll around the lake. Great for a quick nature fix near the city, though parking is a nightmare.",
    image: "/images/sasamatlake.jpg",
    creator: { uname: "CityEscapist" },
  },
  {
    id: 8,
    title: "Osoyoos Lake Dip",
    type: "Swimming",
    difficulty: 1,
    rating: 5,
    description: "Known as Canada's warmest lake. It feels like swimming in a heated pool during August!",
    image: "/images/osoyooslake.jpg",
    creator: { uname: "SunnySide" },
  },
  {
    id: 9,
    title: "Garibaldi Lake Hike",
    type: "Hiking",
    difficulty: 4,
    rating: 5,
    description: "A steady incline through the forest that opens up to a breathtaking glacial lake. Worth every drop of sweat.",
    image: "/images/garibaldihike.jpg",
    creator: { uname: "PeakSeeker" },
  },
  {
    id: 10,
    title: "Harrison Lake Jet Boating",
    type: "Boating",
    difficulty: 3,
    rating: 4,
    description: "A bit choppy when the wind picks up, but exploring the Harrison River by boat is a fantastic experience.",
    image: "/images/harrisonboating.jpg",
    creator: { uname: "RiverRunner" },
  },
  {
    id: 11,
    title: "Whistler Lost Lake Swim",
    type: "Swimming",
    difficulty: 2,
    rating: 4,
    description: "A peaceful spot tucked away from the main village. The docks are great for jumping into the crisp water.",
    image: "/images/lostlake.jpg",
    creator: { uname: "MountainGirl" },
  },
  {
    id: 12,
    title: "Stanley Park Seawall",
    type: "Other",
    difficulty: 1,
    rating: 5,
    description: "Whether you're biking or walking, this is the best way to see Vancouver's skyline and the Pacific ocean.",
    image: "/images/bikingseawall.jpg",
    creator: { uname: "VanCityLocal" },
  },
  {
    id: 13,
    title: "Buntzen Lake Trail",
    type: "Hiking",
    difficulty: 3,
    rating: 4,
    description: "A solid moderate hike with some elevation. The suspension bridge at the far end is a cool highlight.",
    image: "/images/buntzenlake.jpg",
    creator: { uname: "HikeBC" },
  },
  {
    id: 14,
    title: "Saanich Inlet Sailing",
    type: "Boating",
    difficulty: 4,
    rating: 5,
    description: "Deep waters and reliable winds make this a sailor's paradise on Vancouver Island.",
    image: "/images/sasamatlake.jpg",
    creator: { uname: "IslandSailor" },
  },
  {
    id: 15,
    title: "Kitsilano Beach Swimming",
    type: "Swimming",
    difficulty: 1,
    rating: 4,
    description: "Great ocean swimming with a view of the North Shore mountains. The salt water is refreshing on a hot day.",
    image: "/images/kitsswim.jpg",
    creator: { uname: "BeachBum" },
  },
  {
    id: 16,
    title: "Capilano Suspension Bridge",
    type: "Other",
    difficulty: 2,
    rating: 3,
    description: "Very touristy and pricey, but walking through the treetops and across the canyon is quite a thrill.",
    image: "/images/capbridge.jpg",
    creator: { uname: "TouristJoe" },
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
