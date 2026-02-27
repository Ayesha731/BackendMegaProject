//CONNECT MONGODG and write its function
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connectDB = async () => {
  try {
   const connectionInstance = await mongoose.connect(
  `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
);
    console.log(
      `\nMongoDB connected successfully to host ${connectionInstance.connection.host} and database name ${connectionInstance.connection.name}`,   
    );
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
export default connectDB;
