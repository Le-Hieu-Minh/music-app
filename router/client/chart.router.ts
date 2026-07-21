import { Router } from "express";
import * as controller from "../../controller/client/chart.controller";

const router: Router = Router();
router.get("/", controller.index);

export const chartRoutes: Router = router;
