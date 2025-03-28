import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const healthCheck = asyncHandler(async (req, res) => {
  // Check database connection
  try {
    await mongoose.connection.db.admin().ping();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          status: "ok",
          database: "connected",
          uptime: process.uptime() + " seconds",
        },
        "Health check successful"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(
        500,
        {
          status: "error",
          database: "disconnected",
          error: error.message,
        },
        "System unhealthy"
      )
    );
  }
});

export { healthCheck };
