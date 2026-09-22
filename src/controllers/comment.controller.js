import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const comments = await Comment.find({ video: videoId }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    const { content } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required.");
    }

    const newComment = await Comment.create({
        video: videoId,
        owner: req.user._id,
        content,
    });

    res.status(201).json(new ApiResponse(201, newComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required.");
    }

    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: req.user._id },
        { content },
        { new: true }
    );

    if (!updatedComment) {
        throw new ApiError(404, "Comment not found or you are not authorized to update it.");
    }

    res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    const deletedComment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user._id,
    });

    if (!deletedComment) {
        throw new ApiError(404, "Comment not found or you are not authorized to delete it.");
    }

    res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
