//likes model--->to store the likes details of the video
import mongoose, { Schema } from "mongoose";
const likeSchema = new Schema({
   comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
    },
   video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true,
    },
   likedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
   tweet:{
    type: Schema.Types.ObjectId,
    ref: "Tweet",
   
   },

},{timestamps: true});
const Like = mongoose.model("Like", likeSchema);
export default Like;