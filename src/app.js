import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
import path from "path";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //get the data from urlencoded form
app.use(express.static(path.join("src/public"))); //get the data from static files
app.use(cookieParser());



//routes import
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";



//routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);





// http://localhost:8000/api/v1/users/register

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;
