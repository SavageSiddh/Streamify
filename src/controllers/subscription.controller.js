import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID.");
    }

    if (channelId === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel.");
    }

    const existingSubscription = await Subscription.findOne({ channel: channelId, subscriber: subscriberId });

    if (existingSubscription) {
        await existingSubscription.deleteOne();
        return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully."));
    }

    await Subscription.create({ channel: channelId, subscriber: subscriberId });
    res.status(200).json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully."));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid channel ID.");
    }

    const subscribers = await Subscription.find({ channel: subscriberId }).populate("subscriber", "username fullName avatar");
    res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid subscriber ID.");
    }

    const subscriptions = await Subscription.find({ subscriber: channelId }).populate("channel", "username fullName avatar");
    res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
