import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/role.controller";

router.get("/", controller.index);
router.get("/detail/:id", controller.detail);

router.get("/create", controller.create);
router.post("/create", controller.createPost);


router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);

router.patch("/delete/:id", controller.deleteItem);

export const RoleRoutes: Router = router;
