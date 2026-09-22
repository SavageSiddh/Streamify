import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Total videos uploaded by the user
    const totalVideos = await Video.countDocuments({ owner: userId });

    // Total views across all videos
    const totalViews = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const views = totalViews.length > 0 ? totalViews[0].totalViews : 0;

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    // Total likes across all videos
    const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ owner: userId }).distinct("_id") } });

    res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalViews: views,
            totalSubscribers,
            totalLikes,
        }, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch all videos uploaded by the user
    const videos = await Video.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };