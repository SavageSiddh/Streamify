import { isValidObjectId } from "mongoose";
import Playlist from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Playlist name is required.");
    }

    const newPlaylist = await Playlist.create({ name, descriptions: description, owner: req.user._id });
    res.status(201).json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const playlists = await Playlist.find({ owner: userId });
    res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const playlistId = req.params.playlistId;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    const userPlaylist = await Playlist.findById(playlistId);
    if (!userPlaylist) {
        throw new ApiError(404, "Playlist not found.");
    }

    res.status(200).json(new ApiResponse(200, userPlaylist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID.");
    }

    const userPlaylist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
    if (!userPlaylist) {
        throw new ApiError(404, "Playlist not found.");
    }

    if (userPlaylist.videos.some((v) => v.toString() === videoId)) {
        throw new ApiError(400, "Video already exists in the playlist.");
    }

    userPlaylist.videos.push(videoId);
    await userPlaylist.save();

    res.status(200).json(new ApiResponse(200, userPlaylist, "Video added to playlist successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID.");
    }

    const userPlaylist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
    if (!userPlaylist) {
        throw new ApiError(404, "Playlist not found.");
    }

    const videoIndex = userPlaylist.videos.findIndex((v) => v.toString() === videoId);
    if (videoIndex === -1) {
        throw new ApiError(404, "Video not found in the playlist.");
    }

    userPlaylist.videos.splice(videoIndex, 1);
    await userPlaylist.save();

    res.status(200).json(new ApiResponse(200, userPlaylist, "Video removed from playlist successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.playlistId;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    const deletedPlaylist = await Playlist.findOneAndDelete({ _id: playlistId, owner: req.user._id });
    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.playlistId;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        { name, descriptions: description },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found.");
    }

    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
