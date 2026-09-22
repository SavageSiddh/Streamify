import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: false  
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
            required: false
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: false
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const Like = mongoose.model("Like" , likeSchema)
export default Like