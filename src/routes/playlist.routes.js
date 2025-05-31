import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistById,
  getUserPlaylists,
} from "../controllers/playlist.controller.js";

const router = Router();

// Skip OPTIONS requests in this route file too
router.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Apply authentication to all routes
router.use(verifyJWT);

// Separate routes by their needs - some need Multer, some don't
router.route("/").post(createPlaylist);
router
  .route("/:playlistId")
  .delete(deletePlaylist)
  .patch(updatePlaylist)
  .get(getPlaylistById);
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);
router.route("/user/:userId").get(getUserPlaylists);

export default router;
