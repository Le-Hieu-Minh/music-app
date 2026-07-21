import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/singer.controller";

router.get("/", controller.index);
router.get("/:slug", controller.detail);

export const singerRoutes: Router = router;
