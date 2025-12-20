import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/topic.controller";


router.get("/", controller.topics);

export const topicRoutes: Router = router;