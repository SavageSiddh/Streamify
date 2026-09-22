import fs from "fs";
import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required.");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and thumbnail are required.");
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (fs.existsSync(videoLocalPath)) fs.unlinkSync(videoLocalPath);
    if (fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);

    if (!videoUpload || !thumbnailUpload) {
        throw new ApiError(500, "Error while uploading video.");
    }

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        duration: videoUpload.duration || 0,
        owner: req.user._id,
        isPublished: true,
    });

    res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const update = { title, description };

    const thumbnailLocalPath = req.file?.path;
    if (thumbnailLocalPath) {
        const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
        if (fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath);
        if (thumbnailUpload?.url) update.thumbnail = thumbnailUpload.url;
    }

    const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId, owner: req.user._id },
        update,
        { new: true }
    );

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found or you are not authorized to update it.");
    }

    res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const deletedVideo = await Video.findOneAndDelete({ _id: videoId, owner: req.user._id });

    if (!deletedVideo) {
        throw new ApiError(404, "Video not found or you are not authorized to delete it.");
    }

    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findOne({ _id: videoId, owner: req.user._id });

    if (!video) {
        throw new ApiError(404, "Video not found or you are not authorized to update it.");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(200, video, "Publish status toggled successfully"));
});

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
