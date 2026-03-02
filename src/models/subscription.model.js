//subscription model--->to store the subscription details of the user
import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,//one who is subscribing
        ref: "User",
        required: true,
    },
   channel: {
    type: Schema.Types.ObjectId,//one who is being subscribed to--->channel---->channel ka user hai jo subscribe kr rha hai
    ref: "User",//channel ka user hai jo subscribe kr rha hai
    required: true,
   },
  
},{timestamps: true});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;