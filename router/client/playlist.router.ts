import { Router } from "express";
import * as controller from "../../controller/client/playlist.controller";

const router: Router = Router();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/api/mine", controller.mineApi);
router.get("/:slug", controller.detail);
router.post("/:id/songs", controller.addSong);
router.patch("/:id/songs/:songId", controller.removeSong);
router.patch("/delete/:id", controller.deleteItem);

export const playlistRoutes: Router = router;
