import { Router } from "express";
import { discoverChannels } from "../controllers/discover.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/channels", verifyJWT, discoverChannels);

// router.get("/trending-videos", getTrendingVideos);
// router.get("/recommended", getRecommendedContent);

export default router;
