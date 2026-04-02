import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/home.controller";


router.get("/", controller.index);

export const homeRoutes: Router = router;