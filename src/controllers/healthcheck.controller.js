import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
    // Build a healthcheck response that returns the OK status with a message
    res.status(200).json(new ApiResponse(200, { status: "UP" }, "Health Check OK"));
});

export { healthCheck };