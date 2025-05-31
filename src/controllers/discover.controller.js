import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

const discoverChannels = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "subscribers",
      filter,
      search,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Validate pagination
    if (pageNumber < 1 || limitNumber < 1) {
      throw new ApiError(400, "Invalid pagination parameters");
    }

    // Build query
    let query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { fullname: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalChannels = await User.countDocuments(query);

    // Skip calculation
    const skipDocuments = (pageNumber - 1) * limitNumber;

    // Determine sort order
    let sortOptions = {};

    switch (sort) {
      case "subscribers":
        sortOptions = { subscribersCount: -1 };
        break;
      case "videos":
        sortOptions = { videosCount: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { subscribersCount: -1 };
    }

    // Execute query with aggregation pipeline to include subscriber counts
    const channels = await User.aggregate([
      // Initial match based on our query
      { $match: query },

      // Add counts of subscribers and videos
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "videos",
        },
      },

      // Add computed fields
      {
        $addFields: {
          subscribersCount: { $size: "$subscribers" },
          videosCount: { $size: "$videos" },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },

      // Remove sensitive fields
      {
        $project: {
          username: 1,
          fullname: 1,
          avatar: 1,
          coverImage: 1,
          subscribersCount: 1,
          videosCount: 1,
          isSubscribed: 1,
          createdAt: 1,
        },
      },

      // Sort by the selected option
      { $sort: sortOptions },

      // Pagination
      { $skip: skipDocuments },
      { $limit: limitNumber },
    ]);

    // Return response with pagination metadata
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          channels,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(totalChannels / limitNumber),
            totalResults: totalChannels,
            hasNextPage: skipDocuments + channels.length < totalChannels,
            hasPrevPage: pageNumber > 1,
          },
        },
        "Channels fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while fetching channels"
    );
  }
});

export { discoverChannels };
