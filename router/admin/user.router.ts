import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/user.controller";

router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.patch("/changeStatus/:status/:id", controller.changeStatus);
router.patch("/delete/:id", controller.deleteItem);

export const userRoutes: Router = router;
