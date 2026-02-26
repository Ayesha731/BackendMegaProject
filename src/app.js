import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //get the data from urlencoded form
app.use(express.static(path.join(__dirname, "public"))); //get the data from static files
app.use(cookieParser());

export default app;
