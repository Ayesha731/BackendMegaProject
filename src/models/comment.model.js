//comments model--->to store the comments details of the video
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},{timestamps: true});
commentSchema.plugin(mongooseAggregatePaginate);//this is a plugin of mongoose to give ability to paginate the comments
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
