import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import express from "express";
import connectDB from "./db/index.js";
await connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
const app = express();

// ----------------------------------------------
// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(
//       `${process.env.MONGODB_URI}/${DB_NAME}`,
//     );
//     console.log(
//       `\n MongoDB connected successfully to host: ${connectionInstance.connection.host}`,
//     );
//   } catch (error) {
//     console.log("MongoDB connection error", error);
//     process.exit(1);
//   }
// };
