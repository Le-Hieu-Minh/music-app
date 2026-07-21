import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/song.controller";
import * as authMiddleware from "../../middlewares/client/auth.middleware";

// Chi tiết phải đăng ký trước /:slugTopic để tránh khớp nhầm "detail"
router.get("/detail/:slugSong", controller.detail);
router.get("/:slugTopic", controller.list);
router.patch("/like/:typeLike/:idSong", authMiddleware.requireAuth, controller.like);
router.patch("/favorite/:typeFavorite/:idSong", authMiddleware.requireAuth, controller.favorite);
router.patch("/listen/:idSong", controller.listen);

export const songRoutes: Router = router;
