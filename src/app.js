import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Determine environment
const isProd = process.env.NODE_ENV === "production";

// Get environment-specific URLs
const CORS_ORIGIN = isProd
  ? process.env.PROD_CORS_ORIGIN || "https://videovault-iota.vercel.app"
  : process.env.DEV_CORS_ORIGIN || "http://localhost:3000";

const FRONTEND_URL = isProd
  ? process.env.PROD_FRONTEND_URL || "https://videovault-iota.vercel.app"
  : process.env.DEV_FRONTEND_URL || "http://localhost:3000";

console.log(`Running in ${isProd ? "PRODUCTION" : "DEVELOPMENT"} mode`);
console.log(`CORS Origin: ${CORS_ORIGIN}`);
console.log(`Frontend URL: ${FRONTEND_URL}`);

// Update CORS configuration with explicit credentials support
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = isProd
      ? [CORS_ORIGIN, FRONTEND_URL].filter(Boolean)
      : [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://172.20.32.1:3000",
          "null",
        ];

    // Allow requests with no origin (like mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin} not in`, allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["set-cookie"],
};

// Apply CORS before any routes
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "GET") {
    return next();
  }
  express.json({ limit: "16kb" })(req, res, next);
});

// app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

export { app };
