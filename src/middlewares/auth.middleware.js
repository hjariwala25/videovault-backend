import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Enhanced token retrieval with detailed logging
    console.log("Cookie content:", req.cookies);

    // Try to get token from various sources
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.accessToken ||
      req.query?.accessToken;

    console.log("Auth attempt with token:", token ? "Present" : "Missing");

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid user credentials");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid user credentials");
  }
});
