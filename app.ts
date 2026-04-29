import express from "express";
import session from "express-session";
import passport from "./middleware/passport";

// Import routers
import indexRoute from "./routers/indexRoute";
import authRoute from "./routers/authRoute";
import postsRoute from "./routers/postRouters";
import subsRouters from "./routers/subsRouters";
import commentsRouter from "./routers/commentsRouters";

const PORT = process.env.PORT || 8000;
const app = express();

app.set("trust proxy", 1);
app.set("view engine", "ejs");

// 1. Static files and Body Parsing
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Session Configuration
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// 3. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Global Variables Middleware (MUST be before the routes)
// This makes "user" available in every EJS file automatically
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// 5. Use Routers
app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/subs", subsRouters);
app.use("/comments", commentsRouter);
app.use("/", indexRoute); // Usually best to keep the root / at the bottom

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}/`),
);