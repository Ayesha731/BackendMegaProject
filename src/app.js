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

//routes declaration
app.use("/api/v1/users", userRoutes);

// http://localhost:8000/api/v1/users/register


export default app;
