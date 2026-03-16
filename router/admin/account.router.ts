import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/account.controller";


router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);

router.get("/detail/:id", controller.detail);
router.patch("/delete/:id", controller.deleteItem);

export const accountRoutes: Router = router;