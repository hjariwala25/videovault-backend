import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Determine environment
const isProd = process.env.NODE_ENV === "production";

// Get environment-specific URLs
const CORS_ORIGIN = isProd
  ? process.env.PROD_CORS_ORIGIN || "https://videovault.hitanshujariwala.live"
  : process.env.DEV_CORS_ORIGIN || "http://localhost:3000";

const FRONTEND_URL = isProd
  ? process.env.PROD_FRONTEND_URL || "https://videovault.hitanshujariwala.live"
  : process.env.DEV_FRONTEND_URL || "http://localhost:3000";

console.log(`Running in ${isProd ? "PRODUCTION" : "DEVELOPMENT"} mode`);
console.log(`CORS Origin: ${CORS_ORIGIN}`);
console.log(`Frontend URL: ${FRONTEND_URL}`);

// Update CORS configuration with explicit credentials support
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request origin:", origin);
    const allowedOrigins = isProd
      ? [CORS_ORIGIN, FRONTEND_URL].filter(Boolean)
      : [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://172.20.32.1:3000",
        ];

    // For development, allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // console.log(`CORS blocked origin: ${origin} not in`, allowedOrigins);
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  exposedHeaders: ["set-cookie"],
  preflightContinue: false, // IMPORTANT: Change this to false
  optionsSuccessStatus: 204,
};

// Apply CORS before any routes
app.use(cors(corsOptions));

// No need for this when preflightContinue is false
// app.options("*", cors(corsOptions));

// Using cookie parser early in the middleware chain
app.use(cookieParser());

// Parse JSON bodies based on Content-Type - MOVED after cookieParser
app.use((req, res, next) => {
  // Skip body parsing for OPTIONS requests
  if (req.method === "OPTIONS") {
    return next();
  }

  if (req.method === "GET") {
    return next();
  }

  express.json({ limit: "16kb" })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import discoverRouter from "./routes/discover.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/discover", discoverRouter);

// Debug route for CORS testing
app.get("/api/v1/cors-debug", (req, res) => {
  res.json({
    message: "CORS GET is working",
    headers: req.headers,
    method: req.method,
    cookies: req.cookies,
  });
});

// Debug route for CORS POST testing
app.post("/api/v1/cors-debug", (req, res) => {
  res.json({
    message: "CORS POST is working",
    body: req.body,
    headers: req.headers,
    method: req.method,
    cookies: req.cookies,
  });
});

// Handle OPTIONS globally with proper headers
app.options("*", (req, res) => {
  res.status(204).end();
});

export { app };
