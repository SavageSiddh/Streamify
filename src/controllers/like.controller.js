import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    const likedBy = req.user._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Video unliked successfully."));
    }

    await Like.create({ video: videoId, likedBy });
    res.status(200).json(new ApiResponse(200, { liked: true }, "Video liked successfully."));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const likedBy = req.user._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Comment unliked successfully."));
    }

    await Like.create({ comment: commentId, likedBy });
    res.status(200).json(new ApiResponse(200, { liked: true }, "Comment liked successfully."));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;
    const likedBy = req.user._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Tweet unliked successfully."));
    }

    await Like.create({ tweet: tweetId, likedBy });
    res.status(200).json(new ApiResponse(200, { liked: true }, "Tweet liked successfully."));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedBy = req.user._id;

    const likes = await Like.find({ likedBy, video: { $exists: true } }).populate("video");
    res.status(200).json(new ApiResponse(200, likes, "Liked videos fetched successfully"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
