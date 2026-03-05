//healthcheck controller--->to handle the healthcheck related requests
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//healthcheck-->to check if the server is running or not
const healthcheck = asyncHandler(async (req, res) => {
    // -------Rules for healthcheck flow-------
    //return the healthcheck status
    return res.status(200).json(new ApiResponse(200, "Healthcheck successful"));
});
export { healthcheck };